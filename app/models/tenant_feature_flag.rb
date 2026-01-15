class TenantFeatureFlag < ApplicationRecord
  include BelongsToTenant

  belongs_to :feature_flag
end

