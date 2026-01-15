class Profile < ApplicationRecord
  include BelongsToTenant

  belongs_to :user, optional: true

  validates :slug, presence: true, uniqueness: true
  validates :display_name, presence: true
end

