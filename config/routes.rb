Rails.application.routes.draw do
  resources :users
  resources :profiles
  resources :offers do
    resources :checkouts, only: :create
  end

  get "/health", to: "health#index"
  post "/stripe/webhooks", to: "stripe_webhooks#create"
end


