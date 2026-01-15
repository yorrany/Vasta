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
    end
  end
end

