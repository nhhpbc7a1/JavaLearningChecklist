Đang kiểm tra nội dung Day 6 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 6 - Spring MVC & REST Controllers:

## 📅 Kế hoạch luyện tập Day 6

### **Buổi sáng (4h): Spring MVC & REST Controllers**

---

## 🎯 **Exercise 1: Spring MVC Architecture** (1.5h)

**Mục tiêu:** Hiểu MVC pattern, DispatcherServlet, HandlerMapping

**Yêu cầu:**

### **1.1 Hiểu Spring MVC Flow**
1. Đọc và tóm tắt flow:
   ```
   Client Request
      ↓
   DispatcherServlet (Front Controller)
      ↓
   HandlerMapping (tìm Controller)
      ↓
   Controller (xử lý request)
      ↓
   Model (data)
      ↓
   ViewResolver (resolve view)
      ↓
   View (response)
   ```

2. Tạo diagram mô tả flow

### **1.2 DispatcherServlet**
1. Tạo simple example để thấy DispatcherServlet hoạt động:
```java
@SpringBootApplication
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

2. Kiểm tra DispatcherServlet được auto-configured:
   - Check logs khi start application
   - Tìm "DispatcherServlet" trong logs

### **1.3 HandlerMapping**
1. Tạo multiple controllers và test routing:
```java
@RestController
@RequestMapping("/api/v1")
public class UserController {
    @GetMapping("/users")
    public String getUsers() {
        return "Users";
    }
}

@RestController
@RequestMapping("/api/v2")
public class ProductController {
    @GetMapping("/products")
    public String getProducts() {
        return "Products";
    }
}
```

2. Test các endpoints:
   - http://localhost:8080/api/v1/users
   - http://localhost:8080/api/v2/products

---

## 🎯 **Exercise 2: REST Controllers** (1.5h)

**Mục tiêu:** Sử dụng `@RestController`, `@RequestMapping`

**Yêu cầu:**

### **2.1 @RestController vs @Controller**
1. So sánh:
```java
// @Controller - returns view name
@Controller
public class ViewController {
    @GetMapping("/home")
    public String home() {
        return "home"; // Returns view name
    }
}

// @RestController - returns data (JSON/XML)
@RestController
public class ApiController {
    @GetMapping("/api/data")
    public String data() {
        return "data"; // Returns response body
    }
}
```

2. Tạo example cho mỗi loại

### **2.2 @RequestMapping**
1. Tạo controller với different mappings:
```java
@RestController
@RequestMapping("/api/books")  // Base path
public class BookController {
    
    // GET /api/books
    @GetMapping
    public List<Book> getAllBooks() {
        return Arrays.asList(
            new Book(1, "Java Guide", "Author 1"),
            new Book(2, "Spring Boot", "Author 2")
        );
    }
    
    // GET /api/books/{id}
    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return new Book(id, "Book " + id, "Author");
    }
    
    // POST /api/books
    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return book;
    }
    
    // PUT /api/books/{id}
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return book;
    }
    
    // DELETE /api/books/{id}
    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        // Delete logic
    }
}
```

2. Test với Postman hoặc curl

### **2.3 HTTP Methods**
1. Tạo controller với tất cả HTTP methods:
```java
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @GetMapping          // GET
    public List<Task> getAll() { return tasks; }
    
    @PostMapping         // POST
    public Task create(@RequestBody Task task) { return task; }
    
    @PutMapping("/{id}") // PUT
    public Task update(@PathVariable Long id, @RequestBody Task task) { return task; }
    
    @PatchMapping("/{id}") // PATCH
    public Task patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) { return task; }
    
    @DeleteMapping("/{id}") // DELETE
    public void delete(@PathVariable Long id) { }
}
```

---

## 🎯 **Exercise 3: Create Simple REST Controller** (1h)

**Mục tiêu:** Thực hành tạo REST controller đơn giản

**Yêu cầu:**

### **3.1 Todo Controller**
Tạo Todo Management API:

1. Tạo model:
```java
public class Todo {
    private Long id;
    private String title;
    private String description;
    private boolean completed;
    
    // Constructors, getters, setters
}
```

2. Tạo controller:
```java
@RestController
@RequestMapping("/api/todos")
public class TodoController {
    
    private List<Todo> todos = new ArrayList<>();
    private Long nextId = 1L;
    
    @GetMapping
    public List<Todo> getAllTodos() {
        return todos;
    }
    
    @GetMapping("/{id}")
    public Todo getTodo(@PathVariable Long id) {
        return todos.stream()
            .filter(t -> t.getId().equals(id))
            .findFirst()
            .orElse(null);
    }
    
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        todo.setId(nextId++);
        todos.add(todo);
        return todo;
    }
}
```

3. Test với Postman:
   - GET /api/todos
   - GET /api/todos/1
   - POST /api/todos

---

### **Buổi tối (4h): Request/Response Handling**

---

## 🎯 **Exercise 4: Request/Response Handling** (1.5h)

**Mục tiêu:** Sử dụng `@RequestBody`, `@ResponseBody`, `ResponseEntity`

**Yêu cầu:**

### **4.1 @RequestBody**
1. Tạo DTO classes:
```java
public class CreateUserRequest {
    private String username;
    private String email;
    private int age;
    // getters, setters
}

public class UserResponse {
    private Long id;
    private String username;
    private String email;
    // getters, setters
}
```

2. Controller với @RequestBody:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public UserResponse createUser(@RequestBody CreateUserRequest request) {
        // Process request
        UserResponse response = new UserResponse();
        response.setId(1L);
        response.setUsername(request.getUsername());
        response.setEmail(request.getEmail());
        return response;
    }
}
```

### **4.2 ResponseEntity**
1. Sử dụng ResponseEntity cho control tốt hơn:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        // Validation
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        UserResponse response = new UserResponse();
        response.setId(1L);
        response.setUsername(request.getUsername());
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .header("Location", "/api/users/1")
            .body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        UserResponse user = findUserById(id);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(user);
    }
}
```

### **4.3 @ResponseBody (explicit)**
1. Sử dụng @ResponseBody với @Controller:
```java
@Controller
@RequestMapping("/api/data")
public class DataController {
    
    @GetMapping("/json")
    @ResponseBody
    public Map<String, String> getJson() {
        Map<String, String> data = new HashMap<>();
        data.put("message", "Hello");
        return data;
    }
}
```

---

## 🎯 **Exercise 5: Path Variables & Query Parameters** (1h)

**Mục tiêu:** Sử dụng `@PathVariable`, `@RequestParam`

**Yêu cầu:**

### **5.1 @PathVariable**
1. Single path variable:
```java
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return findUserById(id);
}
```

2. Multiple path variables:
```java
@GetMapping("/users/{userId}/posts/{postId}")
public Post getPost(@PathVariable Long userId, 
                   @PathVariable Long postId) {
    return findPost(userId, postId);
}
```

3. Named path variables:
```java
@GetMapping("/users/{userId}/posts/{postId}")
public Post getPost(@PathVariable("userId") Long user,
                   @PathVariable("postId") Long post) {
    // ...
}
```

### **5.2 @RequestParam**
1. Single query parameter:
```java
@GetMapping("/users")
public List<User> getUsers(@RequestParam String name) {
    return findUsersByName(name);
}
// URL: /users?name=John
```

2. Multiple query parameters:
```java
@GetMapping("/users")
public List<User> getUsers(
    @RequestParam(required = false) String name,
    @RequestParam(required = false) Integer age,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    // Filter and paginate
    return filterUsers(name, age, page, size);
}
// URL: /users?name=John&age=25&page=0&size=10
```

3. Optional parameters:
```java
@GetMapping("/search")
public List<Product> search(
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) Double minPrice,
    @RequestParam(required = false) Double maxPrice) {
    // Search logic
}
```

### **5.3 @RequestParam với List**
```java
@GetMapping("/products")
public List<Product> getProducts(
    @RequestParam List<Long> ids) {
    // Get products by IDs
    return findProductsByIds(ids);
}
// URL: /products?ids=1&ids=2&ids=3
```

---

## 🎯 **Exercise 6: Build REST API with 5 Endpoints** (1.5h)

**Mục tiêu:** Xây dựng CRUD API hoàn chỉnh

**Yêu cầu:**

### **6.1 Product Management API**
Tạo Product Management API với 5 endpoints:

1. **GET /api/products** - Get all products
```java
@GetMapping
public ResponseEntity<List<Product>> getAllProducts(
    @RequestParam(required = false) String category,
    @RequestParam(required = false) Double minPrice,
    @RequestParam(required = false) Double maxPrice) {
    
    List<Product> products = productService.findAll(category, minPrice, maxPrice);
    return ResponseEntity.ok(products);
}
```

2. **GET /api/products/{id}** - Get product by ID
```java
@GetMapping("/{id}")
public ResponseEntity<Product> getProduct(@PathVariable Long id) {
    Product product = productService.findById(id);
    if (product == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(product);
}
```

3. **POST /api/products** - Create product
```java
@PostMapping
public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest request) {
    Product product = productService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED)
        .header("Location", "/api/products/" + product.getId())
        .body(product);
}
```

4. **PUT /api/products/{id}** - Update product
```java
@PutMapping("/{id}")
public ResponseEntity<Product> updateProduct(
    @PathVariable Long id,
    @RequestBody UpdateProductRequest request) {
    
    Product product = productService.update(id, request);
    if (product == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(product);
}
```

5. **DELETE /api/products/{id}** - Delete product
```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    boolean deleted = productService.delete(id);
    if (!deleted) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.noContent().build();
}
```

### **6.2 Test với Postman**
1. Tạo Postman collection:
   - GET all products
   - GET product by ID
   - POST create product
   - PUT update product
   - DELETE product

2. Test các scenarios:
   - Valid requests
   - Invalid requests (404, 400)
   - Edge cases

---

## 📝 **Checklist Day 6**

### Buổi sáng:
- [ ] Exercise 1.1: Hiểu Spring MVC Flow
- [ ] Exercise 1.2: DispatcherServlet
- [ ] Exercise 1.3: HandlerMapping
- [ ] Exercise 2.1: @RestController vs @Controller
- [ ] Exercise 2.2: @RequestMapping
- [ ] Exercise 2.3: HTTP Methods (GET, POST, PUT, DELETE)
- [ ] Exercise 3: Todo Controller

### Buổi tối:
- [ ] Exercise 4.1: @RequestBody
- [ ] Exercise 4.2: ResponseEntity
- [ ] Exercise 4.3: @ResponseBody
- [ ] Exercise 5.1: @PathVariable
- [ ] Exercise 5.2: @RequestParam
- [ ] Exercise 5.3: @RequestParam với List
- [ ] Exercise 6: Product Management API (5 endpoints)
- [ ] Test với Postman

---

## 💡 **Tips**

1. REST Controllers:
   - `@RestController` = `@Controller` + `@ResponseBody`
   - Dùng `@RequestMapping` cho base path
   - Dùng specific annotations: `@GetMapping`, `@PostMapping`, etc.

2. Request Handling:
   - `@RequestBody`: Convert JSON/XML → Java object
   - `@ResponseBody`: Convert Java object → JSON/XML
   - `ResponseEntity`: Control HTTP status, headers, body

3. Path Variables vs Query Parameters:
   - `@PathVariable`: Part of URL path (`/users/{id}`)
   - `@RequestParam`: Query string (`?name=John&age=25`)

4. HTTP Status Codes:
   - 200 OK: Success
   - 201 Created: Resource created
   - 204 No Content: Success, no body
   - 400 Bad Request: Invalid input
   - 404 Not Found: Resource not found
   - 500 Internal Server Error: Server error

5. Best Practices:
   - Dùng DTOs cho request/response
   - Validate input
   - Return proper HTTP status codes
   - Use ResponseEntity for fine control
   - Document APIs (sẽ học Swagger sau)

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 6, bạn nên:
- ✅ Hiểu Spring MVC architecture
- ✅ Tạo được REST controllers
- ✅ Sử dụng @RequestBody và @ResponseBody
- ✅ Sử dụng ResponseEntity để control response
- ✅ Sử dụng @PathVariable và @RequestParam
- ✅ Xây dựng được CRUD API với 5 endpoints
- ✅ Test API với Postman

---

## 🔗 **Resources**

- **Spring MVC**: https://docs.spring.io/spring-framework/reference/web/webmvc.html
- **REST Controllers**: https://spring.io/guides/gs/rest-service/
- **Postman**: https://www.postman.com/downloads/

Chúc bạn luyện tập tốt.