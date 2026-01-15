module Features
  class Checker
    def initialize(tenant)
      @tenant = tenant
    end

    def enabled?(key)
      flag = FeatureFlag.find_by(key: key)
      return false unless flag

      tenant_flag = TenantFeatureFlag.find_by(tenant: @tenant, feature_flag: flag)
      return flag.enabled_by_default if tenant_flag.nil?

      tenant_flag.enabled
    end
  end
end

