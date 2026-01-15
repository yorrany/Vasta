class ProfilesController < ApplicationController
  def index
    profiles = Current.tenant.profiles
    render json: profiles
  end

  def show
    profile = Current.tenant.profiles.find(params[:id])
    render json: profile
  end

  def create
    profile = Current.tenant.profiles.new(profile_params)
    if profile.save
      render json: profile, status: :created
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    profile = Current.tenant.profiles.find(params[:id])
    if profile.update(profile_params)
      render json: profile
    else
      render json: { errors: profile.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    profile = Current.tenant.profiles.find(params[:id])
    profile.destroy
    head :no_content
  end

  private

  def profile_params
    params.require(:profile).permit(:user_id, :slug, :display_name, :bio, :status, :theme_config)
  end
end

