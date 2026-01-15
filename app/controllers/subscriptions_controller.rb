class SubscriptionsController < ApplicationController
  def create
    plan_code = params[:plan_code]

    subscription = Billing::Stripe::SubscriptionCreator.new(
      tenant: Current.tenant,
      plan_code: plan_code
    ).call

    render json: {
      id: subscription.id,
      plan_code: subscription.plan_code,
      status: subscription.status,
      current_period_end: subscription.current_period_end
    }, status: :created
  rescue ArgumentError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end

