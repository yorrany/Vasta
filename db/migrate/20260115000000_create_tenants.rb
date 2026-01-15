class CreateTenants < ActiveRecord::Migration[7.1]
  def change
    create_table :tenants do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :status, null: false, default: "active"

      t.timestamps
    end

    add_index :tenants, :slug, unique: true
  end
end

