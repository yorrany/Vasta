class AuditLog < ApplicationRecord
  include BelongsToTenant

  belongs_to :user, optional: true
end

