class User < ApplicationRecord
  include BelongsToTenant

  validates :name, presence: true
  validates :email, presence: true
end

