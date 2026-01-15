class CreateSubscriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :subscriptions do |t|
      t.references :tenant, null: false, foreign_key: true
      t.string :external_id, null: false
      t.string :plan_code, null: false
      t.string :status, null: false
      t.datetime :current_period_end
      t.jsonb :raw_data, null: false, default: {}

      t.timestamps
    end

    add_index :subscriptions, :external_id, unique: true
  end
end

