class PlansController < ActionController::API
  def index
    plans = Plans::Catalog.all.map do |plan|
      {
        code: plan.code,
        name: plan.name,
        monthly_price_cents: plan.monthly_price_cents,
        transaction_fee_percent: plan.transaction_fee_percent,
        offer_limit: plan.offer_limit,
        admin_user_limit: plan.admin_user_limit,
        features: plan.features
      }
    end

    render json: plans
  end
end

