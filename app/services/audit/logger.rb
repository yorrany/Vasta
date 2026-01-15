module Audit
  class Logger
    def self.log(tenant:, user:, action:, resource: nil, changeset: {}, metadata: {})
      AuditLog.create!(
        tenant: tenant,
        user: user,
        action: action,
        resource_type: resource&.class&.name,
        resource_id: resource&.id,
        changeset: changeset,
        metadata: metadata
      )
    end
  end
end

