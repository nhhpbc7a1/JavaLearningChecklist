Kế hoạch luyện tập Day 7 - Exception Handling & Validation:

## 📅 Kế hoạch luyện tập Day 7

### **Buổi sáng (4h): Exception Handling & Validation**

---

## 🎯 **Exercise 1: Exception Handling** (1.5h)

**Mục tiêu:** Sử dụng `@ExceptionHandler`, `@ControllerAdvice` để xử lý exceptions

**Yêu cầu:**

### **1.1 Basic Exception Handling**
1. Tạo custom exception:
```java
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
```

2. Controller với exception handling:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        User user = findUserById(id);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        return user;
    }
    
    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new ValidationException("Email is required");
        }
        return saveUser(user);
    }
}
```

### **1.2 @ExceptionHandler (Controller-level)**
1. Xử lý exception trong controller:
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        Product product = findProductById(id);
        if (product == null) {
            throw new ResourceNotFoundException("Product not found");
        }
        return product;
    }
    
    // Handle exception trong cùng controller
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

2. Tạo ErrorResponse DTO:
```java
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructors, getters, setters
}
```

### **1.3 @ControllerAdvice (Global Exception Handler)**
1. Tạo global exception handler:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.toList());
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed: " + String.join(", ", errors),
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An error occurred: " + ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
```

2. Test với các scenarios:
   - Valid request
   - Invalid request (404, 400)
   - Server error (500)

---

## 🎯 **Exercise 2: Bean Validation** (1.5h)

**Mục tiêu:** Sử dụng Bean Validation (`@Valid`, `@NotNull`, `@Size`, etc.)

**Yêu cầu:**

### **2.1 Dependencies**
1. Thêm dependency vào `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### **2.2 Validation Annotations**
1. Tạo DTO với validation:
```java
public class CreateUserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age must be at least 18")
    @Max(value = 100, message = "Age must be at most 100")
    private Integer age;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;
    
    // getters, setters
}
```

2. Controller với `@Valid`:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        // Validation tự động được thực hiện
        UserResponse response = new UserResponse();
        response.setId(1L);
        response.setUsername(request.getUsername());
        response.setEmail(request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        // Update logic
        return ResponseEntity.ok(response);
    }
}
```

### **2.3 Custom Validation**
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
```

2. Validator implementation:
```java
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    
    @Autowired
    private UserService userService;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) {
            return true; // Let @NotNull handle null
        }
        return !userService.existsByEmail(email);
    }
}
```

3. Sử dụng custom validator:
```java
public class CreateUserRequest {
    @NotBlank
    @Email
    @UniqueEmail
    private String email;
    // ...
}
```

---

## 🎯 **Exercise 3: Advanced Exception Handling** (1h)

**Mục tiêu:** Xử lý các loại exception phổ biến

**Yêu cầu:**

### **3.1 HTTP Status Codes Mapping**
1. Tạo exception classes với HTTP status:
```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
```

2. Sử dụng trong controller:
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        if (productService.existsByName(product.getName())) {
            throw new ConflictException("Product name already exists");
        }
        return productService.save(product);
    }
}
```

### **3.2 Detailed Error Response**
1. Tạo detailed error response:
```java
public class DetailedErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private List<FieldError> fieldErrors;
    
    public static class FieldError {
        private String field;
        private String message;
        private Object rejectedValue;
        // getters, setters
    }
    // getters, setters
}
```

2. Update GlobalExceptionHandler:
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DetailedErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        List<DetailedErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> {
                DetailedErrorResponse.FieldError fe = new DetailedErrorResponse.FieldError();
                fe.setField(error.getField());
                fe.setMessage(error.getDefaultMessage());
                fe.setRejectedValue(error.getRejectedValue());
                return fe;
            })
            .collect(Collectors.toList());
        
        DetailedErrorResponse error = new DetailedErrorResponse();
        error.setStatus(HttpStatus.BAD_REQUEST.value());
        error.setMessage("Validation failed");
        error.setTimestamp(LocalDateTime.now());
        error.setPath(request.getRequestURI());
        error.setFieldErrors(fieldErrors);
        
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

### **Buổi tối (4h): Advanced Request/Response Features**

---

## 🎯 **Exercise 4: Interceptors & Filters** (1.5h)

**Mục tiêu:** Sử dụng `HandlerInterceptor` và `Filter`

**Yêu cầu:**

### **4.1 HandlerInterceptor**
1. Tạo interceptor:
```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {
    
    private static final Logger logger = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {
        logger.info("Request: {} {}", request.getMethod(), request.getRequestURI());
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        return true;
    }
    
    @Override
    public void postHandle(HttpServletRequest request, 
                         HttpServletResponse response, 
                         Object handler, 
                         ModelAndView modelAndView) throws Exception {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long executeTime = endTime - startTime;
        logger.info("Response: {} {} - {}ms", 
                   request.getMethod(), 
                   request.getRequestURI(), 
                   executeTime);
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, 
                               HttpServletResponse response, 
                               Object handler, 
                               Exception ex) throws Exception {
        if (ex != null) {
            logger.error("Exception occurred: {}", ex.getMessage());
        }
    }
}
```

2. Đăng ký interceptor:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Autowired
    private LoggingInterceptor loggingInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loggingInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/health");
    }
}
```

### **4.2 Filter**
1. Tạo filter:
```java
@Component
@Order(1)
public class RequestLoggingFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, 
                        ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        logger.info("Filter: {} {}", httpRequest.getMethod(), httpRequest.getRequestURI());
        
        // Add custom header
        httpResponse.setHeader("X-Custom-Header", "Filter-Processed");
        
        chain.doFilter(request, response);
    }
}
```

### **4.3 Authentication Interceptor**
1. Tạo authentication interceptor:
```java
@Component
public class AuthenticationInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, 
                           HttpServletResponse response, 
                           Object handler) throws Exception {
        String authToken = request.getHeader("Authorization");
        
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Unauthorized\"}");
            return false;
        }
        
        // Validate token (simplified)
        String token = authToken.substring(7);
        if (!isValidToken(token)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("{\"error\": \"Invalid token\"}");
            return false;
        }
        
        return true;
    }
    
    private boolean isValidToken(String token) {
        // Token validation logic
        return token != null && !token.isEmpty();
    }
}
```

---

## 🎯 **Exercise 5: CORS Configuration** (1h)

**Mục tiêu:** Cấu hình CORS cho REST API

**Yêu cầu:**

### **5.1 Global CORS Configuration**
1. Cấu hình CORS:
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### **5.2 Method-level CORS**
1. Sử dụng `@CrossOrigin`:
```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @GetMapping
    @CrossOrigin(origins = "http://localhost:4200")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
```

### **5.3 CORS Filter**
1. Tạo CORS filter:
```java
@Component
public class CorsFilter implements Filter {
    
    @Override
    public void doFilter(ServletRequest request, 
                        ServletResponse response, 
                        FilterChain chain) throws IOException, ServletException {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", 
                              "GET, POST, PUT, DELETE, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", 
                              "Content-Type, Authorization");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");
        
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpStatus.OK.value());
            return;
        }
        
        chain.doFilter(request, response);
    }
}
```

---

## 🎯 **Exercise 6: Content Negotiation & File Upload** (1.5h)

**Mục tiêu:** Xử lý content negotiation và file upload

**Yêu cầu:**

### **6.1 Content Negotiation**
1. Cấu hình content negotiation:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(true)
            .parameterName("format")
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
            .mediaType("json", MediaType.APPLICATION_JSON)
            .mediaType("xml", MediaType.APPLICATION_XML);
    }
}
```

2. Controller với multiple content types:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping(value = "/{id}", produces = {
        MediaType.APPLICATION_JSON_VALUE,
        MediaType.APPLICATION_XML_VALUE
    })
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }
}
```

### **6.2 File Upload**
1. Cấu hình file upload:
```properties
# application.properties
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

2. Controller với file upload:
```java
@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new FileUploadResponse("File is empty"));
        }
        
        try {
            String fileName = file.getOriginalFilename();
            String filePath = "uploads/" + fileName;
            
            // Save file
            File destFile = new File(filePath);
            file.transferTo(destFile);
            
            FileUploadResponse response = new FileUploadResponse(
                "File uploaded successfully",
                fileName,
                file.getSize()
            );
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new FileUploadResponse("Failed to upload file: " + e.getMessage()));
        }
    }
    
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get("uploads/" + fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + fileName + "\"")
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

3. Multiple files upload:
```java
@PostMapping("/upload-multiple")
public ResponseEntity<List<FileUploadResponse>> uploadMultipleFiles(
        @RequestParam("files") MultipartFile[] files) {
    
    List<FileUploadResponse> responses = new ArrayList<>();
    
    for (MultipartFile file : files) {
        if (!file.isEmpty()) {
            try {
                String fileName = file.getOriginalFilename();
                String filePath = "uploads/" + fileName;
                file.transferTo(new File(filePath));
                
                responses.add(new FileUploadResponse(
                    "Uploaded: " + fileName,
                    fileName,
                    file.getSize()
                ));
            } catch (IOException e) {
                responses.add(new FileUploadResponse(
                    "Failed: " + file.getOriginalFilename() + " - " + e.getMessage()
                ));
            }
        }
    }
    
    return ResponseEntity.ok(responses);
}
```

---

## 📝 **Checklist Day 7**

### Buổi sáng:
- [ ] Exercise 1.1: Basic Exception Handling
- [ ] Exercise 1.2: @ExceptionHandler (Controller-level)
- [ ] Exercise 1.3: @ControllerAdvice (Global Exception Handler)
- [ ] Exercise 2.1: Dependencies & Validation Annotations
- [ ] Exercise 2.2: @Valid trong Controller
- [ ] Exercise 2.3: Custom Validation
- [ ] Exercise 3.1: HTTP Status Codes Mapping
- [ ] Exercise 3.2: Detailed Error Response

### Buổi tối:
- [ ] Exercise 4.1: HandlerInterceptor
- [ ] Exercise 4.2: Filter
- [ ] Exercise 4.3: Authentication Interceptor
- [ ] Exercise 5.1: Global CORS Configuration
- [ ] Exercise 5.2: Method-level CORS
- [ ] Exercise 5.3: CORS Filter
- [ ] Exercise 6.1: Content Negotiation
- [ ] Exercise 6.2: File Upload & Download

---

## 💡 **Tips**

1. Exception Handling:
   - `@ExceptionHandler`: Xử lý exception trong controller
   - `@ControllerAdvice`: Xử lý exception global
   - `@ResponseStatus`: Map exception → HTTP status code
   - Luôn return ResponseEntity với proper status code

2. Validation:
   - Dùng `@Valid` để trigger validation
   - Bean Validation annotations: `@NotNull`, `@NotBlank`, `@Size`, `@Email`, etc.
   - Custom validators cho business logic validation
   - Validation errors tự động được xử lý bởi `MethodArgumentNotValidException`

3. Interceptors vs Filters:
   - **Filter**: Servlet level, chạy trước DispatcherServlet
   - **Interceptor**: Spring MVC level, chạy sau DispatcherServlet
   - Dùng Filter cho: CORS, logging, authentication
   - Dùng Interceptor cho: request/response logging, performance monitoring

4. CORS:
   - Cấu hình global với `WebMvcConfigurer`
   - Method-level với `@CrossOrigin`
   - Production: chỉ allow specific origins, không dùng `*`

5. File Upload:
   - Cấu hình `multipart` trong `application.properties`
   - Validate file size và type
   - Lưu file ở secure location
   - Return proper error messages

6. Best Practices:
   - Centralized exception handling với `@ControllerAdvice`
   - Detailed error responses cho debugging
   - Validate tất cả user input
   - Log exceptions properly
   - Use appropriate HTTP status codes

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 7, bạn nên:
- ✅ Xử lý exceptions với @ExceptionHandler và @ControllerAdvice
- ✅ Validate request data với Bean Validation
- ✅ Tạo custom validators
- ✅ Sử dụng Interceptors và Filters
- ✅ Cấu hình CORS cho REST API
- ✅ Xử lý file upload và download
- ✅ Cấu hình content negotiation

---

## 🔗 **Resources**

- **Exception Handling**: https://www.baeldung.com/exception-handling-for-rest-with-spring
- **Bean Validation**: https://www.baeldung.com/javax-validation
- **Spring Interceptors**: https://www.baeldung.com/spring-mvc-handlerinterceptor
- **CORS**: https://www.baeldung.com/spring-cors
- **File Upload**: https://www.baeldung.com/spring-file-upload

Chúc bạn luyện tập tốt.

