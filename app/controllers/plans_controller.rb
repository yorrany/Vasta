class PlansController < ApplicationController
  def index
    plans = [
      {
        code: "start",
        name: "Vasta Start",
        monthly_price_cents: 0,
        transaction_fee_percent: 8,
        offer_limit: 3,
        admin_user_limit: 1,
        features: ["checkout_transparente", "suporte_email", "analytics_basico"]
      },
      {
        code: "pro",
        name: "Vasta Pro",
        monthly_price_cents: 4990,
        transaction_fee_percent: 4,
        offer_limit: nil,
        admin_user_limit: 1,
        features: ["checkout_transparente", "suporte_email", "analytics_basico", "dominio_proprio", "sem_marca_dagua", "recuperacao_carrinho"]
      },
      {
        code: "business",
        name: "Vasta Business",
        monthly_price_cents: 9990,
        transaction_fee_percent: 1,
        offer_limit: nil,
        admin_user_limit: 5,
        features: ["checkout_transparente", "suporte_email", "analytics_basico", "dominio_proprio", "sem_marca_dagua", "recuperacao_carrinho", "suporte_whatsapp", "api_aberta", "multiplos_estoques"]
      }
    ]

    render json: plans
  end
end
