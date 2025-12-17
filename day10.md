Đang kiểm tra nội dung Day 10 để lập kế hoạch luyện tập:


[3 tools called]


Kế hoạch luyện tập Day 10 - Input Validation, Exception Handling & Task Service:

## 📅 Kế hoạch luyện tập Day 10

### **Buổi sáng (4h): Input Validation & Exception Handling**

---

## 🎯 **Exercise 1: Input Validation** (1.5h)

**Mục tiêu:** Sử dụng `@Valid`, `@NotNull`, `@NotBlank`, `@Size`, etc.

**Yêu cầu:**

### **1.1 Bean Validation Annotations**
1. Tạo DTO với validation:
```java
public class CreateUserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$", 
             message = "Password must contain uppercase, lowercase, number, and special character")
    private String password;
    
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;
    
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 120, message = "Age must not exceed 120")
    private Integer age;
    
    // Getters, setters
}
```

2. Tạo CreateTaskRequest:
```java
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Status is required")
    private TaskStatus status;
    
    @NotNull(message = "Priority is required")
    private TaskPriority priority;
    
    @Future(message = "Due date must be in the future")
    private LocalDateTime dueDate;
    
    @NotEmpty(message = "At least one category is required")
    private List<Long> categoryIds;
    
    // Getters, setters
}
```

### **1.2 Enable Validation**
1. Add dependency (nếu chưa có):
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

2. Sử dụng `@Valid` trong Controller:
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request) {
        // Process request
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request) {
        // Process request
    }
}
```

### **1.3 Custom Validators**
1. Tạo custom validator:
```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email already exists";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return true; // Let @NotNull handle null
        }
        return !userRepository.existsByEmail(email);
    }
}
```

2. Sử dụng:
```java
public class CreateUserRequest {
    @UniqueEmail
    @Email
    private String email;
}
```

## BẢNG QUYẾT ĐỊNH VALIDATOR

### 1. String fields

| Tình huống | Validator | Ví dụ |
|------------|-----------|-------|
| Bắt buộc, không rỗng | `@NotBlank` | username, email, password |
| Bắt buộc, cho phép rỗng | `@NotNull` | Hiếm dùng cho String |
| Tùy chọn, có thể null | Không cần `@NotNull` | fullName, description |
| Giới hạn độ dài | `@Size(min=X, max=Y)` | Theo `length` trong `@Column` |
| Format email | `@Email` | email |
| Format cụ thể | `@Pattern(regexp="...")` | phone, username format |
| URL | `@URL` | website, avatar |

### 2. Số (Integer, Long, Double, BigDecimal)

| Tình huống | Validator | Ví dụ |
|------------|-----------|-------|
| Bắt buộc | `@NotNull` | age, price, quantity |
| Số dương | `@Positive` | ID, price, quantity |
| Số >= 0 | `@PositiveOrZero` | quantity, count |
| Số âm | `@Negative` | Hiếm dùng |
| Min/Max | `@Min(X)`, `@Max(Y)` | age (1-120), rating (1-5) |
| Decimal | `@DecimalMin`, `@DecimalMax` | price, amount |

### 3. Ngày tháng (LocalDate, LocalDateTime)

| Tình huống | Validator | Ví dụ |
|------------|-----------|-------|
| Bắt buộc | `@NotNull` | dueDate, birthDate |
| Quá khứ | `@Past` | birthDate, createdAt |
| Tương lai | `@Future` | dueDate, expiryDate |
| Quá khứ hoặc hiện tại | `@PastOrPresent` | updatedAt |
| Tương lai hoặc hiện tại | `@FutureOrPresent` | startDate |

### 4. Collection/List

| Tình huống | Validator | Ví dụ |
|------------|-----------|-------|
| Không rỗng | `@NotEmpty` | categoryIds (nếu bắt buộc) |
| Kích thước | `@Size(min=X, max=Y)` | categoryIds (1-10) |
| Validate phần tử | `@Valid` + validator trên phần tử | List<ItemRequest> |

### 5. Enum

| Tình huống | Validator | Ví dụ |
|------------|-----------|-------|
| Bắt buộc | `@NotNull` | priority, status |
| Giá trị hợp lệ | Không cần (Spring tự validate) | priority (LOW, MEDIUM, HIGH) |

## QUY TẮC CHỌN MIN/MAX

### 1. Dựa trên DB constraint

```java
// Entity: @Column(length = 20)
// DTO: @Size(max = 20) // Luôn lấy từ DB
```

### 2. Best practices cho String

```java
// Username: 3-20 hoặc 3-30
@Size(min = 3, max = 20)

// Password: 8-100 (hoặc 8-128)
@Size(min = 8, max = 100)

// Email: max = 100 (theo DB)
@Size(max = 100)

// Title: 3-200 (theo DB)
@Size(min = 3, max = 200)

// Description: max = 5000 (nếu TEXT trong DB)
@Size(max = 5000)
```

### 3. Best practices cho số

```java
// ID: @Positive (luôn > 0)
@Positive

// Age: 1-120
@Min(1) @Max(120)

// Rating: 1-5
@Min(1) @Max(5)

// Quantity: >= 0
@PositiveOrZero

// Price: > 0
@Positive
@DecimalMin(value = "0.01")
```

## CHECKLIST KHI THÊM VALIDATOR

### Cho mỗi field, hỏi:

1. Field này bắt buộc hay tùy chọn?
   - Bắt buộc → `@NotNull` hoặc `@NotBlank`
   - Tùy chọn → không cần `@NotNull`

2. Loại dữ liệu là gì?
   - String → `@NotBlank` (nếu bắt buộc) hoặc `@Size`
   - Number → `@NotNull` + `@Positive`/`@Min`/`@Max`
   - Date → `@NotNull` + `@Past`/`@Future`
   - Collection → `@NotEmpty` hoặc `@Size`

3. Có constraint trong DB không?
   - `nullable = false` → `@NotNull` hoặc `@NotBlank`
   - `length = X` → `@Size(max = X)`

4. Có business rule đặc biệt không?
   - Email → `@Email`
   - Password mạnh → `@Pattern`
   - Date trong tương lai → `@Future`
   - Số dương → `@Positive`

5. Có cần min length không?
   - Username → `min = 3`
   - Password → `min = 8`
   - Title → `min = 3`


## TÓM TẮT QUY TẮC VÀNG

1. Luôn đồng bộ với DB constraints (`nullable`, `length`)
2. String bắt buộc → `@NotBlank` (không phải `@NotNull`)
3. Số bắt buộc → `@NotNull` + `@Positive`/`@Min`/`@Max`
4. Email → `@Email` + `@NotBlank`
5. Password → `@NotBlank` + `@Size(min = 8)`
6. Date tương lai → `@Future`
7. Collection → `@Size` hoặc `@NotEmpty`
8. Enum → `@NotNull`

---

## 🎯 **Exercise 2: Exception Handling** (1.5h)

**Mục tiêu:** Sử dụng `@ControllerAdvice`, `GlobalExceptionHandler`

**Yêu cầu:**

### **2.1 Custom Exceptions**
1. Tạo custom exceptions:
```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }
}

public class ValidationException extends RuntimeException {
    private Map<String, String> errors;
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }
    
    // Getters
}

public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
```

### **2.2 Global Exception Handler**
1. Tạo GlobalExceptionHandler:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex, WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Not Found")
            .message(ex.getMessage())
            .path(getPath(request))
            .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(
        MethodArgumentNotValidException ex, WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errors.put(error.getField(), error.getDefaultMessage());
        });
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.BAD_REQUEST.value())
            .error("Validation Failed")
            .message("Invalid input")
            .errors(errors)
            .path(getPath(request))
            .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResource(
        DuplicateResourceException ex, WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.CONFLICT.value())
            .error("Conflict")
            .message(ex.getMessage())
            .path(getPath(request))
            .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
        Exception ex, WebRequest request) {
        
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .error("Internal Server Error")
            .message(ex.getMessage())
            .path(getPath(request))
            .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    private String getPath(WebRequest request) {
        return ((ServletWebRequest) request).getRequest().getRequestURI();
    }
}
```

### **2.3 Error Response DTO**
1. Tạo ErrorResponse:
```java
@Builder
@Data
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> errors; // For validation errors
}
```

### **2.4 Use Exceptions in Service**
1. Throw exceptions trong Service:
```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        
        User user = new User();
        // Map request to entity
        return userRepository.save(user);
    }
}
```

---

## 🎯 **Exercise 3: Add Validation to API** (1h)

**Mục tiêu:** Áp dụng validation vào Project 1

**Yêu cầu:**

1. Add validation cho tất cả DTOs:
   - `CreateUserRequest`
   - `UpdateUserRequest`
   - `CreateTaskRequest`
   - `UpdateTaskRequest`
   - `CreateCategoryRequest`

2. Add `@Valid` vào tất cả Controller methods

3. Test validation:
   - Send invalid requests
   - Verify error responses
   - Check error messages

---

### **Buổi tối (4h): Task Service & Controller**

---

## 🎯 **Exercise 4: Implement Task Service** (2h)

**Mục tiêu:** Tạo Task Service với CRUD operations

**Yêu cầu:**

### **4.1 Task Service Interface**
```java
public interface TaskService {
    TaskResponse createTask(CreateTaskRequest request, Long userId);
    TaskResponse getTaskById(Long id, Long userId);
    PageResponse<TaskResponse> getAllTasks(Long userId, TaskFilter filter, Pageable pageable);
    TaskResponse updateTask(Long id, UpdateTaskRequest request, Long userId);
    void deleteTask(Long id, Long userId);
    TaskResponse assignTask(Long taskId, Long assignedUserId, Long ownerId);
}
```

### **4.2 Task Service Implementation**
```java
@Service
@Transactional
public class TaskServiceImpl implements TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        // Create task
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setUser(user);
        
        // Add categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = categoryRepository.findAllById(request.getCategoryIds())
                .stream()
                .collect(Collectors.toSet());
            task.setCategories(categories);
        }
        
        Task saved = taskRepository.save(task);
        return mapToResponse(saved);
    }
    
    @Override
    public TaskResponse getTaskById(Long id, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        // Check ownership
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to access this task");
        }
        
        return mapToResponse(task);
    }
    
    @Override
    public PageResponse<TaskResponse> getAllTasks(Long userId, TaskFilter filter, Pageable pageable) {
        Specification<Task> spec = Specification.where(TaskSpecifications.hasUserId(userId));
        
        if (filter.getStatus() != null) {
            spec = spec.and(TaskSpecifications.hasStatus(filter.getStatus()));
        }
        
        if (filter.getPriority() != null) {
            spec = spec.and(TaskSpecifications.hasPriority(filter.getPriority()));
        }
        
        if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
            spec = spec.and(TaskSpecifications.titleContains(filter.getSearch()));
        }
        
        Page<Task> tasks = taskRepository.findAll(spec, pageable);
        
        List<TaskResponse> content = tasks.getContent().stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
        
        return new PageResponse<>(content, tasks.getNumber(), tasks.getSize(), 
            tasks.getTotalElements(), tasks.getTotalPages());
    }
    
    @Override
    public TaskResponse updateTask(Long id, UpdateTaskRequest request, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        // Check ownership or assignment
        if (!task.getUser().getId().equals(userId) && 
            (task.getAssignedUser() == null || !task.getAssignedUser().getId().equals(userId))) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }
        
        // Update fields
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        
        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }
    
    @Override
    public void deleteTask(Long id, Long userId) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        
        // Only owner can delete
        if (!task.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Only task owner can delete the task");
        }
        
        taskRepository.delete(task);
    }
    
    @Override
    public TaskResponse assignTask(Long taskId, Long assignedUserId, Long ownerId) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskId));
        
        // Check ownership
        if (!task.getUser().getId().equals(ownerId)) {
            throw new UnauthorizedException("Only task owner can assign the task");
        }
        
        User assignedUser = userRepository.findById(assignedUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", assignedUserId));
        
        task.setAssignedUser(assignedUser);
        Task updated = taskRepository.save(task);
        return mapToResponse(updated);
    }
    
    private TaskResponse mapToResponse(Task task) {
        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .dueDate(task.getDueDate())
            .userId(task.getUser().getId())
            .assignedUserId(task.getAssignedUser() != null ? task.getAssignedUser().getId() : null)
            .categoryIds(task.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toList()))
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
}
```

### **4.3 Task Specifications**
```java
public class TaskSpecifications {
    public static Specification<Task> hasUserId(Long userId) {
        return (root, query, cb) -> 
            cb.equal(root.get("user").get("id"), userId);
    }
    
    public static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) -> 
            cb.equal(root.get("status"), status);
    }
    
    public static Specification<Task> hasPriority(TaskPriority priority) {
        return (root, query, cb) -> 
            cb.equal(root.get("priority"), priority);
    }
    
    public static Specification<Task> titleContains(String title) {
        return (root, query, cb) -> 
            cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
}
```

---

## 🎯 **Exercise 5: Implement Task Controller** (2h)

**Mục tiêu:** Tạo REST endpoints cho Task management

**Yêu cầu:**

### **5.1 Task Controller**
```java
@RestController
@RequestMapping("/api/v1/tasks")
@Validated
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
        @Valid @RequestBody CreateTaskRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        
        TaskResponse task = taskService.createTask(request, userId);
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Task created successfully", task));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId) {
        
        TaskResponse task = taskService.getTaskById(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Task retrieved", task));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<TaskResponse>>> getAllTasks(
        @RequestParam(required = false) TaskStatus status,
        @RequestParam(required = false) TaskPriority priority,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDir,
        @RequestHeader("X-User-Id") Long userId) {
        
        TaskFilter filter = TaskFilter.builder()
            .status(status)
            .priority(priority)
            .search(search)
            .build();
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
            Sort.by(sortBy).ascending() : 
            Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<TaskResponse> tasks = taskService.getAllTasks(userId, filter, pageable);
        return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", tasks));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
        @PathVariable Long id,
        @Valid @RequestBody UpdateTaskRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        
        TaskResponse task = taskService.updateTask(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Task updated", task));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId) {
        
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<TaskResponse>> assignTask(
        @PathVariable Long id,
        @Valid @RequestBody AssignTaskRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        
        TaskResponse task = taskService.assignTask(id, request.getUserId(), userId);
        return ResponseEntity.ok(ApiResponse.success("Task assigned", task));
    }
}
```

### **5.2 DTOs**
```java
// TaskFilter
@Builder
@Data
public class TaskFilter {
    private TaskStatus status;
    private TaskPriority priority;
    private String search;
}

// AssignTaskRequest
@Data
public class AssignTaskRequest {
    @NotNull(message = "User ID is required")
    private Long userId;
}
```

### **5.3 Test với Postman**
1. Tạo Postman collection:
   - POST /api/v1/tasks (create)
   - GET /api/v1/tasks (get all với filters)
   - GET /api/v1/tasks/{id} (get by id)
   - PUT /api/v1/tasks/{id} (update)
   - DELETE /api/v1/tasks/{id} (delete)
   - POST /api/v1/tasks/{id}/assign (assign)

2. Test scenarios:
   - Valid requests
   - Invalid validation
   - Not found (404)
   - Unauthorized (403)

---

## 📝 **Checklist Day 10**

### Buổi sáng:
- [ ] Exercise 1.1: Bean Validation Annotations
- [ ] Exercise 1.2: Enable Validation với @Valid
- [ ] Exercise 1.3: Custom Validators
- [ ] Exercise 2.1: Custom Exceptions
- [ ] Exercise 2.2: Global Exception Handler
- [ ] Exercise 2.3: Error Response DTO
- [ ] Exercise 2.4: Use Exceptions in Service
- [ ] Exercise 3: Add Validation to API

### Buổi tối:
- [ ] Exercise 4.1: Task Service Interface
- [ ] Exercise 4.2: Task Service Implementation
- [ ] Exercise 4.3: Task Specifications
- [ ] Exercise 5.1: Task Controller
- [ ] Exercise 5.2: DTOs (TaskFilter, AssignTaskRequest)
- [ ] Exercise 5.3: Test với Postman

---

## 💡 **Tips**

1. Validation:
   - Luôn validate input ở Controller level
   - Dùng `@Valid` với `@RequestBody`
   - Tạo custom validators cho business rules
   - Provide meaningful error messages

2. Exception Handling:
   - Tạo custom exceptions cho business errors
   - Use `@ControllerAdvice` cho global handling
   - Return consistent error response format
   - Log exceptions for debugging

3. Service Layer:
   - Service chứa business logic
   - Validate business rules
   - Throw exceptions khi invalid
   - Use `@Transactional` cho database operations

4. Best Practices:
   - Check ownership trước khi allow operations
   - Use Specifications cho dynamic queries
   - Map entities to DTOs (không expose entities)
   - Handle edge cases (null, empty, etc.)

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 10, bạn nên:
- ✅ Validate input với Bean Validation
- ✅ Handle exceptions với GlobalExceptionHandler
- ✅ Tạo custom exceptions
- ✅ Implement Task Service với CRUD
- ✅ Implement Task Controller với REST endpoints
- ✅ Test API với Postman
- ✅ Handle validation errors và exceptions đúng cách

---

## 🔗 **Resources**

- **Bean Validation**: https://beanvalidation.org/
- **Spring Exception Handling**: https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html
- **Postman**: https://www.postman.com/downloads/

Chúc bạn luyện tập tốt.