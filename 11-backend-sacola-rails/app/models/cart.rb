class Cart < ApplicationRecord
  has_many :cart_items, dependent: :destroy

  validates :user_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
