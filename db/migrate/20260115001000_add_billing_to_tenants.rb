class AddBillingToTenants < ActiveRecord::Migration[7.1]
  def change
    add_column :tenants, :current_plan_code, :string, null: false, default: "start"
    add_column :tenants, :billing_status, :string, null: false, default: "active"
    add_column :tenants, :blocked_at, :datetime
    add_column :tenants, :stripe_customer_id, :string
  end
end

