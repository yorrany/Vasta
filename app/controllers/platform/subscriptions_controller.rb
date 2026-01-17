module Platform
  class SubscriptionsController < ApplicationController
    # Skip CSRF for API-like POSTs if necessary, though ideally we use tokens.
    # verify_authenticity_token is default in Rails API mode? 
    # Current CheckoutsController doesn't have skip_before_action, let's assume standard API behavior.

    def checkout
      # Expecting params: plan_code, cycle (monthly/yearly), success_url, return_url
      
      # For embedded checkout, Stripe expects return_url with {CHECKOUT_SESSION_ID}
      # The frontend sends 'return_url' typically.
      
      # We construct the return_url if frontend sends base url, or use what FE sends.
      # Let's standardize: FE sends nothing, we assume return to dashboard.
      
      base_url = params[:base_url] || request.base_url
      return_url = "#{base_url}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}"

      session = Platform::CheckoutService.new(
        plan_code: params[:plan_code],
        cycle: params[:cycle],
        success_url: return_url,
        cancel_url: "#{base_url}/pricing" # Fallback, though embedded mode manages flow distinctively
      ).call

      render json: { clientSecret: session.client_secret }
    rescue ArgumentError => e
      render json: { error: e.message }, status: :bad_request
    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :service_unavailable
    end
    
  end
end
