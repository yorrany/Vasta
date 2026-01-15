Rails.application.routes.draw do
  resources :users
  resources :profiles
  resources :offers do
    resources :checkouts, only: :create
    resources :service_availabilities, only: [:index, :create, :destroy]
    resources :appointments, only: [:index, :create] do
      collection do
        get :available_slots
      end
    end
  end

  resources :subscriptions, only: :create
  get "/plans", to: "plans#index"

  get "/health", to: "health#index"
  post "/stripe/webhooks", to: "stripe_webhooks#create"
end


