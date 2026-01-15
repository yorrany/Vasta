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
    user = Current.tenant.users.new(user_params)
    if user.save
      render json: user, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
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

