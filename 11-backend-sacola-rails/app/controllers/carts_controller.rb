class CartsController < ApplicationController
  def show
    cart = Cart.find_or_create_by(user_email: current_user_email)

    items = cart.cart_items.map do |item|
      {
        productId: item.product_id,
        name: item.name,
        price: item.price.to_f,
        qty: item.quantity,
        image: item.image,
      }
    end

    subtotal = cart.cart_items.sum { |item| item.price * item.quantity }
    freight = subtotal >= 200 ? 0 : 25
    discount_percentage = cart.discount_percentage || 0
    discount = (subtotal * discount_percentage / 100).to_f
    total = subtotal + freight - discount

    render json: {
      items: items,
      subtotal: subtotal.to_f,
      freight: freight.to_f,
      discount: discount.to_f,
      total: total.to_f,
    }
  end

  def destroy
    cart = Cart.find_by(user_email: current_user_email)

    unless cart
      render json: { error: "Sacola não encontrada" }, status: :not_found
      return
    end

    cart.cart_items.destroy_all
    cart.discount_percentage = nil
    cart.save

    render json: { message: "Sacola limpa com sucesso" }, status: :ok
  end
end
