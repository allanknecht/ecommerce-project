class AddDiscountToCarts < ActiveRecord::Migration[8.1]
  def change
    add_column :carts, :discount_percentage, :decimal
  end
end
