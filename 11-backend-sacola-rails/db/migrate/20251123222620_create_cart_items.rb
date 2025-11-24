class CreateCartItems < ActiveRecord::Migration[8.1]
  def change
    create_table :cart_items do |t|
      t.references :cart, null: false, foreign_key: true
      t.string :product_id
      t.string :name
      t.decimal :price
      t.integer :quantity
      t.string :image

      t.timestamps
    end
  end
end
