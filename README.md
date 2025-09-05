# EA Foods Pre-Order System

A comprehensive Node.js application for EA Foods' Pre-Order Model.

## 🚀 Features

- **Pre-Order Management**: Customers, TSUs, and SRs can place pre-orders for next-day delivery
- **Stock-Driven Orders**: Orders cannot exceed available inventory
- **Delivery Windows**: Morning (8-11 AM), Afternoon (12-3 PM), Evening (4-7 PM)
- **Cut-off Time Enforcement**: Orders after 6:00 PM are scheduled for +2 days delivery
- **Stock Management**: Ops managers can update stock balances twice daily (8 AM & 6 PM)
- **Role-Based Access**: Different permissions for Customers, TSUs, SRs, and Ops Managers
- **Comprehensive API**: RESTful API with full CRUD operations
- **Database Integration**: SQLite database with proper schema design
- **Testing**: Unit and integration tests with Jest
- **Code Quality**: ESLint and Prettier configuration

## 🏗️ Architecture

```
src/
├── app.js                 # Main application entry point
├── controllers/           # Request handlers
│   ├── UserController.js
│   ├── ProductController.js
│   ├── OrderController.js
│   └── StockController.js
├── models/               # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Stock.js
├── services/             # Business logic
│   ├── OrderService.js
│   └── StockService.js
├── middleware/           # Express middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── routes/              # API routes
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   └── stock.js
├── utils/               # Utility functions
│   ├── database.js
│   ├── constants.js
│   └── helpers.js
└── scripts/             # Database seeding
    └── seed.js
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone and navigate to the project**
   ```bash
   cd EA_Foods
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Run tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   
   # Run tests in watch mode
   npm run test:watch
   ```

7. **Code quality checks**
   ```bash
   # Lint code
   npm run lint
   
   # Fix linting issues
   npm run lint:fix
   
   # Format code
   npm run format
   ```

## 📚 API Documentation

### Postman Collection
#### Import `EA_Foods_PreOrder_API.postman_collection.json` into Postman
#### Import `EA_Foods_Environment.postman_environment.json` into Postman

### Base URL
```
http://localhost:3000/api
```

### Authentication
Use the following headers for authentication:
```
x-user-role: customer|tsu|sr|ops_manager
x-user-id: <user_id>
```

### Endpoints

#### Health Check
- `GET /health` - API health status

#### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/statistics` - Get user statistics (admin only)

#### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `GET /api/products/categories` - Get product categories
- `GET /api/products/search?q=query` - Search products

#### Orders
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create order (customers, TSUs, SRs)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin only)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/delivery-slots` - Get available delivery slots
- `GET /api/orders/statistics` - Get order statistics (admin only)

#### Stock
- `GET /api/stock` - Get all stock (admin only)
- `POST /api/stock/initialize` - Initialize stock (admin only)
- `PUT /api/stock/update` - Update stock (admin only)
- `PUT /api/stock/bulk-update` - Bulk update stock (admin only)
- `GET /api/stock/statistics` - Get stock statistics (admin only)
- `GET /api/stock/low-stock` - Get low stock products (admin only)

### Example API Calls

#### Create an Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "x-user-role: customer" \
  -H "x-user-id: 2" \
  -d '{
    "delivery_slot": "morning",
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 3, "quantity": 1}
    ]
  }'
```

#### Update Stock
```bash
curl -X PUT http://localhost:3000/api/stock/update \
  -H "Content-Type: application/json" \
  -H "x-user-role: ops_manager" \
  -H "x-user-id: 1" \
  -d '{
    "product_id": 1,
    "quantity": 100
  }'
```

## 🎯 Design Notes

### Assumptions Made

1. **Authentication**: Implemented simple header-based authentication for demo purposes. In production, this would use JWT tokens or OAuth.

2. **Database**: Used SQLite for local development. In production, this would be PostgreSQL or MySQL.

3. **Stock Updates**: Stock updates are manual. In production, this could be automated with scheduled jobs.

4. **Delivery Capacity**: Assumed unlimited delivery capacity per slot. In production, this would have capacity limits.

5. **Order Validation**: Orders are validated at creation time. In production, there might be additional business rules.

6. **Error Handling**: Basic error handling implemented. Production would have more sophisticated error tracking.

### Trade-offs

1. **Simplicity vs. Features**: Chose to implement core features well rather than many features poorly.

2. **Local vs. Cloud**: Built for local development to meet assignment constraints.

3. **Synchronous vs. Asynchronous**: Used synchronous operations for simplicity. Production might benefit from async processing.

4. **Validation**: Client-side validation for demo. Production would have server-side validation.

### Future Improvements

1. **Authentication & Authorization**
   - JWT token-based authentication
   - Role-based permissions with fine-grained access control
   - Session management

2. **Database & Performance**
   - Connection pooling
   - Database indexing optimization
   - Caching layer (Redis)
   - Database migrations

3. **API Enhancements**
   - API versioning
   - Rate limiting per user
   - Request/response logging
   - API documentation (Swagger/OpenAPI)

4. **Business Logic**
   - Automated stock updates
   - Delivery capacity management
   - Order status notifications
   - Inventory forecasting

5. **Monitoring & Logging**
   - Application monitoring (Prometheus/Grafana)
   - Structured logging
   - Error tracking (Sentry)
   - Performance metrics

6. **Testing**
   - End-to-end testing
   - Load testing
   - Security testing
   - Contract testing

7. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Environment management
   - Health checks


## �� Testing

The application includes comprehensive testing:

- **Unit Tests**: Model and utility function tests
- **Integration Tests**: API endpoint tests
- **Test Coverage**: Aim for >80% code coverage

Run tests with:
```bash
npm test
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development
PORT=3000
DB_PATH=./database.sqlite
JWT_SECRET=your-secret-key-here
CUTOFF_TIME=18:00
STOCK_UPDATE_TIMES=08:00,18:00
```

### Database Schema
The application uses SQLite with the following main tables:
- `users` - User accounts and roles
- `products` - Product catalog
- `stock` - Inventory levels
- `orders` - Order information
- `order_items` - Order line items
- `stock_updates` - Stock change history

## 🚀 Getting Started

1. **Quick Start**
   ```bash
   npm run setup  # Install dependencies and seed database
   npm run dev    # Start development server
   ```

2. **Test the API**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/api/products
   ```

3. **Create a Test Order**
   ```bash
   curl -X POST http://localhost:3000/api/orders \
     -H "Content-Type: application/json" \
     -H "x-user-role: customer" \
     -H "x-user-id: 2" \
     -d '{"delivery_slot": "morning", "items": [{"product_id": 1, "quantity": 2}]}'
   ```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

This is a take-home assignment project. For production use, please follow standard contribution guidelines.

---
