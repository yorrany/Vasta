class Appointment < ApplicationRecord
  include BelongsToTenant

  belongs_to :offer
  belongs_to :profile
end

