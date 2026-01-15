class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.references :tenant, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email, null: false
      t.string :role, null: false, default: "admin"
      t.string :status, null: false, default: "active"

      t.timestamps
    end

    add_index :users, [:tenant_id, :email], unique: true
  end
end

