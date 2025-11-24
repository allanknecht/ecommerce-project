# E-commerce - Final Project

Complete e-commerce system with frontend and two independent APIs (Catalog and Shopping Cart).

## 🚀 Technologies

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- LocalStorage for local data (ZIP code, address)

### Catalog API
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Docker + Docker Compose

### Shopping Cart API
- Ruby on Rails (API only)
- SQLite
- JWT Authentication
- Docker + Docker Compose

## 📦 How to Run

### 1. Catalog API
```bash
cd 09-backend-catalogo-bd-allanknecht-uricer
docker-compose up -d
```
- Port: `5732`
- Health: `http://localhost:5732/health`
- Swagger UI: `http://localhost:5732/api-docs`

### 2. Shopping Cart API
```bash
cd 11-backend-sacola-rails
docker-compose up -d
docker-compose exec rails-api bundle exec rails server -b 0.0.0.0 -p 3002
```
- Port: `3002`
- Health: `http://localhost:3002/health`
- Swagger UI: `http://localhost:3002/api-docs`

### 3. Frontend
Open `10-int-front-back-allanknecht-uricer/index.html` in your browser.

## 🔐 Authentication

- **Email**: `admin@admin.com`
- **Password**: `admin123`
- JWT token valid for 1 hour

## 📡 Main Endpoints

### Catalog API (`http://localhost:5732/api/v1`)
- `GET /produtos` - List products (public)
- `GET /produtos/:id` - Product details (public)
- `POST /auth/login` - Login
- `POST /produtos` - Create product (authenticated)
- `PUT /produtos/:id` - Update product (authenticated)
- `DELETE /produtos/:id` - Delete product (authenticated)

### Shopping Cart API (`http://localhost:3002`)
- `GET /sacola` - Get cart (authenticated)
- `POST /sacola/items` - Add item (authenticated)
- `PUT /sacola/items/:productId` - Update quantity (authenticated)
- `DELETE /sacola/items/:productId` - Remove item (authenticated)
- `POST /sacola/cupom` - Apply coupon (authenticated)
- `DELETE /sacola` - Clear cart / Complete purchase (authenticated)

## 📄 Documentation

- **Catalog API**: Swagger UI at `http://localhost:5732/api-docs` (uses `openapi.json`)
- **Shopping Cart API**: Swagger UI at `http://localhost:3002/api-docs` (uses `openapi.json`)

## 🗄️ Database

- **Catalog**: PostgreSQL (port 5433)
- **Shopping Cart**: SQLite (local file)

## 📝 Project Structure

```
projeto-final-web/
├── 09-backend-catalogo-bd-allanknecht-uricer/  # Node.js API
├── 10-int-front-back-allanknecht-uricer/      # Frontend
└── 11-backend-sacola-rails/                    # Rails API
```

## ✅ Features

- ✅ Product listing with filters and sorting
- ✅ Product details
- ✅ Add/remove/update items in cart
- ✅ Shipping calculation (subtotal >= 200 ? 0 : 25)
- ✅ Discount coupons (URI10, URI20, URI30, URI50)
- ✅ Complete purchase (clears cart in API)
- ✅ JWT Authentication
- ✅ Database persistence

## 🔧 Configuration

### JWT_SECRET
Both APIs use `JWT_SECRET=abacate` (configured in docker-compose files).

### CORS
APIs configured to accept requests from any origin (development).

## 📚 Request Examples

### Login
```bash
curl -X POST http://localhost:5732/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'
```

### Add Item to Cart
```bash
curl -X POST http://localhost:3002/sacola/items \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"productId":"123","name":"Product","price":99.90,"qty":2}'
```

## 🐛 Troubleshooting

- **Invalid token**: Login again to get a new token
- **APIs not responding**: Check if containers are running (`docker ps`)
- **Connection error**: Check if ports 5732 and 3002 are available
