class StripeWebhooksController < ActionController::API
  def create
    payload = request.body.read
    sig_header = request.env["HTTP_STRIPE_SIGNATURE"]
    secret = ENV["STRIPE_WEBHOOK_SECRET"]

    event =
      if secret && sig_header
        ::Stripe::Webhook.construct_event(payload, sig_header, secret)
      else
        ::Stripe::Event.construct_from(JSON.parse(payload, symbolize_names: true))
      end

    handle_event(event)

    head :ok
  rescue JSON::ParserError, ::Stripe::SignatureVerificationError
    head :bad_request
  end

  private

  def handle_event(event)
    case event.type
    when "checkout.session.completed"
      data = event.data.object
      checkout = Checkout.find_by(stripe_session_id: data.id)
      if checkout
        checkout.update(
          status: "paid",
          stripe_payment_intent_id: data.payment_intent,
          raw_data: data.to_hash
        )
      end
    when "customer.subscription.created", "customer.subscription.updated"
      data = event.data.object
      handle_subscription_event(data)
    when "invoice.payment_failed"
      data = event.data.object
      handle_invoice_payment_failed(data)
    end
  end

  def handle_subscription_event(data)
    subscription = Subscription.find_by(external_id: data.id)
    tenant = if subscription
               subscription.tenant
             else
               tenant_id = data.metadata&.[](:tenant_id) || data.metadata&.[]("tenant_id")
               Tenant.find_by(id: tenant_id)
             end

    return unless tenant

    plan_code = data.metadata&.[](:plan_code) || data.metadata&.[]("plan_code") || tenant.current_plan_code

    attrs = {
      tenant: tenant,
      external_id: data.id,
      plan_code: plan_code,
      status: data.status,
      current_period_end: data.current_period_end && Time.at(data.current_period_end),
      raw_data: data.to_hash
    }

    subscription ? subscription.update(attrs) : Subscription.create!(attrs)

    billing_status = case data.status
                     when "active"
                       "active"
                     when "past_due", "unpaid"
                       "blocked"
                     else
                       tenant.billing_status
                     end

    blocked_at = billing_status == "blocked" ? Time.current : tenant.blocked_at

    tenant.update!(
      current_plan_code: plan_code,
      billing_status: billing_status,
      blocked_at: blocked_at
    )
  end

  def handle_invoice_payment_failed(data)
    subscription_id = data.subscription
    subscription = Subscription.find_by(external_id: subscription_id)
    return unless subscription

    tenant = subscription.tenant
    tenant.update!(
      billing_status: "blocked",
      blocked_at: Time.current
    )
  end
end
