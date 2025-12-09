# 📋 Project 2: E-Commerce Microservices - Requirements

## 🎯 Tổng quan

Xây dựng hệ thống E-Commerce với microservices architecture, bao gồm 5-7 services giao tiếp với nhau qua REST APIs và message queue.

---

## 🏗️ Services Architecture

### 1. User Service
- **Port**: 8081
- **Database**: `user_db`
- **Responsibilities**:
  - User registration, login
  - JWT token generation
  - User profile management
  - Authentication/Authorization

### 2. Product Service
- **Port**: 8082
- **Database**: `product_db`
- **Responsibilities**:
  - Product catalog management
  - Product search và filtering
  - Inventory management
  - Product categories

### 3. Order Service
- **Port**: 8083
- **Database**: `order_db`
- **Responsibilities**:
  - Order creation
  - Order processing
  - Order history
  - Order status management

### 4. Payment Service
- **Port**: 8084
- **Database**: `payment_db`
- **Responsibilities**:
  - Payment processing
  - Payment gateway integration (mock)
  - Payment history
  - Refund processing

### 5. Notification Service
- **Port**: 8085
- **Database**: `notification_db` (optional)
- **Responsibilities**:
  - Email notifications
  - SMS notifications (mock)
  - Notification history

### 6. API Gateway
- **Port**: 8080
- **Responsibilities**:
  - Route requests to services
  - Authentication/Authorization
  - Load balancing
  - Rate limiting

### 7. Eureka Server (Service Discovery)
- **Port**: 8761
- **Responsibilities**:
  - Service registration
  - Service discovery
  - Health monitoring

---

## 📝 Functional Requirements

### User Service

#### Registration
- `POST /api/users/register`
- Create new user account

#### Login
- `POST /api/users/login`
- Return JWT token

#### Get User
- `GET /api/users/{id}`
- Get user details

### Product Service

#### Get Products
- `GET /api/products`
- List products với pagination, search, filter

#### Get Product
- `GET /api/products/{id}`
- Get product details

#### Create Product (Admin)
- `POST /api/products`
- Create new product

#### Update Inventory
- `PUT /api/products/{id}/inventory`
- Update product inventory

### Order Service

#### Create Order
- `POST /api/orders`
- Create new order
- **Flow**:
  1. Validate products
  2. Check inventory
  3. Calculate total
  4. Create order
  5. Publish `OrderCreated` event

#### Get Orders
- `GET /api/orders`
- Get user's orders

#### Get Order
- `GET /api/orders/{id}`
- Get order details

#### Cancel Order
- `PUT /api/orders/{id}/cancel`
- Cancel order

### Payment Service

#### Process Payment
- `POST /api/payments`
- Process payment for order
- **Flow**:
  1. Validate order
  2. Process payment (mock)
  3. Publish `PaymentProcessed` event
  4. Update order status

#### Get Payment
- `GET /api/payments/{id}`
- Get payment details

### Notification Service

#### Send Notification
- `POST /api/notifications`
- Send notification (triggered by events)

---

## 🔄 Event-Driven Architecture

### Kafka Topics

1. **order-created**
   - Published by: Order Service
   - Consumed by: Payment Service, Notification Service

2. **payment-processed**
   - Published by: Payment Service
   - Consumed by: Order Service, Notification Service

3. **order-completed**
   - Published by: Order Service
   - Consumed by: Notification Service

4. **inventory-updated**
   - Published by: Product Service
   - Consumed by: Order Service (optional)

### Event Flow Example

```
User creates order
    ↓
Order Service: Create order
    ↓
Publish "order-created" event
    ↓
Payment Service: Process payment
    ↓
Publish "payment-processed" event
    ↓
Order Service: Update order status
    ↓
Notification Service: Send confirmation email
```

---

## 🗄️ Database Schema (per Service)

### User Service
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Service
```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

### Order Service
```sql
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id),
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
```

### Payment Service
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Security Requirements

### Authentication
- JWT tokens cho user authentication
- Service-to-service authentication (optional)

### Authorization
- Role-based access (USER, ADMIN)
- Resource ownership checks

### API Gateway Security
- Validate JWT tokens
- Route based on roles
- Rate limiting

---

## 📊 Inter-Service Communication

### Synchronous (REST)
- Order Service → Product Service: Check inventory
- Order Service → User Service: Validate user
- Payment Service → Order Service: Get order details

### Asynchronous (Kafka)
- Order created events
- Payment processed events
- Notification events

---

## 🧪 Testing Requirements

### Unit Tests
- Service layer tests
- Repository tests
- >80% coverage

### Integration Tests
- Service-to-service communication
- Kafka event handling
- Database operations

### End-to-End Tests
- Complete order flow
- Payment processing flow

---

## 🚀 Deployment

### Docker Compose
- All services containerized
- Infrastructure services (PostgreSQL, Redis, Kafka)
- Service discovery

### CI/CD
- GitHub Actions
- Build và test each service
- Deploy to staging/production

---

## ✅ Acceptance Criteria

- [ ] All services implemented và running
- [ ] Service discovery working
- [ ] API Gateway routing correctly
- [ ] Kafka events flowing properly
- [ ] Redis caching implemented
- [ ] Tests written và passing
- [ ] Docker Compose setup working
- [ ] Documentation complete

---

**Microservices ready! 🚀**

