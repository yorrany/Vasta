module Billing
  module Stripe
    class SubscriptionCreator
      def initialize(tenant:, plan_code:)
        @tenant = tenant
        @plan = Plans::Catalog.find!(plan_code)
      end

      def call
        customer_id = CustomerSync.new(@tenant).call

        price_id = price_id_for_plan(@plan.code)

        subscription = ::Stripe::Subscription.create(
          customer: customer_id,
          items: [
            {
              price: price_id
            }
          ],
          metadata: {
            tenant_id: @tenant.id,
            plan_code: @plan.code
          }
        )

        Subscription.create!(
          tenant: @tenant,
          external_id: subscription.id,
          plan_code: @plan.code,
          status: subscription.status,
          current_period_end: Time.at(subscription.current_period_end),
          raw_data: subscription.to_hash
        ).tap do
          @tenant.update!(
            current_plan_code: @plan.code,
            billing_status: subscription.status == "active" ? "active" : "pending"
          )
        end
      end

      private

      def price_id_for_plan(code)
        env_key = "STRIPE_PRICE_#{code.upcase}"
        value = ENV[env_key]
        raise ArgumentError, "Missing Stripe price id for plan #{code}" unless value

        value
      end
    end
  end
end

