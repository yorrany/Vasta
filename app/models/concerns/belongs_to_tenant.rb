module BelongsToTenant
  extend ActiveSupport::Concern

  included do
    belongs_to :tenant

    default_scope do
      if Current.tenant
        where(tenant: Current.tenant)
      else
        all
      end
    end

    validates :tenant, presence: true
  end
end

