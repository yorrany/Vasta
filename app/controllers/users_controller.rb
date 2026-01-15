class UsersController < ApplicationController
  def index
    users = Current.tenant.users
    render json: users
  end

  def show
    user = Current.tenant.users.find(params[:id])
    render json: user
  end

  def create
    params_role = user_params[:role] || "admin"

    enforcer = Plans::Enforcer.new(Current.tenant)
    enforcer.ensure_admin_user_creation_allowed!(params_role)

    user = Current.tenant.users.new(user_params)
    user.role ||= "admin"
    user.save!

    render json: user, status: :created
  rescue Plans::LimitExceededError => e
    render json: { code: e.code, error: e.message }, status: :unprocessable_entity
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    user = Current.tenant.users.find(params[:id])
    if user.update(user_params)
      render json: user
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    user = Current.tenant.users.find(params[:id])
    user.destroy
    head :no_content
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :role, :status)
  end
end
