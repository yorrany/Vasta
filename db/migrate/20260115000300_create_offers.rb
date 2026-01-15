class CreateOffers < ActiveRecord::Migration[7.1]
  def change
    create_table :offers do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :profile, null: false, foreign_key: true
      t.string :title, null: false
      t.text :description
      t.integer :price_cents, null: false
      t.string :currency, null: false, default: "BRL"
      t.string :kind, null: false, default: "digital_product"
      t.boolean :active, null: false, default: true
      t.integer :position
      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end
  end
end

