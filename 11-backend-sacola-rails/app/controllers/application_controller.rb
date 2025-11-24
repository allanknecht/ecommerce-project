class ApplicationController < ActionController::API
  before_action :authenticate_user!

  private

  def authenticate_user!
    token = request.headers["Authorization"]&.split(" ")&.last

    unless token
      render json: { error: "Token não fornecido" }, status: :unauthorized
      return
    end

    begin
      decoded_token = JWT.decode(token, jwt_secret, true, { algorithm: "HS256" })
      @current_user_email = decoded_token[0]["email"]
    rescue JWT::DecodeError => e
      render json: { error: "Token inválido: #{e.message}" }, status: :unauthorized
    rescue JWT::ExpiredSignature => e
      render json: { error: "Token expirado" }, status: :unauthorized
    rescue => e
      render json: { error: "Erro na autenticação: #{e.message}" }, status: :unauthorized
    end
  end

  def jwt_secret
    ENV["JWT_SECRET"] || "abacate"
  end

  def current_user_email
    @current_user_email
  end
end
