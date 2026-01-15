class CreateAuditLogs < ActiveRecord::Migration[7.1]
  def change
    create_table :audit_logs do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.string :action, null: false
      t.string :resource_type
      t.bigint :resource_id
      t.jsonb :changeset, null: false, default: {}
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :audit_logs, [:tenant_id, :created_at]
  end
end

