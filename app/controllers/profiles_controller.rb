class ProfilesController < ApplicationController
  def check_username
    username = params[:username].to_s.downcase.strip
    
    if username.length < 3
      return render json: { available: false, message: "Mínimo 3 caracteres" }, status: :unprocessable_entity
    end

    exists = Profile.exists?(slug: username)
    available = !exists && !reserved_usernames.include?(username)

    render json: { 
      available: available, 
      username: username,
      message: available ? "Disponível!" : "indisponível"
    }
  end

  private

  def reserved_usernames
    %w[admin support help root system vasta api dashboard login register]
  end
end
