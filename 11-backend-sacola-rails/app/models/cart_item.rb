class CartItem < ApplicationRecord
  belongs_to :cart

  validates :product_id, presence: true
  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :quantity, presence: true, numericality: { greater_than: 0, only_integer: true }
end
