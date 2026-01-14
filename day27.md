## 📅 Kế hoạch luyện tập Day 27

### **Buổi sáng (4h): Inter-Service Communication & Circuit Breaker**

---

## 🎯 **Exercise 1: Inter-Service Communication** (2h)

**Mục tiêu:** RestTemplate, WebClient, Feign

**Yêu cầu:**

### **1.1 RestTemplate**
1. RestTemplate configuration:
```java
@Configuration
public class RestTemplateConfig {
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

2. Use RestTemplate:
```java
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    public ProductResponse getProduct(Long productId) {
        String url = "http://product-service/api/products/" + productId;
        ResponseEntity<ProductResponse> response = restTemplate.getForEntity(
            url, ProductResponse.class);
        return response.getBody();
    }
    
    public UserResponse getUser(Long userId) {
        String url = "http://user-service/api/users/" + userId;
        return restTemplate.getForObject(url, UserResponse.class);
    }
}
```

### **1.2 WebClient**
1. WebClient configuration:
```java
@Configuration
public class WebClientConfig {
    
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
```

2. Use WebClient:
```java
@Service
public class OrderService {
    
    @Autowired
    private WebClient.Builder webClientBuilder;
    
    public Mono<ProductResponse> getProduct(Long productId) {
        return webClientBuilder.build()
                .get()
                .uri("http://product-service/api/products/{id}", productId)
                .retrieve()
                .bodyToMono(ProductResponse.class);
    }
    
    public Mono<UserResponse> getUser(Long userId) {
        return webClientBuilder.build()
                .get()
                .uri("http://user-service/api/users/{id}", userId)
                .retrieve()
                .bodyToMono(UserResponse.class);
    }
}
```

### **1.3 Feign Client**
1. Enable Feign:
```java
@SpringBootApplication
@EnableFeignClients
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

2. Create Feign clients:
```java
@FeignClient(name = "product-service")
public interface ProductServiceClient {
    
    @GetMapping("/api/products/{id}")
    ProductResponse getProduct(@PathVariable Long id);
    
    @GetMapping("/api/products")
    List<ProductResponse> getProducts(@RequestParam List<Long> ids);
}

@FeignClient(name = "user-service")
public interface UserServiceClient {
    
    @GetMapping("/api/users/{id}")
    UserResponse getUser(@PathVariable Long id);
    
    @PostMapping("/api/users")
    UserResponse createUser(@RequestBody CreateUserRequest request);
}
```

3. Use Feign clients:
```java
@Service
public class OrderService {
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Get user
        UserResponse user = userServiceClient.getUser(request.getUserId());
        
        // Get products
        List<Long> productIds = request.getItems().stream()
                .map(OrderItemDTO::getProductId)
                .collect(Collectors.toList());
        List<ProductResponse> products = productServiceClient.getProducts(productIds);
        
        // Create order
        // ...
    }
}
```

---

## 🎯 **Exercise 2: Circuit Breaker Pattern** (2h)

**Mục tiêu:** Resilience4j, fault tolerance

**Yêu cầu:**

### **2.1 Resilience4j Setup**
1. Add dependencies:
```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

2. Configuration:
```yaml
resilience4j:
  circuitbreaker:
    instances:
      productService:
        registerHealthIndicator: true
        slidingWindowSize: 10
        minimumNumberOfCalls: 5
        permittedNumberOfCallsInHalfOpenState: 3
        automaticTransitionFromOpenToHalfOpenEnabled: true
        waitDurationInOpenState: 5s
        failureRateThreshold: 50
        eventConsumerBufferSize: 10
```

### **2.2 Circuit Breaker with Feign**
1. Configure Feign with Circuit Breaker:
```java
@FeignClient(name = "product-service", fallback = ProductServiceFallback.class)
public interface ProductServiceClient {
    @GetMapping("/api/products/{id}")
    ProductResponse getProduct(@PathVariable Long id);
}

@Component
public class ProductServiceFallback implements ProductServiceClient {
    @Override
    public ProductResponse getProduct(Long id) {
        // Fallback response
        return ProductResponse.builder()
                .id(id)
                .name("Product unavailable")
                .build();
    }
}
```

2. Enable circuit breaker:
```yaml
feign:
  circuitbreaker:
    enabled: true
```

### **2.3 Circuit Breaker with @CircuitBreaker**
1. Use @CircuitBreaker annotation:
```java
@Service
public class OrderService {
    
    @Autowired
    private RestTemplate restTemplate;
    
    @CircuitBreaker(name = "productService", fallbackMethod = "getProductFallback")
    public ProductResponse getProduct(Long productId) {
        String url = "http://product-service/api/products/" + productId;
        return restTemplate.getForObject(url, ProductResponse.class);
    }
    
    public ProductResponse getProductFallback(Long productId, Exception e) {
        return ProductResponse.builder()
                .id(productId)
                .name("Product unavailable")
                .build();
    }
}
```

### **2.4 Retry Pattern**
1. Retry configuration:
```yaml
resilience4j:
  retry:
    instances:
      productService:
        maxAttempts: 3
        waitDuration: 1s
```

2. Use @Retry:
```java
@Service
public class OrderService {
    
    @Retry(name = "productService")
    public ProductResponse getProduct(Long productId) {
        String url = "http://product-service/api/products/" + productId;
        return restTemplate.getForObject(url, ProductResponse.class);
    }
}
```

### **2.5 Bulkhead Pattern**
1. Bulkhead configuration:
```yaml
resilience4j:
  bulkhead:
    instances:
      productService:
        maxConcurrentCalls: 10
        maxWaitDuration: 1s
```

2. Use @Bulkhead:
```java
@Service
public class OrderService {
    
    @Bulkhead(name = "productService")
    public ProductResponse getProduct(Long productId) {
        // Service call
    }
}
```

---

### **Buổi tối (4h): Project 2 - Service Communication & Payment Service**

---

## 🎯 **Exercise 3: Project 2 - Service Communication** (2h)

**Mục tiêu:** Services call each other

**Yêu cầu:**

1. Order Service calls Product Service:
```java
@Service
public class OrderService {
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Validate products
        for (OrderItemDTO item : request.getItems()) {
            ProductResponse product = productServiceClient.getProduct(item.getProductId());
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }
        }
        
        // Create order
        // ...
    }
}
```

2. Order Service calls User Service:
```java
@Service
public class OrderService {
    
    @Autowired
    private UserServiceClient userServiceClient;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Validate user
        UserResponse user = userServiceClient.getUser(request.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Create order
        // ...
    }
}
```

3. Add circuit breakers to all service calls

---

## 🎯 **Exercise 4: Project 2 - Payment Service** (2h)

**Mục tiêu:** Payment processing

**Yêu cầu:**

### **4.1 Payment Entity**
1. Create Payment Entity:
```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long orderId;
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    private String paymentMethod;
    private String transactionId;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

### **4.2 Payment Service**
1. Implement Payment Service:
```java
@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PROCESSING);
        
        payment = paymentRepository.save(payment);
        
        try {
            // Simulate payment processing
            Thread.sleep(1000);
            
            // Payment gateway integration would go here
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId(UUID.randomUUID().toString());
            payment = paymentRepository.save(payment);
            
            // Publish event
            PaymentProcessedEvent event = new PaymentProcessedEvent();
            event.setPaymentId(payment.getId());
            event.setOrderId(payment.getOrderId());
            event.setAmount(payment.getAmount());
            event.setStatus("COMPLETED");
            eventPublisher.publishPaymentProcessed(event);
            
            return toResponse(payment);
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            payment = paymentRepository.save(payment);
            
            PaymentFailedEvent event = new PaymentFailedEvent();
            event.setPaymentId(payment.getId());
            event.setOrderId(payment.getOrderId());
            event.setReason(e.getMessage());
            eventPublisher.publishPaymentFailed(event);
            
            throw new PaymentProcessingException("Payment failed", e);
        }
    }
    
    public PaymentResponse getPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return toResponse(payment);
    }
    
    public List<PaymentResponse> getOrderPayments(Long orderId) {
        return paymentRepository.findByOrderId(orderId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
```

### **4.3 Payment Controller**
1. Create Payment Controller:
```java
@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping
    public ResponseEntity<PaymentResponse> processPayment(
            @RequestBody @Valid ProcessPaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {
        PaymentResponse response = paymentService.getPayment(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<PaymentResponse>> getOrderPayments(
            @PathVariable Long orderId) {
        List<PaymentResponse> payments = paymentService.getOrderPayments(orderId);
        return ResponseEntity.ok(payments);
    }
}
```

---

## 📝 **Checklist Day 27**

### Buổi sáng:
- [ ] Exercise 1.1: RestTemplate
- [ ] Exercise 1.2: WebClient
- [ ] Exercise 1.3: Feign Client
- [ ] Exercise 2.1: Resilience4j Setup
- [ ] Exercise 2.2: Circuit Breaker with Feign
- [ ] Exercise 2.3: @CircuitBreaker Annotation
- [ ] Exercise 2.4: Retry Pattern
- [ ] Exercise 2.5: Bulkhead Pattern

### Buổi tối:
- [ ] Exercise 3: Project 2 - Service Communication
- [ ] Exercise 4.1: Payment Entity
- [ ] Exercise 4.2: Payment Service
- [ ] Exercise 4.3: Payment Controller
- [ ] Test: Service communication
- [ ] Test: Circuit breaker behavior

---

## 💡 **Tips**

1. Service Communication:
   - ✅ Use Feign for simplicity
   - ✅ Implement circuit breakers
   - ✅ Add retry logic
   - ✅ Handle timeouts

2. Circuit Breaker:
   - ✅ Configure appropriate thresholds
   - ✅ Implement fallback methods
   - ✅ Monitor circuit breaker state
   - ✅ Test failure scenarios

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 27, bạn nên:
- ✅ Sử dụng RestTemplate, WebClient, Feign
- ✅ Implement circuit breaker pattern
- ✅ Implement retry và bulkhead
- ✅ Services communicate with each other
- ✅ Implement Payment Service

---

## 🔗 **Resources**

- **Spring Cloud OpenFeign**: https://spring.io/projects/spring-cloud-openfeign
- **Resilience4j**: https://resilience4j.readme.io/

Chúc bạn luyện tập tốt! 🚀
