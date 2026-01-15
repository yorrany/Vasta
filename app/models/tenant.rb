class Tenant < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :profiles, dependent: :destroy
  has_many :offers, dependent: :destroy
  has_many :checkouts, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
end

