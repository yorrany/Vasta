class CreateCheckouts < ActiveRecord::Migration[7.1]
  def change
    create_table :checkouts do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :offer, null: false, foreign_key: true
      t.string :stripe_session_id, null: false
      t.string :stripe_payment_intent_id
      t.string :status, null: false, default: "pending"
      t.integer :amount_cents, null: false
      t.string :currency, null: false, default: "BRL"
      t.jsonb :raw_data, null: false, default: {}

      t.timestamps
    end

    add_index :checkouts, :stripe_session_id, unique: true
    add_index :checkouts, :stripe_payment_intent_id
  end
end

