module Payments
  module Stripe
    class CheckoutSessionCreator
      def initialize(offer:, success_url:, cancel_url:)
        @offer = offer
        @success_url = success_url
        @cancel_url = cancel_url
      end

      def call
        ::Stripe::Checkout::Session.create(
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: @offer.currency.downcase,
                unit_amount: @offer.price_cents,
                product_data: {
                  name: @offer.title,
                  description: @offer.description
                }
              },
              quantity: 1
            }
          ],
          success_url: @success_url,
          cancel_url: @cancel_url
        )
      end
    end
  end
end

