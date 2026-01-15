class OffersController < ApplicationController
  def index
    offers = Current.tenant.offers
    render json: offers
  end

  def show
    offer = Current.tenant.offers.find(params[:id])
    render json: offer
  end

  def create
    enforcer = Plans::Enforcer.new(Current.tenant)
    enforcer.ensure_offer_creation_allowed!

    offer = Current.tenant.offers.new(offer_params)
    offer.save!

    render json: offer, status: :created
  rescue Plans::LimitExceededError => e
    render json: { code: e.code, error: e.message }, status: :unprocessable_entity
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  def update
    offer = Current.tenant.offers.find(params[:id])
    if offer.update(offer_params)
      render json: offer
    else
      render json: { errors: offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    offer = Current.tenant.offers.find(params[:id])
    offer.destroy
    head :no_content
  end

  private

  def offer_params
    params.require(:offer).permit(:profile_id, :title, :description, :price_cents, :currency, :kind, :active, :position, :metadata)
  end
end
