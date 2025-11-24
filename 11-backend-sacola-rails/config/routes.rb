Rails.application.routes.draw do
  # Health check
  get "/health", to: "health#index"

  # Swagger/OpenAPI Documentation
  get "/api-docs", to: "swagger#ui"
  get "/api-docs/openapi.json", to: "swagger#index"

  # Sacola
  get "/sacola", to: "carts#show"
  delete "/sacola", to: "carts#destroy"

  # Itens da sacola
  post "/sacola/items", to: "cart_items#create"
  put "/sacola/items/:product_id", to: "cart_items#update"
  delete "/sacola/items/:product_id", to: "cart_items#destroy"

  # Cupom
  post "/sacola/cupom", to: "coupons#apply"
end
