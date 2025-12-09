# 📋 Project 1: Task Management API - Requirements

## 🎯 Tổng quan

Xây dựng REST API cho ứng dụng quản lý công việc với đầy đủ tính năng CRUD, authentication, và các best practices.

---

## 📝 Functional Requirements

### 1. User Management

#### 1.1 User Registration
- **Endpoint**: `POST /api/v1/users/register`
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-01-15T10:30:00Z"
  }
  ```
- **Validation**:
  - Username: 3-20 characters, alphanumeric + underscore
  - Email: Valid email format
  - Password: Min 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  - Email và Username phải unique

#### 1.2 User Login
- **Endpoint**: `POST /api/v1/users/login`
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe"
    }
  }
  ```

#### 1.3 Get Current User
- **Endpoint**: `GET /api/v1/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User information

#### 1.4 Update User Profile
- **Endpoint**: `PUT /api/v1/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "fullName": "John Updated",
    "email": "john.updated@example.com"
  }
  ```

---

### 2. Task Management

#### 2.1 Create Task
- **Endpoint**: `POST /api/v1/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the API",
    "dueDate": "2024-02-01T23:59:59Z",
    "priority": "HIGH",
    "status": "TODO",
    "categoryIds": [1, 2]
  }
  ```
- **Response**: `201 Created` với task object
- **Validation**:
  - Title: Required, 3-200 characters
  - Description: Optional, max 1000 characters
  - DueDate: Must be in future
  - Priority: ENUM (LOW, MEDIUM, HIGH, URGENT)
  - Status: ENUM (TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED)

#### 2.2 Get All Tasks
- **Endpoint**: `GET /api/v1/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status`: Filter by status (optional)
  - `priority`: Filter by priority (optional)
  - `categoryId`: Filter by category (optional)
  - `search`: Search in title/description (optional)
  - `page`: Page number (default: 0)
  - `size`: Page size (default: 10)
  - `sort`: Sort field (default: createdAt)
  - `direction`: ASC or DESC (default: DESC)
- **Response**: `200 OK`
  ```json
  {
    "content": [...],
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3,
    "last": false
  }
  ```

#### 2.3 Get Task by ID
- **Endpoint**: `GET /api/v1/tasks/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` với task details

#### 2.4 Update Task
- **Endpoint**: `PUT /api/v1/tasks/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as create (all fields optional)
- **Response**: `200 OK` với updated task
- **Business Rule**: Chỉ owner hoặc assigned user mới được update

#### 2.5 Delete Task
- **Endpoint**: `DELETE /api/v1/tasks/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Business Rule**: Chỉ owner mới được delete

#### 2.6 Assign Task to User
- **Endpoint**: `POST /api/v1/tasks/{id}/assign`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "userId": 2
  }
  ```
- **Response**: `200 OK` với updated task

---

### 3. Category Management

#### 3.1 Create Category
- **Endpoint**: `POST /api/v1/categories`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "Work",
    "description": "Work-related tasks",
    "color": "#FF5733"
  }
  ```
- **Response**: `201 Created`

#### 3.2 Get All Categories
- **Endpoint**: `GET /api/v1/categories`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` với list of categories

#### 3.3 Get Category by ID
- **Endpoint**: `GET /api/v1/categories/{id}`
- **Response**: `200 OK`

#### 3.4 Update Category
- **Endpoint**: `PUT /api/v1/categories/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

#### 3.5 Delete Category
- **Endpoint**: `DELETE /api/v1/categories/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `204 No Content`
- **Business Rule**: Không được delete nếu có tasks đang sử dụng

---

## 🏗️ Database Schema

### User Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Category Table
```sql
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date TIMESTAMP,
    user_id BIGINT REFERENCES users(id) NOT NULL,
    assigned_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Task_Category (Many-to-Many)
```sql
CREATE TABLE task_categories (
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, category_id)
);
```

---

## 🔒 Security Requirements

1. **Password Hashing**: Sử dụng BCrypt
2. **JWT Authentication**: 
   - Token expiration: 24 hours
   - Refresh token: 7 days (optional cho tuần 2)
3. **Authorization**: 
   - Users chỉ có thể access/modify tasks của chính họ
   - Exception: Assigned users có thể update tasks được assign

---

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/tasks",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 200 characters"
    }
  ]
}
```

### Error Codes
- `400 Bad Request`: Validation errors, invalid input
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User không có quyền
- `404 Not Found`: Resource không tồn tại
- `409 Conflict`: Duplicate resource (email, username)
- `500 Internal Server Error`: Server errors

---

## 🧪 Testing Requirements

### Unit Tests
- Service layer: >80% coverage
- Test cases cho:
  - Business logic validation
  - Edge cases
  - Error scenarios

### Integration Tests
- Controller endpoints
- Database operations
- Authentication flow

### Test Data
- Sử dụng H2 in-memory database cho tests
- Test fixtures/seed data

---

## 📊 API Documentation

- **Swagger UI**: `/swagger-ui.html`
- **OpenAPI JSON**: `/v3/api-docs`
- Tất cả endpoints phải có:
  - Description
  - Request/Response examples
  - Error responses

---

## 🚀 Performance Requirements

- Response time: < 200ms cho simple queries
- Pagination: Default 10 items/page, max 50
- Database indexes trên:
  - `users.email`
  - `users.username`
  - `tasks.user_id`
  - `tasks.status`
  - `tasks.due_date`

---

## ✅ Acceptance Criteria

Project được coi là hoàn thành khi:

1. ✅ Tất cả endpoints hoạt động đúng
2. ✅ Validation đầy đủ
3. ✅ Error handling proper
4. ✅ Unit tests >80% coverage
5. ✅ Integration tests cho main flows
6. ✅ API documentation đầy đủ
7. ✅ Code follow best practices
8. ✅ Database schema optimized với indexes
9. ✅ Security implemented (JWT, password hashing)
10. ✅ Code review passed

---

## 📝 Notes

- **Week 1**: Focus vào core features (CRUD, basic auth)
- **Week 2**: Advanced features (search, filter, tests, documentation)
- Luôn áp dụng best practices từ đầu
- Refactor code thường xuyên
- Commit code với meaningful messages

---

**Let's build it! 💪**

