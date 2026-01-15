module Scheduling
  Slot = Struct.new(:starts_at, :ends_at, keyword_init: true)

  class SlotGenerator
    def initialize(offer:, date:)
      @offer = offer
      @date = date
    end

    def call
      availabilities = ServiceAvailability.where(offer: @offer, active: true, weekday: @date.wday)
      slots = []

      availabilities.find_each do |availability|
        start_time = @date.to_time.change(hour: 0, min: 0) + availability.start_minute.minutes
        end_time = @date.to_time.change(hour: 0, min: 0) + availability.end_minute.minutes

        current = start_time
        while current + availability.duration_minutes.minutes <= end_time
          slot = Slot.new(
            starts_at: current,
            ends_at: current + availability.duration_minutes.minutes
          )
          slots << slot if slot_free?(slot)
          current += availability.duration_minutes.minutes
        end
      end

      slots
    end

    private

    def slot_free?(slot)
      Appointment.where(offer: @offer)
                 .where("starts_at < ? AND (starts_at + (duration_minutes || ' minutes')::interval) > ?", slot.ends_at, slot.starts_at)
                 .none?
    end
  end
end

