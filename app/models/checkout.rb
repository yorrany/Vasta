class Checkout < ApplicationRecord
  include BelongsToTenant

  belongs_to :offer
end

