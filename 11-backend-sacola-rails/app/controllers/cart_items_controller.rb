class CartItemsController < ApplicationController
  def create
    cart = Cart.find_or_create_by(user_email: current_user_email)

    product_id = params[:productId] || params[:product_id]
    quantity = params[:qty] || params[:quantity] || 1
    name = params[:name]
    price = params[:price]
    image = params[:image] || ""

    unless product_id && name && price
      render json: { error: "productId, name e price são obrigatórios" }, status: :bad_request
      return
    end

    cart_item = cart.cart_items.find_by(product_id: product_id)

    if cart_item
      cart_item.quantity += quantity.to_i
      cart_item.save
    else
      cart_item = cart.cart_items.create!(
        product_id: product_id,
        name: name,
        price: price.to_f,
        quantity: quantity.to_i,
        image: image,
      )
    end

    render json: { message: "Item adicionado à sacola", item: cart_item }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def update
    cart = Cart.find_by(user_email: current_user_email)

    unless cart
      render json: { error: "Sacola não encontrada" }, status: :not_found
      return
    end

    cart_item = cart.cart_items.find_by(product_id: params[:product_id])

    unless cart_item
      render json: { error: "Item não encontrado" }, status: :not_found
      return
    end

    new_quantity = params[:qty] || params[:quantity]

    unless new_quantity
      render json: { error: "qty é obrigatório" }, status: :bad_request
      return
    end

    cart_item.quantity = new_quantity.to_i
    cart_item.save

    render json: { message: "Quantidade atualizada", item: cart_item }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  def destroy
    cart = Cart.find_by(user_email: current_user_email)

    unless cart
      render json: { error: "Sacola não encontrada" }, status: :not_found
      return
    end

    cart_item = cart.cart_items.find_by(product_id: params[:product_id])

    unless cart_item
      render json: { error: "Item não encontrado" }, status: :not_found
      return
    end

    cart_item.destroy

    render json: { message: "Item removido" }, status: :no_content
  end
end
