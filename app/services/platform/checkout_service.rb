module Platform
  class CheckoutService
    # Constants for fallback price IDs (for dev environment if ENV not set)
    # Ideally these should always be in ENV.
    DEFAULTS = {
      pro_monthly: "price_1SqTOWDyY8IjQnus2FZ9rfwd",
      pro_yearly: "price_1SqTNMDyY8IjQnusc3iOkgxT",
      business_monthly: "price_1SqTP8DyY8IjQnuszOqFtp4Y",
      business_yearly: "price_1SqTPYDyY8IjQnusi2dsDakz"
    }.freeze

    def initialize(plan_code:, cycle:, success_url:, cancel_url:)
      @plan_code = plan_code
      @cycle = cycle
      @success_url = success_url
      @cancel_url = cancel_url
    end

    def call
      price_id = resolve_price_id
      raise ArgumentError, "Invalid plan or cycle" unless price_id

      Stripe::Checkout::Session.create(
        ui_mode: "embedded",
        line_items: [
          {
            price: price_id,
            quantity: 1
          }
        ],
        mode: "subscription",
        return_url: @success_url,
        billing_address_collection: "auto"
      )
    end

    private

    def resolve_price_id
      key_suffix = "#{@plan_code}_#{@cycle}".upcase
      env_key = "STRIPE_PRICE_#{key_suffix}" # e.g. STRIPE_PRICE_PRO_MONTHLY
      
      ENV.fetch(env_key) do
        # Fallback to hardcoded defaults for simpler dev setup if ENV is missing
        DEFAULTS["#{@plan_code}_#{@cycle}".to_sym]
      end
    end
  end
end
