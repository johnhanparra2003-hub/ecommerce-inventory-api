# 🛒 E-commerce Inventory & Orders API

REST API for managing the inventory and orders of an e-commerce store. Built with **Node.js, Express and MongoDB** following a **layered architecture (Controller → Service → Repository)**, containerized with **Docker** and ready to be tested with **Postman**.

> Current scope: user authentication (JWT) and product management. The layered structure is designed so that the **Orders** module can be added without touching existing code.

## ✨ Features

- JWT authentication (register / login) with password hashing (bcrypt)
- Role-based access control (`customer`, `admin`)
- Product catalog with pagination, filtering, full-text search and sorting
- Request validation with Joi (params, query and body)
- Centralized error handling (400, 401, 403, 404, 409, 500) with a consistent JSON format
- Security hardening: Helmet, CORS, rate limiting on auth routes, body size limit
- Health check endpoint, graceful shutdown, multi-stage Docker build running as non-root

## 🧰 Tech Stack

| Area | Technology |
|------|------------|
| Runtime | Node.js 20+ (ES Modules) |
| Framework | Express 4 |
| Database | MongoDB 7 + Mongoose |
| Auth | JSON Web Tokens + bcryptjs |
| Validation | Joi |
| DevOps | Docker, Docker Compose |
| Testing | Postman collection included |

## 🏗️ Architecture

```
Request → Route → Middlewares (validate / authenticate / authorize)
        → Controller (HTTP only) → Service (business rules)
        → Repository (database queries) → Model (Mongoose schema)
```

```
ecommerce-inventory-api/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
├── postman/
│   └── ecommerce-inventory-api.postman_collection.json
└── src/
    ├── app.js                # Express app (middlewares, routes)
    ├── server.js             # Entry point (DB connection, graceful shutdown)
    ├── config/               # env.js, database.js
    ├── controllers/          # HTTP layer
    ├── services/             # Business logic
    ├── repositories/         # Data access
    ├── models/               # Mongoose schemas
    ├── routes/               # Route definitions
    ├── middlewares/          # authenticate, authorize, validate, errorHandler, notFound
    ├── validations/          # Joi schemas
    ├── utils/                # AppError, asyncHandler
    └── scripts/              # seed-admin.js
```

## 🚀 Run with Docker (recommended)

Requirements: Docker and Docker Compose.

```bash
git clone <your-repo-url>
cd ecommerce-inventory-api

# Optional: customize secrets (defaults work for a quick demo)
cp .env.example .env

docker compose up --build
```

The API will be available at **http://localhost:3000**. Verify it:

```bash
curl http://localhost:3000/health
```

Create the admin user (required to create products):

```bash
docker compose exec api npm run seed:admin
```

Default admin credentials: `admin@example.com` / `Admin1234` (change them in `.env`).

## 💻 Run locally (without Docker for the API)

Requirements: Node.js 20+ and a MongoDB instance.

```bash
cp .env.example .env
npm install
docker compose up -d mongo   # or use your own MongoDB and adjust MONGO_URI
npm run dev
npm run seed:admin
```

> When running locally against the Compose MongoDB, set  
> `MONGO_URI=mongodb://root:example@localhost:27017/ecommerce_inventory?authSource=admin`  
> and expose the port by adding `ports: ["27017:27017"]` to the `mongo` service.

## 📡 Endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` *(outside /api/v1)* | Public | Service and database status |
| POST | `/auth/register` | Public | Register a new customer |
| POST | `/auth/login` | Public | Log in and receive a JWT |
| GET | `/auth/me` | Bearer token | Get the authenticated user profile |
| GET | `/products` | Public | List products (pagination, filters, search) |
| GET | `/products/:id` | Public | Get a product by ID |
| POST | `/products` | Bearer token (admin) | Create a product |

### Query parameters for `GET /products`

| Param | Description | Default |
|-------|-------------|---------|
| `page` | Page number | `1` |
| `limit` | Items per page (max 100) | `10` |
| `category` | Filter by category | – |
| `search` | Full-text search in name/description | – |
| `minPrice` / `maxPrice` | Price range | – |
| `sortBy` | `createdAt`, `price`, `name`, `stock` | `createdAt` |
| `order` | `asc` or `desc` | `desc` |

### Example requests

**Register**

```http
POST /api/v1/auth/register
Content-Type: application/json

{ "name": "Jane Doe", "email": "jane@example.com", "password": "Secret123" }
```

**Create product (admin)**

```http
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Mechanical Keyboard",
  "description": "Hot-swappable, RGB",
  "sku": "KB1001",
  "price": 89.99,
  "stock": 25,
  "category": "peripherals"
}
```

### Error format

```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "errors": [{ "location": "body", "field": "email", "message": "email must be a valid email" }]
}
```

## 🧪 Testing with Postman

1. Import `postman/ecommerce-inventory-api.postman_collection.json`.
2. Run **Auth → Login (admin)** — the token is saved automatically into the `token` collection variable.
3. Run **Products → Create product**, then the list and get-by-id requests.

## 🔐 Security notes

- Public registration always creates `customer` users; admins are created only via the seed script.
- Use a long random `JWT_SECRET` in production (the app refuses to start in production without one).
- Login returns the same error for unknown email and wrong password to prevent user enumeration.

## 🗺️ Roadmap

- Orders module (create order, stock decrement in a transaction, order history)
- Update / soft-delete products
- Automated tests (Jest + Supertest) and CI with GitHub Actions
- OpenAPI / Swagger documentation

## 📄 License

MIT
