class CreateServiceAvailabilities < ActiveRecord::Migration[7.1]
  def change
    create_table :service_availabilities do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :offer, null: false, foreign_key: true
      t.integer :weekday, null: false
      t.integer :start_minute, null: false
      t.integer :end_minute, null: false
      t.integer :duration_minutes, null: false
      t.boolean :active, null: false, default: true

      t.timestamps
    end
  end
end

