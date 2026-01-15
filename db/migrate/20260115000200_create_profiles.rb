class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.references :tenant, null: false, foreign_key: true
      t.references :user, foreign_key: true
      t.string :slug, null: false
      t.string :display_name, null: false
      t.text :bio
      t.jsonb :theme_config, null: false, default: {}
      t.string :status, null: false, default: "active"

      t.timestamps
    end

    add_index :profiles, :slug, unique: true
  end
end

