Đang kiểm tra nội dung Day 5 để lập kế hoạch luyện tập:


[2 tools called]

Kế hoạch luyện tập Day 5 - Dependency Injection, IoC & Spring Boot Configuration:

## 📅 Kế hoạch luyện tập Day 5

### **Buổi sáng (4h): Dependency Injection & IoC**

---

## 🎯 **Exercise 1: Dependency Injection Basics** (1.5h)

**Mục tiêu:** Hiểu `@Autowired`, `@Component`, `@Service`, `@Repository`

**Yêu cầu:**

### **1.1 Component Scanning**
1. Tạo các classes với annotations:
```java
@Component
public class EmailService {
    public void sendEmail(String to, String message) {
        System.out.println("Sending email to " + to + ": " + message);
    }
}

@Service
public class UserService {
    private final EmailService emailService;
    
    // Constructor injection (recommended)
    public UserService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    public void registerUser(String username, String email) {
        System.out.println("Registering user: " + username);
        emailService.sendEmail(email, "Welcome!");
    }
}

@Repository
public class UserRepository {
    public void save(String username) {
        System.out.println("Saving user: " + username);
    }
}
```

2. Tạo Controller để test:
```java
@RestController
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/register/{username}")
    public String register(@PathVariable String username) {
        userService.registerUser(username, username + "@example.com");
        return "User registered!";
    }
}
```

### **1.2 Field Injection vs Constructor Injection**
1. So sánh 3 cách inject:
```java
// 1. Field Injection (not recommended)
@Autowired
private EmailService emailService;

// 2. Setter Injection
private EmailService emailService;
@Autowired
public void setEmailService(EmailService emailService) {
    this.emailService = emailService;
}

// 3. Constructor Injection (recommended)
private final EmailService emailService;
public UserService(EmailService emailService) {
    this.emailService = emailService;
}
```

2. Tạo example cho mỗi cách
3. So sánh ưu/nhược điểm

### **1.3 @Qualifier & Multiple Implementations**
1. Tạo interface `NotificationService`:
```java
public interface NotificationService {
    void send(String message);
}
```

2. Tạo 2 implementations:
```java
@Component("emailNotification")
public class EmailNotificationService implements NotificationService {
    @Override
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

@Component("smsNotification")
public class SmsNotificationService implements NotificationService {
    @Override
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}
```

3. Sử dụng `@Qualifier`:
```java
@Service
public class NotificationManager {
    
    @Autowired
    @Qualifier("emailNotification")
    private NotificationService emailService;
    
    @Autowired
    @Qualifier("smsNotification")
    private NotificationService smsService;
    
    public void sendNotifications(String message) {
        emailService.send(message);
        smsService.send(message);
    }
}
```

---

## 🎯 **Exercise 2: Inversion of Control (IoC)** (1.5h)

**Mục tiêu:** Hiểu IoC container, bean lifecycle

**Yêu cầu:**

### **2.1 Bean Lifecycle**
1. Tạo class với lifecycle callbacks:
```java
@Component
public class LifecycleDemo implements InitializingBean, DisposableBean {
    
    public LifecycleDemo() {
        System.out.println("1. Constructor called");
    }
    
    @PostConstruct
    public void init() {
        System.out.println("2. @PostConstruct called");
    }
    
    @Override
    public void afterPropertiesSet() {
        System.out.println("3. afterPropertiesSet() called");
    }
    
    @PreDestroy
    public void cleanup() {
        System.out.println("4. @PreDestroy called");
    }
    
    @Override
    public void destroy() {
        System.out.println("5. destroy() called");
    }
}
```

2. Quan sát thứ tự execution khi start/stop application

### **2.2 Bean Scopes**
1. Test các scopes:
```java
@Component
@Scope("singleton")  // Default
public class SingletonBean {
    private int count = 0;
    
    public int increment() {
        return ++count;
    }
}

@Component
@Scope("prototype")
public class PrototypeBean {
    private int count = 0;
    
    public int increment() {
        return ++count;
    }
}
```

2. Tạo Controller để test:
```java
@RestController
public class ScopeTestController {
    
    @Autowired
    private SingletonBean singleton1;
    
    @Autowired
    private SingletonBean singleton2;
    
    @Autowired
    private PrototypeBean prototype1;
    
    @Autowired
    private PrototypeBean prototype2;
    
    @GetMapping("/test-scopes")
    public String testScopes() {
        return "Singleton same instance: " + (singleton1 == singleton2) + "\n" +
               "Prototype same instance: " + (prototype1 == prototype2);
    }
}
```

### **2.3 @Configuration & @Bean**
1. Tạo Configuration class:
```java
@Configuration
public class AppConfig {
    
    @Bean
    public DataSource dataSource() {
        // Simulate data source
        return new SimpleDataSource();
    }
    
    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
}
```

2. Sử dụng trong Service:
```java
@Service
public class DatabaseService {
    
    private final JdbcTemplate jdbcTemplate;
    
    public DatabaseService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
```

---

## 🎯 **Exercise 3: Build DI Example** (1h)

**Mục tiêu:** Áp dụng DI vào project thực tế

**Yêu cầu:**

### **3.1 Order Management System**
Tạo hệ thống quản lý đơn hàng với DI:

1. **Repository Layer:**
```java
@Repository
public class OrderRepository {
    private List<Order> orders = new ArrayList<>();
    
    public void save(Order order) {
        orders.add(order);
    }
    
    public List<Order> findAll() {
        return orders;
    }
}

@Repository
public class ProductRepository {
    private Map<Long, Product> products = new HashMap<>();
    
    public Product findById(Long id) {
        return products.get(id);
    }
    
    public void save(Product product) {
        products.put(product.getId(), product);
    }
}
```

2. **Service Layer:**
```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    
    public OrderService(OrderRepository orderRepository,
                       ProductRepository productRepository,
                       NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.notificationService = notificationService;
    }
    
    public Order createOrder(Long productId, int quantity) {
        Product product = productRepository.findById(productId);
        Order order = new Order(product, quantity);
        orderRepository.save(order);
        notificationService.send("Order created: " + order.getId());
        return order;
    }
}
```

3. **Controller Layer:**
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    public Order createOrder(@RequestParam Long productId,
                            @RequestParam int quantity) {
        return orderService.createOrder(productId, quantity);
    }
    
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
```

4. Test với Postman hoặc browser

---

### **Buổi tối (4h): Spring Boot Configuration**

---

## 🎯 **Exercise 4: Spring Boot Starters** (1h)

**Mục tiêu:** Hiểu và sử dụng Spring Boot Starters

**Yêu cầu:**

### **4.1 Explore Dependencies**
1. Mở `pom.xml` và xem các starters:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

2. Tìm hiểu các starters phổ biến:
   - `spring-boot-starter-web` - Web applications
   - `spring-boot-starter-data-jpa` - JPA/Hibernate
   - `spring-boot-starter-test` - Testing
   - `spring-boot-starter-validation` - Validation
   - `spring-boot-starter-security` - Security

3. Thêm starter mới vào project:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### **4.2 Auto-Configuration**
1. Tạo simple example để thấy auto-configuration:
```java
@RestController
public class ConfigTestController {
    
    @Autowired
    private Environment environment;
    
    @GetMapping("/config")
    public Map<String, String> getConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("app.name", environment.getProperty("spring.application.name"));
        config.put("server.port", environment.getProperty("server.port"));
        return config;
    }
}
```

2. Kiểm tra auto-configured beans:
   - `DispatcherServlet`
   - `Jackson` (JSON converter)
   - `Embedded Tomcat`

---

## 🎯 **Exercise 5: Application Properties** (1.5h)

**Mục tiêu:** Cấu hình application với properties và yml

**Yêu cầu:**

### **5.1 application.properties**
1. Tạo `application.properties`:
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Application Info
spring.application.name=my-spring-app
app.version=1.0.0
app.description=My First Spring Boot Application

# Custom Properties
app.admin.email=admin@example.com
app.max.users=100
app.features.enabled=true
```

2. Sử dụng trong code:
```java
@RestController
public class AppInfoController {
    
    @Value("${spring.application.name}")
    private String appName;
    
    @Value("${app.version}")
    private String version;
    
    @Value("${app.max.users}")
    private int maxUsers;
    
    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", appName);
        info.put("version", version);
        info.put("maxUsers", maxUsers);
        return info;
    }
}
```

### **5.2 application.yml**
1. Convert sang `application.yml`:
```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: my-spring-app

app:
  version: 1.0.0
  description: My First Spring Boot Application
  admin:
    email: admin@example.com
  max:
    users: 100
  features:
    enabled: true
```

2. So sánh properties vs yml

### **5.3 @ConfigurationProperties**
1. Tạo configuration class:
```java
@ConfigurationProperties(prefix = "app")
@Component
public class AppProperties {
    private String version;
    private String description;
    private Admin admin = new Admin();
    private Max max = new Max();
    private Features features = new Features();
    
    // Getters and Setters
    public static class Admin {
        private String email;
        // getter, setter
    }
    
    public static class Max {
        private int users;
        // getter, setter
    }
    
    public static class Features {
        private boolean enabled;
        // getter, setter
    }
}
```

2. Sử dụng:
```java
@RestController
public class ConfigController {
    
    @Autowired
    private AppProperties appProperties;
    
    @GetMapping("/config-props")
    public AppProperties getConfig() {
        return appProperties;
    }
}
```

---

## 🎯 **Exercise 6: Profiles & Environment Configuration** (1.5h)

**Mục tiêu:** Sử dụng profiles cho dev/staging/prod

**Yêu cầu:**

### **6.1 Create Profiles**
1. Tạo các profile files:
```properties
# application-dev.properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:devdb
logging.level.com.learning=DEBUG

# application-prod.properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/proddb
logging.level.com.learning=INFO
```

2. Hoặc với yml:
```yaml
# application-dev.yml
spring:
  profiles: dev
  datasource:
    url: jdbc:h2:mem:devdb
logging:
  level:
    com.learning: DEBUG

---
# application-prod.yml
spring:
  profiles: prod
  datasource:
    url: jdbc:postgresql://localhost:5432/proddb
logging:
  level:
    com.learning: INFO
```

### **6.2 Activate Profiles**
1. Cách 1: Trong `application.properties`:
```properties
spring.profiles.active=dev
```

2. Cách 2: Command line:
```bash
java -jar app.jar --spring.profiles.active=prod
```

3. Cách 3: Environment variable:
```bash
export SPRING_PROFILES_ACTIVE=prod
```

### **6.3 Profile-specific Beans**
1. Tạo beans cho từng profile:
```java
@Configuration
@Profile("dev")
public class DevConfig {
    
    @Bean
    public DataSource devDataSource() {
        return new H2DataSource();
    }
}

@Configuration
@Profile("prod")
public class ProdConfig {
    
    @Bean
    public DataSource prodDataSource() {
        return new PostgreSQLDataSource();
    }
}
```

2. Test với different profiles

---

## 📝 **Checklist Day 5**

### Buổi sáng:
- [ ] Exercise 1.1: Component Scanning (@Component, @Service, @Repository)
- [ ] Exercise 1.2: Field vs Constructor Injection
- [ ] Exercise 1.3: @Qualifier với multiple implementations
- [ ] Exercise 2.1: Bean Lifecycle callbacks
- [ ] Exercise 2.2: Bean Scopes (singleton, prototype)
- [ ] Exercise 2.3: @Configuration & @Bean
- [ ] Exercise 3: Order Management System với DI

### Buổi tối:
- [ ] Exercise 4.1: Explore Spring Boot Starters
- [ ] Exercise 4.2: Auto-Configuration
- [ ] Exercise 5.1: application.properties
- [ ] Exercise 5.2: application.yml
- [ ] Exercise 5.3: @ConfigurationProperties
- [ ] Exercise 6.1: Create Profiles
- [ ] Exercise 6.2: Activate Profiles
- [ ] Exercise 6.3: Profile-specific Beans

---

## 💡 **Tips**

1. Dependency Injection:
   - Prefer Constructor Injection (immutable, testable)
   - Avoid Field Injection (hard to test)
   - Use `@Qualifier` khi có multiple implementations

2. IoC Container:
   - Spring quản lý bean lifecycle
   - Singleton là default scope
   - Prototype tạo instance mới mỗi lần request

3. Configuration:
   - `application.properties` vs `application.yml` - chọn 1
   - YAML dễ đọc cho nested config
   - Properties đơn giản hơn

4. Profiles:
   - Dùng profiles cho environment-specific config
   - Dev: debug logging, H2 database
   - Prod: info logging, PostgreSQL

5. Best Practices:
   - Group related properties với `@ConfigurationProperties`
   - Validate properties với `@Validated`
   - Document properties với comments

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 5, bạn nên:
- ✅ Hiểu Dependency Injection và cách sử dụng
- ✅ Hiểu Inversion of Control và bean lifecycle
- ✅ Biết khi nào dùng @Component, @Service, @Repository
- ✅ Hiểu Spring Boot Starters và auto-configuration
- ✅ Cấu hình application với properties/yml
- ✅ Sử dụng profiles cho different environments
- ✅ Tạo được project với proper DI structure

---

## 🔗 **Resources**

- **Spring DI**: https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
- **Spring Boot Configuration**: https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config
- **Spring Profiles**: https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles

Chúc bạn luyện tập tốt.