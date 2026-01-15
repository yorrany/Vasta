class CreateTenantFeatureFlags < ActiveRecord::Migration[7.1]
  def change
    create_table :tenant_feature_flags do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :feature_flag, null: false, foreign_key: true
      t.boolean :enabled, null: false, default: true

      t.timestamps
    end

    add_index :tenant_feature_flags, [:tenant_id, :feature_flag_id], unique: true, name: "index_tenant_feature_flags_on_tenant_and_flag"
  end
end

