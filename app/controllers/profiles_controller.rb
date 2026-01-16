class ProfilesController < ApplicationController
  def check_username
    username = params[:username].to_s.downcase.strip
    
    if username.length < 3
      return render json: { available: false, message: "Mínimo 3 caracteres" }, status: :unprocessable_entity
    end

    exists = Profile.exists?(slug: username)
    available = !exists && !reserved_usernames.include?(username)

    suggestions = []
    unless available
      suggestions = [
        "#{username}pro",
        "#{username}hq",
        "sou#{username}",
        "#{username}_dev"
      ].reject { |s| Profile.exists?(slug: s) }.first(3)
    end

    render json: { 
      available: available, 
      username: username,
      message: available ? "Disponível!" : "indisponível",
      suggestions: suggestions
    }
  end

  private

  def reserved_usernames
    %w[admin support help root system vasta api dashboard login register]
  end
end
