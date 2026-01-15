class CreateFeatureFlags < ActiveRecord::Migration[7.1]
  def change
    create_table :feature_flags do |t|
      t.string :key, null: false
      t.string :description
      t.boolean :enabled_by_default, null: false, default: false

      t.timestamps
    end

    add_index :feature_flags, :key, unique: true
  end
end

