Đang kiểm tra nội dung Day 11 để lập kế hoạch luyện tập:


[3 tools called]


Kế hoạch luyện tập Day 11 - DTOs, Pagination & Search/Filter:

## 📅 Kế hoạch luyện tập Day 11

### **Buổi sáng (4h): DTOs & Pagination**

---

## 🎯 **Exercise 1: DTOs (Data Transfer Objects)** (1.5h)

**Mục tiêu:** Tạo Request/Response DTOs và mapping

**Yêu cầu:**

### **1.1 Request DTOs**
1. Tạo Request DTOs cho Task:
```java
// CreateTaskRequest
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200)
    private String title;
    
    @Size(max = 1000)
    private String description;
    
    @NotNull
    private TaskStatus status;
    
    @NotNull
    private TaskPriority priority;
    
    @Future
    private LocalDateTime dueDate;
    
    private List<Long> categoryIds;
}

// UpdateTaskRequest
@Data
public class UpdateTaskRequest {
    @Size(min = 3, max = 200)
    private String title;
    
    @Size(max = 1000)
    private String description;
    
    private TaskStatus status;
    
    private TaskPriority priority;
    
    private LocalDateTime dueDate;
    
    private List<Long> categoryIds;
}
```

### **1.2 Response DTOs**
1. Tạo Response DTOs:
```java
// TaskResponse
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private Long userId;
    private String userName;
    private Long assignedUserId;
    private String assignedUserName;
    private List<Long> categoryIds;
    private List<String> categoryNames;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// UserResponse
@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private LocalDateTime createdAt;
    // Không include password!
}

// CategoryResponse
@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String color;
    private Long userId;
    private LocalDateTime createdAt;
}
```

### **1.3 Mapping Entities to DTOs**
1. Tạo Mapper class:
```java
@Component
public class TaskMapper {
    
    public TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
            .id(task.getId())
            .title(task.getTitle())
            .description(task.getDescription())
            .status(task.getStatus())
            .priority(task.getPriority())
            .dueDate(task.getDueDate())
            .userId(task.getUser().getId())
            .userName(task.getUser().getUsername())
            .assignedUserId(task.getAssignedUser() != null ? 
                task.getAssignedUser().getId() : null)
            .assignedUserName(task.getAssignedUser() != null ? 
                task.getAssignedUser().getUsername() : null)
            .categoryIds(task.getCategories().stream()
                .map(Category::getId)
                .collect(Collectors.toList()))
            .categoryNames(task.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toList()))
            .createdAt(task.getCreatedAt())
            .updatedAt(task.getUpdatedAt())
            .build();
    }
    
    public Task toEntity(CreateTaskRequest request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setUser(user);
        return task;
    }
    
    public void updateEntity(UpdateTaskRequest request, Task task) {
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
    }
}
```

2. Sử dụng trong Service:
```java
@Service
public class TaskServiceImpl implements TaskService {
    
    @Autowired
    private TaskMapper taskMapper;
    
    @Override
    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        User user = findUserById(userId);
        Task task = taskMapper.toEntity(request, user);
        // Set categories, etc.
        Task saved = taskRepository.save(task);
        return taskMapper.toResponse(saved);
    }
}
```

### **1.4 MapStruct (Optional - Advanced)**
1. Nếu muốn dùng MapStruct (auto-generate mappers):
```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

```java
@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskResponse toResponse(Task task);
    Task toEntity(CreateTaskRequest request);
    void updateEntity(UpdateTaskRequest request, @MappingTarget Task task);
}
```

---

## 🎯 **Exercise 2: Pagination & Sorting** (1.5h)

**Mục tiêu:** Sử dụng `Pageable`, `Sort`, paginated responses

**Yêu cầu:**

### **2.1 Pageable Basics**
1. Sử dụng Pageable trong Repository:
```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByUserId(Long userId, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}
```

2. Sử dụng trong Service:
```java
@Override
public PageResponse<TaskResponse> getAllTasks(Long userId, Pageable pageable) {
    Page<Task> tasks = taskRepository.findByUserId(userId, pageable);
    
    List<TaskResponse> content = tasks.getContent().stream()
        .map(taskMapper::toResponse)
        .collect(Collectors.toList());
    
    return new PageResponse<>(
        content,
        tasks.getNumber(),
        tasks.getSize(),
        tasks.getTotalElements(),
        tasks.getTotalPages(),
        tasks.isFirst(),
        tasks.isLast()
    );
}
```

### **2.2 Sorting**
1. Tạo Sort trong Controller:
```java
@GetMapping
public ResponseEntity<PageResponse<TaskResponse>> getAllTasks(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy,
    @RequestParam(defaultValue = "DESC") String sortDir) {
    
    Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
        Sort.by(sortBy).ascending() : 
        Sort.by(sortBy).descending();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    
    PageResponse<TaskResponse> response = taskService.getAllTasks(userId, pageable);
    return ResponseEntity.ok(response);
}
```

2. Multiple sorting:
```java
Sort sort = Sort.by("priority").descending()
    .and(Sort.by("createdAt").descending());
Pageable pageable = PageRequest.of(page, size, sort);
```

### **2.3 PageResponse DTO**
1. Tạo PageResponse:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
            .content(page.getContent())
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .first(page.isFirst())
            .last(page.isLast())
            .build();
    }
}
```

---

## 🎯 **Exercise 3: Add Pagination to API** (1h)

**Mục tiêu:** Áp dụng pagination vào Project 1

**Yêu cầu:**

1. Add pagination cho tất cả list endpoints:
   - GET /api/v1/tasks
   - GET /api/v1/users
   - GET /api/v1/categories

2. Test với different parameters:
   - Different page numbers
   - Different page sizes
   - Different sort fields
   - Different sort directions

---

### **Buổi tối (4h): Search & Filter**

---

## 🎯 **Exercise 4: Implement Search & Filter** (4h)

**Mục tiêu:** Tạo search và filter functionality cho tasks

**Yêu cầu:**

### **4.1 Task Filter DTO**
1. Tạo TaskFilter:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilter {
    private TaskStatus status;
    private TaskPriority priority;
    private String search; // Search in title/description
    private Long categoryId;
    private LocalDateTime dueDateFrom;
    private LocalDateTime dueDateTo;
    private Boolean assignedToMe; // Filter by assigned user
}
```

### **4.2 Enhanced Specifications**
1. Tạo TaskSpecifications với filters:
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
    
    public static Specification<Task> titleOrDescriptionContains(String search) {
        return (root, query, cb) -> {
            String searchLower = "%" + search.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("title")), searchLower),
                cb.like(cb.lower(root.get("description")), searchLower)
            );
        };
    }
    
    public static Specification<Task> hasCategory(Long categoryId) {
        return (root, query, cb) -> {
            Join<Task, Category> categories = root.join("categories");
            return cb.equal(categories.get("id"), categoryId);
        };
    }
    
    public static Specification<Task> dueDateBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (from != null && to != null) {
                return cb.between(root.get("dueDate"), from, to);
            } else if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("dueDate"), from);
            } else if (to != null) {
                return cb.lessThanOrEqualTo(root.get("dueDate"), to);
            }
            return cb.conjunction(); // Always true
        };
    }
    
    public static Specification<Task> assignedToUser(Long userId) {
        return (root, query, cb) -> 
            cb.equal(root.get("assignedUser").get("id"), userId);
    }
    
    // Combine all filters
    public static Specification<Task> buildSpecification(TaskFilter filter, Long userId) {
        Specification<Task> spec = Specification.where(hasUserId(userId));
        
        if (filter.getStatus() != null) {
            spec = spec.and(hasStatus(filter.getStatus()));
        }
        
        if (filter.getPriority() != null) {
            spec = spec.and(hasPriority(filter.getPriority()));
        }
        
        if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
            spec = spec.and(titleOrDescriptionContains(filter.getSearch()));
        }
        
        if (filter.getCategoryId() != null) {
            spec = spec.and(hasCategory(filter.getCategoryId()));
        }
        
        if (filter.getDueDateFrom() != null || filter.getDueDateTo() != null) {
            spec = spec.and(dueDateBetween(filter.getDueDateFrom(), filter.getDueDateTo()));
        }
        
        if (filter.getAssignedToMe() != null && filter.getAssignedToMe()) {
            spec = spec.and(assignedToUser(userId));
        }
        
        return spec;
    }
}
```

### **4.3 Update Repository**
1. Update TaskRepository:
```java
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    // JpaSpecificationExecutor provides:
    // - findAll(Specification<T> spec)
    // - findAll(Specification<T> spec, Pageable pageable)
    // - count(Specification<T> spec)
}
```

### **4.4 Update Service**
1. Update TaskService:
```java
@Override
public PageResponse<TaskResponse> getAllTasks(Long userId, TaskFilter filter, Pageable pageable) {
    Specification<Task> spec = TaskSpecifications.buildSpecification(filter, userId);
    
    Page<Task> tasks = taskRepository.findAll(spec, pageable);
    
    List<TaskResponse> content = tasks.getContent().stream()
        .map(taskMapper::toResponse)
        .collect(Collectors.toList());
    
    return PageResponse.of(tasks).withContent(content);
}
```

### **4.5 Update Controller**
1. Update TaskController:
```java
@GetMapping
public ResponseEntity<ApiResponse<PageResponse<TaskResponse>>> getAllTasks(
    @RequestParam(required = false) TaskStatus status,
    @RequestParam(required = false) TaskPriority priority,
    @RequestParam(required = false) String search,
    @RequestParam(required = false) Long categoryId,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDateFrom,
    @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dueDateTo,
    @RequestParam(required = false) Boolean assignedToMe,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "createdAt") String sortBy,
    @RequestParam(defaultValue = "DESC") String sortDir,
    @RequestHeader("X-User-Id") Long userId) {
    
    TaskFilter filter = TaskFilter.builder()
        .status(status)
        .priority(priority)
        .search(search)
        .categoryId(categoryId)
        .dueDateFrom(dueDateFrom)
        .dueDateTo(dueDateTo)
        .assignedToMe(assignedToMe)
        .build();
    
    Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
        Sort.by(sortBy).ascending() : 
        Sort.by(sortBy).descending();
    
    Pageable pageable = PageRequest.of(page, size, sort);
    
    PageResponse<TaskResponse> tasks = taskService.getAllTasks(userId, filter, pageable);
    return ResponseEntity.ok(ApiResponse.success("Tasks retrieved", tasks));
}
```

### **4.6 Test Search & Filter**
1. Test với Postman:
   - Search: `GET /api/v1/tasks?search=java`
   - Filter by status: `GET /api/v1/tasks?status=TODO`
   - Filter by priority: `GET /api/v1/tasks?priority=HIGH`
   - Filter by category: `GET /api/v1/tasks?categoryId=1`
   - Combined filters: `GET /api/v1/tasks?status=TODO&priority=HIGH&search=java`
   - Date range: `GET /api/v1/tasks?dueDateFrom=2024-01-01T00:00:00&dueDateTo=2024-12-31T23:59:59`
   - Assigned to me: `GET /api/v1/tasks?assignedToMe=true`

---

## 📝 **Checklist Day 11**

### Buổi sáng:
- [ ] Exercise 1.1: Request DTOs (CreateTaskRequest, UpdateTaskRequest)
- [ ] Exercise 1.2: Response DTOs (TaskResponse, UserResponse, CategoryResponse)
- [ ] Exercise 1.3: Mapping Entities to DTOs
- [ ] Exercise 1.4: MapStruct (optional)
- [ ] Exercise 2.1: Pageable Basics
- [ ] Exercise 2.2: Sorting (single, multiple)
- [ ] Exercise 2.3: PageResponse DTO
- [ ] Exercise 3: Add Pagination to API

### Buổi tối:
- [ ] Exercise 4.1: Task Filter DTO
- [ ] Exercise 4.2: Enhanced Specifications
- [ ] Exercise 4.3: Update Repository với JpaSpecificationExecutor
- [ ] Exercise 4.4: Update Service với filter
- [ ] Exercise 4.5: Update Controller với query parameters
- [ ] Exercise 4.6: Test Search & Filter với Postman

---

## 💡 **Tips**

1. DTOs:
   - Không expose entities trực tiếp
   - Request DTOs: chỉ fields cần thiết cho input
   - Response DTOs: chỉ fields cần thiết cho output
   - Không bao giờ expose sensitive data (passwords, tokens)

2. Pagination:
   - Default page size: 10-20 items
   - Max page size: 50-100 items
   - Always return total count
   - Support sorting

3. Search & Filter:
   - Use Specifications cho dynamic queries
   - Combine multiple filters với AND
   - Case-insensitive search
   - Support date ranges

4. Best Practices:
   - Validate filter parameters
   - Limit search string length
   - Index database columns used in filters
   - Cache frequently used filters

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 11, bạn nên:
- ✅ Tạo và sử dụng DTOs đúng cách
- ✅ Map entities to DTOs
- ✅ Implement pagination cho list endpoints
- ✅ Implement sorting
- ✅ Implement search functionality
- ✅ Implement filter functionality
- ✅ Combine search và filter
- ✅ Test với Postman

---

## 🔗 **Resources**

- **DTO Pattern**: https://martinfowler.com/eaaCatalog/dataTransferObject.html
- **Spring Data Pagination**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation
- **JPA Specifications**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications

Chúc bạn luyện tập tốt.