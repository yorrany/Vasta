module Plans
  Plan = Struct.new(
    :code,
    :name,
    :monthly_price_cents,
    :transaction_fee_percent,
    :offer_limit,
    :admin_user_limit,
    :features,
    keyword_init: true
  )

  class Catalog
    PLANS = {
      "start" => Plan.new(
        code: "start",
        name: "Vasta Start",
        monthly_price_cents: 0,
        transaction_fee_percent: 8,
        offer_limit: 3,
        admin_user_limit: 1,
        features: []
      ),
      "pro" => Plan.new(
        code: "pro",
        name: "Vasta Pro",
        monthly_price_cents: 4_990,
        transaction_fee_percent: 4,
        offer_limit: nil,
        admin_user_limit: nil,
        features: %w[custom_domain cart_recovery]
      ),
      "business" => Plan.new(
        code: "business",
        name: "Vasta Business",
        monthly_price_cents: 9_990,
        transaction_fee_percent: 1,
        offer_limit: nil,
        admin_user_limit: 5,
        features: %w[open_api multi_admin]
      )
    }.freeze

    def self.all
      PLANS.values
    end

    def self.find(code)
      PLANS[code]
    end

    def self.find!(code)
      plan = find(code)
      raise ArgumentError, "Unknown plan code: #{code}" unless plan

      plan
    end
  end
end

