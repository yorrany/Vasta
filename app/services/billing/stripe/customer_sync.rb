module Billing
  module Stripe
    class CustomerSync
      def initialize(tenant)
        @tenant = tenant
      end

      def call
        return @tenant.stripe_customer_id if @tenant.stripe_customer_id

        customer = ::Stripe::Customer.create(
          name: @tenant.name,
          metadata: {
            tenant_id: @tenant.id
          }
        )

        @tenant.update!(stripe_customer_id: customer.id)
        customer.id
      end
    end
  end
end

