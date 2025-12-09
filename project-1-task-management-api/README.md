# 📝 Project 1: Task Management API

## 🎯 Mục tiêu

Xây dựng một REST API hoàn chỉnh cho ứng dụng quản lý công việc (Task Management) sử dụng **Spring Boot**, **JPA/Hibernate**, và **PostgreSQL**.

## ⏱️ Thời gian

**2 tuần** (buổi tối 4h/ngày = 56 giờ)

---

## 📋 Requirements

Xem chi tiết trong `requirements.md`

### Core Features
1. ✅ User Management (Registration, Login)
2. ✅ Task CRUD Operations
3. ✅ Task Categories/Tags
4. ✅ Task Status Management
5. ✅ Task Assignment
6. ✅ Search & Filter
7. ✅ Pagination

### Technical Requirements
- Spring Boot 3.x
- PostgreSQL Database
- JPA/Hibernate
- RESTful API Design
- Exception Handling
- Input Validation
- Unit Tests (JUnit 5)
- API Documentation (Swagger)

---

## 🏗️ Project Structure

```
task-management-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── taskmanagement/
│   │   │           ├── TaskManagementApplication.java
│   │   │           ├── controller/
│   │   │           │   ├── UserController.java
│   │   │           │   ├── TaskController.java
│   │   │           │   └── CategoryController.java
│   │   │           ├── service/
│   │   │           │   ├── UserService.java
│   │   │           │   ├── TaskService.java
│   │   │           │   └── CategoryService.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── TaskRepository.java
│   │   │           │   └── CategoryRepository.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── Task.java
│   │   │           │   └── Category.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   └── response/
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   └── CustomException.java
│   │   │           └── config/
│   │   │               ├── SwaggerConfig.java
│   │   │               └── SecurityConfig.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.yml
│   └── test/
│       └── java/
│           └── com/
│               └── taskmanagement/
│                   ├── controller/
│                   ├── service/
│                   └── repository/
├── pom.xml (Maven) hoặc build.gradle (Gradle)
├── README.md
└── .gitignore
```

---

## 🚀 Setup Guide

Xem chi tiết trong `setup-guide.md`

### Quick Start

1. **Tạo Spring Boot Project**
   ```bash
   # Sử dụng Spring Initializr
   https://start.spring.io/
   ```

2. **Dependencies cần thiết**
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Boot DevTools
   - Lombok (optional nhưng recommended)
   - SpringDoc OpenAPI (Swagger)

3. **Database Setup**
   - Tạo PostgreSQL database: `task_management_db`
   - Configure trong `application.properties`

4. **Run Application**
   ```bash
   ./mvnw spring-boot:run
   # hoặc
   ./gradlew bootRun
   ```

---

## ✅ Best Practices Checklist

Xem chi tiết trong `../best-practices/checklist-project-1.md`

### Code Quality
- [ ] Layered Architecture (Controller → Service → Repository)
- [ ] DTOs cho Request/Response
- [ ] Exception Handling với GlobalExceptionHandler
- [ ] Input Validation với Bean Validation
- [ ] Proper HTTP Status Codes
- [ ] Meaningful Error Messages

### Database
- [ ] Entity Relationships đúng
- [ ] Proper Indexing
- [ ] Database Migrations (Flyway hoặc Liquibase)
- [ ] Connection Pooling

### Testing
- [ ] Unit Tests cho Services (>80% coverage)
- [ ] Integration Tests cho Controllers
- [ ] Repository Tests

### Documentation
- [ ] API Documentation với Swagger
- [ ] Code Comments cho complex logic
- [ ] README với setup instructions

---

## 📚 Learning Resources

Xem `../learning-resources/week-1-2-resources.md`

---

## 🎯 Milestones

### Week 1
- [ ] Day 1-2: Setup project, tạo entities và repositories
- [ ] Day 3-4: Implement User management (Registration, Login)
- [ ] Day 5-6: Implement Task CRUD operations
- [ ] Day 7: Implement Categories và Task-Category relationship

### Week 2
- [ ] Day 8-9: Implement Search, Filter, Pagination
- [ ] Day 10-11: Exception Handling, Validation
- [ ] Day 12-13: Unit Tests và Integration Tests
- [ ] Day 14: API Documentation, Code Review, Refactoring

---

## 🔍 Code Review Checklist

Trước khi hoàn thành project, tự review:

1. **Architecture**: Code có follow layered architecture không?
2. **Naming**: Tên class, method, variable có rõ ràng không?
3. **DRY**: Có code duplication không?
4. **Error Handling**: Mọi error cases đã được handle chưa?
5. **Testing**: Test coverage đủ chưa?
6. **Documentation**: API có được document đầy đủ không?

---

## 💡 Tips

1. **Bắt đầu đơn giản**: Implement basic CRUD trước, sau đó thêm features
2. **Test thường xuyên**: Viết test ngay sau khi implement feature
3. **Refactor liên tục**: Đừng ngại refactor code khi học được cách tốt hơn
4. **Sử dụng AI**: Dùng AI để review code và suggest improvements
5. **Git Commits**: Commit thường xuyên với meaningful messages

---

**Good luck! 🚀**

