class FeatureFlag < ApplicationRecord
  has_many :tenant_feature_flags, dependent: :destroy

  validates :key, presence: true, uniqueness: true
end

