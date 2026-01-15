module Plans
  class LimitExceededError < StandardError
    attr_reader :code

    def initialize(code, message)
      super(message)
      @code = code
    end
  end

  class Enforcer
    def initialize(tenant)
      @tenant = tenant
      @plan = Catalog.find!(@tenant.current_plan_code)
    end

    def ensure_offer_creation_allowed!
      limit = @plan.offer_limit
      return if limit.nil?

      count = @tenant.offers.count
      if count >= limit
        raise LimitExceededError.new(
          "offer_limit_exceeded",
          "Offer limit reached for current plan"
        )
      end
    end

    def ensure_admin_user_creation_allowed!(role)
      return unless role == "admin"

      limit = @plan.admin_user_limit
      return if limit.nil?

      count = @tenant.users.where(role: "admin").count
      if count >= limit
        raise LimitExceededError.new(
          "admin_limit_exceeded",
          "Admin user limit reached for current plan"
        )
      end
    end

    def transaction_fee_percent
      @plan.transaction_fee_percent
    end
  end
end

