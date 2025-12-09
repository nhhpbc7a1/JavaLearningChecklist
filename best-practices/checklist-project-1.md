# ✅ Best Practices Checklist - Project 1

## 📋 Code Quality

### Architecture
- [ ] **Layered Architecture**: Controller → Service → Repository
  - Controller chỉ handle HTTP requests/responses
  - Service chứa business logic
  - Repository chỉ làm việc với database
- [ ] **Separation of Concerns**: Mỗi layer có responsibility rõ ràng
- [ ] **Package Structure**: Organized theo feature hoặc layer
- [ ] **No Business Logic in Controller**: Tất cả logic ở Service layer

### Naming Conventions
- [ ] **Class Names**: PascalCase, descriptive (e.g., `TaskService`, `UserController`)
- [ ] **Method Names**: camelCase, verb-based (e.g., `createTask`, `findUserById`)
- [ ] **Variable Names**: camelCase, meaningful (e.g., `taskRepository`, không phải `tr`)
- [ ] **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_TASK_TITLE_LENGTH`)
- [ ] **Package Names**: lowercase, no underscores (e.g., `com.taskmanagement.service`)

### Code Organization
- [ ] **Single Responsibility Principle**: Mỗi class/method làm 1 việc
- [ ] **DRY (Don't Repeat Yourself)**: Không có code duplication
- [ ] **Magic Numbers**: Sử dụng constants thay vì hardcode numbers
- [ ] **Method Length**: Methods < 50 lines (ideally < 20)
- [ ] **Class Length**: Classes < 500 lines (ideally < 300)

---

## 🏗️ DTOs & Data Transfer

### Request/Response DTOs
- [ ] **Separate DTOs**: Không expose Entity trực tiếp
- [ ] **Request DTOs**: Cho create/update operations
- [ ] **Response DTOs**: Cho API responses
- [ ] **DTO Validation**: Sử dụng Bean Validation annotations
- [ ] **Mapper Pattern**: Sử dụng MapStruct hoặc manual mappers

### Example Structure
```java
// Request DTO
public class CreateTaskRequest {
    @NotBlank
    @Size(min = 3, max = 200)
    private String title;
    
    @Size(max = 1000)
    private String description;
    // ...
}

// Response DTO
public class TaskResponse {
    private Long id;
    private String title;
    private String status;
    // ...
}
```

---

## ⚠️ Exception Handling

### Global Exception Handler
- [ ] **@ControllerAdvice**: Có GlobalExceptionHandler
- [ ] **Custom Exceptions**: Tạo custom exceptions cho business errors
- [ ] **Error Response Format**: Consistent error response structure
- [ ] **HTTP Status Codes**: Sử dụng đúng status codes
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (authentication)
  - 403: Forbidden (authorization)
  - 404: Not Found
  - 409: Conflict (duplicate resources)
  - 500: Internal Server Error

### Exception Types
- [ ] **ResourceNotFoundException**: Khi resource không tồn tại
- [ ] **ValidationException**: Khi validation fails
- [ ] **DuplicateResourceException**: Khi tạo duplicate resource
- [ ] **UnauthorizedException**: Khi user không có quyền

### Example
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(...));
    }
}
```

---

## ✅ Validation

### Input Validation
- [ ] **Bean Validation**: Sử dụng `@Valid`, `@NotNull`, `@NotBlank`, `@Size`, etc.
- [ ] **Custom Validators**: Tạo custom validators nếu cần
- [ ] **Validation Messages**: Meaningful error messages
- [ ] **Validate at Controller**: `@Valid` annotation trên request DTOs

### Example
```java
@PostMapping("/tasks")
public ResponseEntity<TaskResponse> createTask(
    @Valid @RequestBody CreateTaskRequest request) {
    // ...
}
```

---

## 🗄️ Database Best Practices

### Entity Design
- [ ] **JPA Annotations**: Proper use of `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
- [ ] **Relationships**: Correct use of `@OneToMany`, `@ManyToOne`, `@ManyToMany`
- [ ] **Cascade Types**: Set appropriate cascade types
- [ ] **Fetch Types**: Use `LAZY` by default, `EAGER` only when necessary
- [ ] **Audit Fields**: `createdAt`, `updatedAt` (có thể dùng `@EntityListeners`)

### Repository
- [ ] **Spring Data JPA**: Sử dụng interface repositories
- [ ] **Query Methods**: Sử dụng method naming conventions
- [ ] **Custom Queries**: `@Query` annotation khi cần complex queries
- [ ] **Pagination**: Sử dụng `Pageable` cho list endpoints

### Performance
- [ ] **Indexes**: Database indexes trên foreign keys và frequently queried fields
- [ ] **N+1 Problem**: Tránh N+1 queries (sử dụng `@EntityGraph` hoặc `JOIN FETCH`)
- [ ] **Connection Pooling**: Configured properly (HikariCP default)
- [ ] **Query Optimization**: Avoid `SELECT *`, chỉ select needed fields

### Example
```java
@Entity
@Table(name = "tasks", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status")
})
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
```

---

## 🔒 Security

### Authentication
- [ ] **Password Hashing**: BCrypt với strength >= 10
- [ ] **JWT Implementation**: Proper JWT token generation và validation
- [ ] **Token Expiration**: Set appropriate expiration time
- [ ] **Security Config**: Proper Spring Security configuration

### Authorization
- [ ] **Role-Based Access**: Implement RBAC nếu cần
- [ ] **Resource Ownership**: Check ownership trước khi allow access
- [ ] **Method Security**: Sử dụng `@PreAuthorize` hoặc manual checks

### Best Practices
- [ ] **No Sensitive Data in Logs**: Không log passwords, tokens
- [ ] **HTTPS in Production**: Always use HTTPS
- [ ] **CORS Configuration**: Configure CORS properly
- [ ] **CSRF Protection**: Enable CSRF protection (hoặc disable nếu dùng JWT)

---

## 🧪 Testing

### Unit Tests
- [ ] **Service Layer Tests**: Test tất cả business logic
- [ ] **Test Coverage**: > 80% coverage
- [ ] **Test Naming**: Descriptive test names (e.g., `shouldThrowExceptionWhenTaskNotFound`)
- [ ] **Arrange-Act-Assert**: Follow AAA pattern
- [ ] **Mocking**: Sử dụng Mockito để mock dependencies
- [ ] **Edge Cases**: Test edge cases và error scenarios

### Integration Tests
- [ ] **Controller Tests**: Test API endpoints với `@WebMvcTest`
- [ ] **Repository Tests**: Test database operations với `@DataJpaTest`
- [ ] **Test Database**: Sử dụng H2 in-memory database
- [ ] **Test Data**: Use `@Sql` hoặc programmatic setup

### Example
```java
@ExtendWith(MockitoExtension.class)
class TaskServiceTest {
    
    @Mock
    private TaskRepository taskRepository;
    
    @InjectMocks
    private TaskService taskService;
    
    @Test
    void shouldCreateTaskWhenValidRequest() {
        // Arrange
        CreateTaskRequest request = new CreateTaskRequest(...);
        Task savedTask = new Task(...);
        when(taskRepository.save(any())).thenReturn(savedTask);
        
        // Act
        TaskResponse response = taskService.createTask(request);
        
        // Assert
        assertNotNull(response);
        assertEquals("Expected Title", response.getTitle());
    }
}
```

---

## 📝 Documentation

### Code Documentation
- [ ] **JavaDoc**: JavaDoc comments cho public methods
- [ ] **Inline Comments**: Comments cho complex logic
- [ ] **README**: Comprehensive README với setup instructions

### API Documentation
- [ ] **Swagger/OpenAPI**: All endpoints documented
- [ ] **Request Examples**: Example requests cho mỗi endpoint
- [ ] **Response Examples**: Example responses
- [ ] **Error Responses**: Documented error responses
- [ ] **Annotations**: Sử dụng `@Operation`, `@ApiResponse` annotations

---

## 🚀 Performance

### API Performance
- [ ] **Response Time**: < 200ms cho simple queries
- [ ] **Pagination**: Implement pagination cho list endpoints
- [ ] **Caching**: Consider caching cho frequently accessed data
- [ ] **Async Operations**: Use async cho long-running operations nếu cần

### Database Performance
- [ ] **Indexes**: Proper indexes on foreign keys và query fields
- [ ] **Query Optimization**: Optimized queries, no N+1 problems
- [ ] **Connection Pooling**: Configured properly

---

## 🔧 Configuration

### Application Properties
- [ ] **Environment-Specific**: Separate configs cho dev/prod
- [ ] **Externalized Config**: Sensitive data không hardcode
- [ ] **Profile-Based**: Sử dụng Spring profiles
- [ ] **Validation**: Validate configuration on startup

### Logging
- [ ] **Logging Levels**: Appropriate logging levels
- [ ] **Structured Logging**: Consider structured logging (JSON format)
- [ ] **No Sensitive Data**: Không log passwords, tokens, PII

---

## 📦 Build & Deployment

### Build Configuration
- [ ] **Maven/Gradle**: Proper build configuration
- [ ] **Dependencies**: Up-to-date dependencies, no vulnerabilities
- [ ] **Build Scripts**: Build scripts work correctly

### Version Control
- [ ] **Git**: Proper git usage
- [ ] **Commit Messages**: Meaningful commit messages
- [ ] **.gitignore**: Proper .gitignore file
- [ ] **Branching**: Use branches cho features

---

## ✅ Final Checklist

Trước khi hoàn thành project:

- [ ] **Code Review**: Self-review code
- [ ] **All Tests Pass**: All unit và integration tests pass
- [ ] **No Linter Errors**: Code passes linter checks
- [ ] **Documentation Complete**: README và API docs complete
- [ ] **Security Check**: Security best practices followed
- [ ] **Performance Check**: Performance requirements met
- [ ] **Error Handling**: All error cases handled
- [ ] **Clean Code**: Code is clean, readable, maintainable

---

## 🎯 Scoring Yourself

Rate each category (1-5):
- **Architecture**: ___/5
- **Code Quality**: ___/5
- **Testing**: ___/5
- **Documentation**: ___/5
- **Security**: ___/5
- **Performance**: ___/5

**Target**: Tất cả categories >= 4/5

---

**Good luck! 🚀**

