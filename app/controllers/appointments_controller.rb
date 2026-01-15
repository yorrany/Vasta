class AppointmentsController < ApplicationController
  def index
    offer = Current.tenant.offers.find(params[:offer_id])
    appointments = Appointment.where(offer: offer)
    render json: appointments
  end

  def available_slots
    offer = Current.tenant.offers.find(params[:offer_id])
    date = Date.parse(params[:date])
    slots = Scheduling::SlotGenerator.new(offer: offer, date: date).call
    render json: slots.map { |slot| { starts_at: slot.starts_at, ends_at: slot.ends_at } }
  end

  def create
    offer = Current.tenant.offers.find(params[:offer_id])
    profile = offer.profile
    appointment = Appointment.new(appointment_params.merge(tenant: Current.tenant, offer: offer, profile: profile))
    if appointment.save
      render json: appointment, status: :created
    else
      render json: { errors: appointment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def appointment_params
    params.require(:appointment).permit(:starts_at, :duration_minutes, :client_name, :client_email)
  end
end

