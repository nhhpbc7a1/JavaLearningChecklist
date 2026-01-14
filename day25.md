## 📅 Kế hoạch luyện tập Day 25

### **Buổi sáng (4h): Test Containers & Test Coverage**

---

## 🎯 **Exercise 1: Test Containers** (2h)

**Mục tiêu:** Integration tests với real databases

**Yêu cầu:**

### **1.1 Test Containers Setup**
1. Add dependencies:
```xml
<dependencies>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

2. PostgreSQL Test Container:
```java
@SpringBootTest
@Testcontainers
class ProductRepositoryTestContainersTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    
    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void testSaveAndFind() {
        Product product = new Product();
        product.setName("Laptop");
        product.setPrice(new BigDecimal("999.99"));
        
        Product saved = productRepository.save(product);
        
        Optional<Product> found = productRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Laptop", found.get().getName());
    }
}
```

3. Redis Test Container:
```java
@Testcontainers
class RedisCacheTest {
    
    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7")
            .withExposedPorts(6379);
    
    @Test
    void testRedisConnection() {
        String host = redis.getHost();
        Integer port = redis.getFirstMappedPort();
        
        RedisTemplate<String, String> template = new RedisTemplate<>();
        // Configure and test
    }
}
```

4. Kafka Test Container:
```java
@Testcontainers
class KafkaIntegrationTest {
    
    @Container
    static KafkaContainer kafka = new KafkaContainer(
        DockerImageName.parse("confluentinc/cp-kafka:latest"));
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Test
    void testKafkaPublish() {
        kafkaTemplate.send("test-topic", "test message");
        // Verify
    }
}
```

### **1.2 Shared Containers**
1. Reuse containers:
```java
public abstract class AbstractIntegrationTest {
    
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withReuse(true); // Reuse container
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}

@SpringBootTest
class ProductServiceTest extends AbstractIntegrationTest {
    // Tests here
}
```

---

## 🎯 **Exercise 2: Test Coverage** (1h)

**Mục tiêu:** JaCoCo, aim for >80% coverage

**Yêu cầu:**

### **2.1 JaCoCo Setup**
1. Add plugin:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.8</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

2. Generate report:
```bash
mvn clean test jacoco:report
# Report in target/site/jacoco/index.html
```

### **2.2 Coverage Analysis**
1. Check coverage:
```bash
mvn jacoco:check
```

2. Exclude classes:
```xml
<configuration>
    <excludes>
        <exclude>**/config/**</exclude>
        <exclude>**/dto/**</exclude>
        <exclude>**/entity/**</exclude>
    </excludes>
</configuration>
```

---

## 🎯 **Exercise 3: Practice - Improve Test Coverage** (1h)

**Mục tiêu:** Add missing tests

**Yêu cầu:**

1. Run coverage report
2. Identify uncovered code
3. Write tests for uncovered methods
4. Aim for >80% coverage

---

### **Buổi tối (4h): Project 2 - Order Service & Payment Integration**

---

## 🎯 **Exercise 4: Project 2 - Order Service** (2h)

**Mục tiêu:** Order creation, processing

**Yêu cầu:**

### **4.1 Order Entity**
1. Create Order Entity:
```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
    
    private String shippingAddress;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    private Long productId;
    private Integer quantity;
    private BigDecimal price;
}
```

### **4.2 Order Service**
1. Implement Order Service:
```java
@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Validate products
        validateProducts(request.getItems());
        
        // Calculate total
        BigDecimal totalAmount = calculateTotal(request.getItems());
        
        // Create order
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalAmount(totalAmount);
        order.setStatus(OrderStatus.PENDING);
        order.setShippingAddress(request.getShippingAddress());
        
        // Create order items
        List<OrderItem> items = request.getItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setProductId(item.getProductId());
                    orderItem.setQuantity(item.getQuantity());
                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow();
                    orderItem.setPrice(product.getPrice());
                    orderItem.setOrder(order);
                    return orderItem;
                })
                .collect(Collectors.toList());
        
        order.setItems(items);
        order = orderRepository.save(order);
        
        // Publish event
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        event.setItems(order.getItems().stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));
        eventPublisher.publishOrderCreated(event);
        
        return toResponse(order);
    }
    
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toResponse(order);
    }
    
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        order = orderRepository.save(order);
        
        // Publish event
        OrderUpdatedEvent event = new OrderUpdatedEvent();
        event.setOrderId(id);
        event.setOldStatus(oldStatus);
        event.setNewStatus(status);
        eventPublisher.publishOrderUpdated(event);
        
        return toResponse(order);
    }
    
    private void validateProducts(List<OrderItemDTO> items) {
        for (OrderItemDTO item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getId());
            }
        }
    }
    
    private BigDecimal calculateTotal(List<OrderItemDTO> items) {
        return items.stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId())
                            .orElseThrow();
                    return product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```

### **4.3 Order Controller**
1. Create Order Controller:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody @Valid CreateOrderRequest request) {
        OrderResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable Long userId) {
        List<OrderResponse> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(response);
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Order-Payment Integration** (2h)

**Mục tiêu:** Order -> Payment flow

**Yêu cầu:**

### **5.1 Payment Service Consumer**
1. Consume OrderCreatedEvent:
```java
@Component
@Slf4j
public class PaymentEventConsumer {
    
    @Autowired
    private PaymentService paymentService;
    
    @KafkaListener(topics = "order-created", groupId = "payment-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent: orderId={}", event.getOrderId());
        
        // Process payment
        ProcessPaymentRequest request = new ProcessPaymentRequest();
        request.setOrderId(event.getOrderId());
        request.setAmount(event.getTotalAmount());
        request.setPaymentMethod("CREDIT_CARD"); // Default
        
        try {
            PaymentResponse payment = paymentService.processPayment(request);
            log.info("Payment processed: paymentId={}", payment.getId());
        } catch (Exception e) {
            log.error("Payment processing failed: {}", e.getMessage(), e);
        }
    }
}
```

### **5.2 Order Service Consumer**
1. Consume PaymentProcessedEvent:
```java
@Component
@Slf4j
public class OrderEventConsumer {
    
    @Autowired
    private OrderService orderService;
    
    @KafkaListener(topics = "payment-processed", groupId = "order-service")
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        log.info("Received PaymentProcessedEvent: paymentId={}, orderId={}", 
            event.getPaymentId(), event.getOrderId());
        
        if ("COMPLETED".equals(event.getStatus())) {
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
        } else {
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.FAILED);
        }
    }
}
```

### **5.3 End-to-End Test**
1. Test complete flow:
```java
@SpringBootTest
@Transactional
class OrderPaymentFlowTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Test
    void testOrderToPaymentFlow() {
        // Create order
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(1L);
        orderRequest.setItems(List.of(new OrderItemDTO(1L, 2)));
        orderRequest.setShippingAddress("123 Main St");
        
        OrderResponse order = orderService.createOrder(orderRequest);
        assertEquals(OrderStatus.PENDING, order.getStatus());
        
        // Wait for payment processing (triggered by event)
        // In real scenario, payment service consumes OrderCreatedEvent
        
        // Manually trigger payment for testing
        ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest();
        paymentRequest.setOrderId(order.getId());
        paymentRequest.setAmount(order.getTotalAmount());
        
        PaymentResponse payment = paymentService.processPayment(paymentRequest);
        assertEquals("COMPLETED", payment.getStatus());
        
        // Verify order status updated
        Order updatedOrder = orderRepository.findById(order.getId()).orElseThrow();
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
    }
}
```

---

## 📝 **Checklist Day 25**

### Buổi sáng:
- [ ] Exercise 1.1: Test Containers Setup
- [ ] Exercise 1.2: PostgreSQL Test Container
- [ ] Exercise 1.3: Redis & Kafka Test Containers
- [ ] Exercise 1.4: Shared Containers
- [ ] Exercise 2.1: JaCoCo Setup
- [ ] Exercise 2.2: Coverage Analysis
- [ ] Exercise 3: Practice - Improve Test Coverage

### Buổi tối:
- [ ] Exercise 4.1: Order Entity
- [ ] Exercise 4.2: Order Service
- [ ] Exercise 4.3: Order Controller
- [ ] Exercise 5.1: Payment Service Consumer
- [ ] Exercise 5.2: Order Service Consumer
- [ ] Exercise 5.3: End-to-End Test
- [ ] Test: Complete order-payment flow
- [ ] Test: Verify events are published/consumed

---

## 💡 **Tips**

1. Test Containers:
   - ✅ Use for integration tests with real databases
   - ✅ Reuse containers when possible
   - ✅ Clean up after tests
   - ✅ Use @DynamicPropertySource for configuration

2. Test Coverage:
   - ✅ Aim for >80% coverage
   - ✅ Focus on business logic
   - ✅ Don't test getters/setters
   - ✅ Exclude DTOs and config classes

3. Order-Payment Flow:
   - ✅ Handle payment failures
   - ✅ Update order status correctly
   - ✅ Publish events at right time
   - ✅ Test error scenarios

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 25, bạn nên:
- ✅ Sử dụng Test Containers cho integration tests
- ✅ Setup JaCoCo và đạt >80% coverage
- ✅ Implement Order Service
- ✅ Implement Order-Payment integration
- ✅ Test complete flow end-to-end

---

## 🔗 **Resources**

- **Test Containers**: https://www.testcontainers.org/
- **JaCoCo**: https://www.jacoco.org/jacoco/trunk/doc/
- **Spring Boot Testing**: https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing

Chúc bạn luyện tập tốt! 🚀
