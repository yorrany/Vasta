class CreateAppointments < ActiveRecord::Migration[7.1]
  def change
    create_table :appointments do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :offer, null: false, foreign_key: true
      t.references :profile, null: false, foreign_key: true
      t.datetime :starts_at, null: false
      t.integer :duration_minutes, null: false
      t.string :status, null: false, default: "scheduled"
      t.string :client_name
      t.string :client_email

      t.timestamps
    end
  end
end

