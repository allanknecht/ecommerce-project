class CouponsController < ApplicationController
  def apply
    cart = Cart.find_by(user_email: current_user_email)

    unless cart
      render json: { error: "Sacola não encontrada" }, status: :not_found
      return
    end

    code = params[:code] || params[:coupon]&.dig(:code)

    unless code
      render json: { error: "Código do cupom é obrigatório" }, status: :bad_request
      return
    end

    discount_percentage = calculate_discount(code)

    if discount_percentage.nil?
      render json: { error: "Código de cupom inválido" }, status: :bad_request
      return
    end

    cart.discount_percentage = discount_percentage
    cart.save

    render json: {
      message: "Cupom aplicado com sucesso",
      discount_percentage: discount_percentage,
    }, status: :ok
  end

  private

  def calculate_discount(code)
    case code.upcase
    when "URI10"
      10
    when "URI20"
      20
    when "URI30"
      30
    when "URI50"
      50
    else
      nil
    end
  end
end
