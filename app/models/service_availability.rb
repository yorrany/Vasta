class ServiceAvailability < ApplicationRecord
  include BelongsToTenant

  belongs_to :offer
end

