class ServiceAvailabilitiesController < ApplicationController
  def index
    offer = Current.tenant.offers.find(params[:offer_id])
    availabilities = ServiceAvailability.where(offer: offer)
    render json: availabilities
  end

  def create
    offer = Current.tenant.offers.find(params[:offer_id])
    availability = ServiceAvailability.new(service_availability_params.merge(tenant: Current.tenant, offer: offer))
    if availability.save
      render json: availability, status: :created
    else
      render json: { errors: availability.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    offer = Current.tenant.offers.find(params[:offer_id])
    availability = ServiceAvailability.where(offer: offer).find(params[:id])
    availability.destroy
    head :no_content
  end

  private

  def service_availability_params
    params.require(:service_availability).permit(:weekday, :start_minute, :end_minute, :duration_minutes, :active)
  end
end

