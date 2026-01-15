class Offer < ApplicationRecord
  include BelongsToTenant

  belongs_to :profile
end

