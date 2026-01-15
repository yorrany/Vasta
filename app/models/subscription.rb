class Subscription < ApplicationRecord
  include BelongsToTenant

  validates :external_id, presence: true, uniqueness: true
  validates :plan_code, presence: true
  validates :status, presence: true
end

