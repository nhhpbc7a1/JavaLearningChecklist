Đang kiểm tra nội dung Day 7 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 7 - REST API Best Practices & Bắt đầu Project 1:

## 📅 Kế hoạch luyện tập Day 7

### **Buổi sáng (4h): HTTP Methods, Status Codes & Best Practices**

---

## 🎯 **Exercise 1: HTTP Methods & Status Codes** (1.5h)

**Mục tiêu:** Hiểu và sử dụng đúng HTTP methods và status codes

**Yêu cầu:**

### **1.1 HTTP Methods Deep Dive**
1. Tạo controller với tất cả HTTP methods:
```java
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    
    // GET - Retrieve resource(s)
    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        return ResponseEntity.ok(articles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(@PathVariable Long id) {
        Article article = findById(id);
        if (article == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity.ok(article); // 200
    }
    
    // POST - Create new resource
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        Article created = save(article);
        return ResponseEntity.status(HttpStatus.CREATED) // 201
            .header("Location", "/api/articles/" + created.getId())
            .body(created);
    }
    
    // PUT - Update entire resource (replace)
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(
        @PathVariable Long id,
        @RequestBody Article article) {
        Article updated = update(id, article);
        if (updated == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity.ok(updated); // 200
    }
    
    // PATCH - Partial update
    @PatchMapping("/{id}")
    public ResponseEntity<Article> patchArticle(
        @PathVariable Long id,
        @RequestBody Map<String, Object> updates) {
        Article patched = partialUpdate(id, updates);
        if (patched == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity.ok(patched); // 200
    }
    
    // DELETE - Delete resource
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        boolean deleted = delete(id);
        if (!deleted) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity.noContent().build(); // 204
    }
}
```

### **1.2 HTTP Status Codes**
1. Tạo examples cho các status codes:
```java
@RestController
@RequestMapping("/api/examples")
public class StatusCodeExamples {
    
    // 200 OK - Success
    @GetMapping("/success")
    public ResponseEntity<String> success() {
        return ResponseEntity.ok("Success");
    }
    
    // 201 Created - Resource created
    @PostMapping("/create")
    public ResponseEntity<String> create() {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body("Resource created");
    }
    
    // 204 No Content - Success, no body
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteResource(id);
        return ResponseEntity.noContent().build();
    }
    
    // 400 Bad Request - Invalid input
    @PostMapping("/validate")
    public ResponseEntity<String> validate(@RequestBody String data) {
        if (data == null || data.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("Invalid input");
        }
        return ResponseEntity.ok("Valid");
    }
    
    // 401 Unauthorized - Not authenticated
    @GetMapping("/protected")
    public ResponseEntity<String> protected() {
        // Check authentication
        if (!isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Unauthorized");
        }
        return ResponseEntity.ok("Protected resource");
    }
    
    // 403 Forbidden - Not authorized
    @GetMapping("/admin")
    public ResponseEntity<String> admin() {
        if (!isAdmin()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Forbidden");
        }
        return ResponseEntity.ok("Admin resource");
    }
    
    // 404 Not Found - Resource not found
    @GetMapping("/{id}")
    public ResponseEntity<String> get(@PathVariable Long id) {
        String resource = findById(id);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resource);
    }
    
    // 409 Conflict - Resource conflict
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody String data) {
        if (exists(data)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Resource already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Created");
    }
    
    // 500 Internal Server Error
    @GetMapping("/error")
    public ResponseEntity<String> error() {
        try {
            // Some operation that might fail
            process();
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error");
        }
    }
}
```

### **1.3 Status Code Cheat Sheet**
Tạo bảng tóm tắt:
- 2xx: Success (200, 201, 204)
- 4xx: Client Error (400, 401, 403, 404, 409)
- 5xx: Server Error (500, 502, 503)

---

## 🎯 **Exercise 2: REST API Best Practices** (1.5h)

**Mục tiêu:** Áp dụng best practices cho REST API

**Yêu cầu:**

### **2.1 Naming Conventions**
1. URL naming:
```java
// ✅ Good: Use nouns, plural, lowercase, hyphens
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @GetMapping("/{id}/orders")  // Nested resources
    public List<Order> getUserOrders(@PathVariable Long id) {
        return orders;
    }
}

// ❌ Bad: Verbs, mixed case, underscores
@RequestMapping("/api/getUsers")  // Don't use verbs
@RequestMapping("/api/Get_Users")  // Don't use mixed case
```

2. Best practices:
   - Use nouns, not verbs: `/users` not `/getUsers`
   - Use plural: `/users` not `/user`
   - Use lowercase: `/users` not `/Users`
   - Use hyphens: `/user-profiles` not `/user_profiles`
   - Be consistent: `/api/users/{id}/orders` not `/api/user/{id}/order`

### **2.2 API Versioning**
1. URL versioning:
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
    // Version 1
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
    // Version 2 with different structure
}
```

2. Header versioning:
```java
@GetMapping(value = "/users", headers = "API-Version=1")
public List<User> getUsersV1() {
    // Version 1
}

@GetMapping(value = "/users", headers = "API-Version=2")
public List<User> getUsersV2() {
    // Version 2
}
```

### **2.3 Response Structure**
1. Standard response format:
```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private Long timestamp;
    // constructors, getters, setters
}

@RestController
public class UserController {
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long id) {
        User user = findById(id);
        if (user == null) {
            return ResponseEntity.ok(
                new ApiResponse<>(false, "User not found", null, System.currentTimeMillis())
            );
        }
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Success", user, System.currentTimeMillis())
        );
    }
}
```

2. Error response format:
```java
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private Long timestamp;
    // constructors, getters, setters
}

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            404,
            "Not Found",
            ex.getMessage(),
            "/api/users/123",
            System.currentTimeMillis()
        );
        return ResponseEntity.status(404).body(error);
    }
}
```

### **2.4 Pagination & Sorting**
Với các phần này thì best practice là dùng Page<T> của Spring Boot hỗ trợ sẵn
```java
@GetMapping
public ResponseEntity<PageResponse<User>> getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "id") String sortBy,
    @RequestParam(defaultValue = "asc") String sortDir) {
    
    List<User> users = userService.findAll(page, size, sortBy, sortDir);
    PageResponse<User> response = new PageResponse<>(
        users,
        page,
        size,
        totalCount
    );
    return ResponseEntity.ok(response);
}
```

---

## 🎯 **Exercise 3: Refactor Day 6 API** (1h)

**Mục tiêu:** Áp dụng best practices vào code Day 6

**Ghi chú:** Phân biệt annotation @ModelAttribute và @RequestBody

**Yêu cầu:**

1. Refactor Product Controller từ Day 6:
   - ✅ Thêm API versioning (`/api/v1/products`)
   - ✅ Standardize response format (ApiResponse)
   - ✅ Proper HTTP status codes
   - ✅ Error handling với ErrorResponse
   - ✅ Pagination cho GET all
   - ✅ Consistent naming

2. Before (Day 6):
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @GetMapping
    public List<Product> getAll() { ... }
}
```

3. After (Day 7):
```java
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Product>>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        // Implementation with pagination
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        // Implementation with proper error handling
    }
}
```

---

### **Buổi tối (4h): Project 1 - Setup & Entities**

---

## 🎯 **Exercise 4: Project 1 Setup & Planning** (1h)

**Mục tiêu:** Setup project structure và plan features

**Yêu cầu:**

### **4.1 Create Project Structure**
1. Tạo Spring Boot project từ Spring Initializr:
   - Project: Maven
   - Dependencies:
     - Spring Web
     - Spring Data JPA
     - PostgreSQL Driver
     - Validation
     - Lombok (optional)
     - Spring Boot DevTools

2. Tạo folder structure:
```
src/main/java/com/taskmanagement/
├── TaskManagementApplication.java
├── controller/
│   ├── UserController.java
│   ├── TaskController.java
│   └── CategoryController.java
├── service/
│   ├── UserService.java
│   ├── TaskService.java
│   └── CategoryService.java
├── repository/
│   ├── UserRepository.java
│   ├── TaskRepository.java
│   └── CategoryRepository.java
├── entity/
│   ├── User.java
│   ├── Task.java
│   └── Category.java
├── dto/
│   ├── request/
│   │   ├── CreateUserRequest.java
│   │   ├── CreateTaskRequest.java
│   │   └── UpdateTaskRequest.java
│   └── response/
│       ├── UserResponse.java
│       ├── TaskResponse.java
│       └── CategoryResponse.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── ValidationException.java
└── config/
    └── SwaggerConfig.java
```

### **4.2 Plan Features**
1. List tất cả features cần implement:
   - User Management (Register, Login, Profile)
   - Task CRUD
   - Category Management
   - Search & Filter
   - Pagination

2. Create TODO list trong README.md

---

## 🎯 **Exercise 5: Create Entities** (3h)

**Mục tiêu:** Tạo JPA entities cho User, Task, Category

**Yêu cầu:**

### **5.1 User Entity**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false, length = 20)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name", length = 100)
    private String fullName;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Task> tasks = new ArrayList<>();
    
    // Constructors, getters, setters
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### **5.2 Category Entity**
```java
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 7)
    private String color;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToMany(mappedBy = "categories")
    private Set<Task> tasks = new HashSet<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
}
```

### **5.3 Task Entity**
```java
@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority = TaskPriority.MEDIUM;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
    
    @ManyToMany
    @JoinTable(
        name = "task_categories",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors, getters, setters
}

public enum TaskStatus {
    TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED
}

public enum TaskPriority {
    LOW, MEDIUM, HIGH, URGENT
}
```

### **5.4 Create Repositories**
```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status);
}

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
}
```

### **5.5 Test Entities**
1. Tạo test để verify entities:
```java
@SpringBootTest
class EntityTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testUserCreation() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        
        User saved = userRepository.save(user);
        assertNotNull(saved.getId());
    }
}
```

---

## 📝 **Checklist Day 7**

### Buổi sáng:
- [ ] Exercise 1.1: HTTP Methods (GET, POST, PUT, PATCH, DELETE)
- [ ] Exercise 1.2: HTTP Status Codes (200, 201, 204, 400, 401, 403, 404, 409, 500)
- [ ] Exercise 1.3: Status Code Cheat Sheet
- [ ] Exercise 2.1: Naming Conventions
- [ ] Exercise 2.2: API Versioning
- [ ] Exercise 2.3: Response Structure (ApiResponse, ErrorResponse)
- [ ] Exercise 2.4: Pagination & Sorting
- [ ] Exercise 3: Refactor Day 6 API với best practices

### Buổi tối:
- [ ] Exercise 4.1: Create Project Structure
- [ ] Exercise 4.2: Plan Features
- [ ] Exercise 5.1: User Entity
- [ ] Exercise 5.2: Category Entity
- [ ] Exercise 5.3: Task Entity với relationships
- [ ] Exercise 5.4: Create Repositories
- [ ] Exercise 5.5: Test Entities

---

## 💡 **Tips**

1. HTTP Methods:
   - GET: Read (idempotent, safe)
   - POST: Create (not idempotent)
   - PUT: Update entire resource (idempotent)
   - PATCH: Partial update (idempotent)
   - DELETE: Delete (idempotent)

2. Status Codes:
   - 2xx: Success
   - 4xx: Client error (your fault)
   - 5xx: Server error (server fault)

3. Best Practices:
   - Always use proper HTTP methods
   - Return appropriate status codes
   - Version your APIs
   - Use consistent naming
   - Standardize response format

4. Entities:
   - Use `@Entity` và `@Table`
   - Use `@Id` và `@GeneratedValue`
   - Define relationships properly
   - Use enums for fixed values
   - Add timestamps với `@PrePersist`, `@PreUpdate`

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 7, bạn nên:
- ✅ Hiểu và sử dụng đúng HTTP methods
- ✅ Sử dụng đúng HTTP status codes
- ✅ Áp dụng REST API best practices
- ✅ Refactor code theo best practices
- ✅ Setup Project 1 structure
- ✅ Tạo được User, Task, Category entities
- ✅ Tạo được repositories
- ✅ Test entities hoạt động đúng

---

## 🔗 **Resources**

- **HTTP Methods**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- **HTTP Status Codes**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
- **REST API Best Practices**: https://restfulapi.net/
- **JPA Entities**: https://docs.oracle.com/javaee/7/api/javax/persistence/package-summary.html

Chúc bạn luyện tập tốt.