## 📅 Kế hoạch luyện tập Day 28

### **Buổi sáng (4h): Complete Project 2 & End-to-End Testing**

---

## 🎯 **Exercise 1: Project 2 - Complete all services** (2h)

**Mục tiêu:** Finish remaining features

**Yêu cầu:**

### **1.1 Review All Services**
1. Verify all services are complete:
   - ✅ User Service (Authentication, User Management)
   - ✅ Product Service (CRUD, Search, Filter)
   - ✅ Order Service (Create, Update, Status)
   - ✅ Payment Service (Process Payment)
   - ✅ Notification Service (Consume Events, Send Notifications)

2. Check missing features:
   - Add any missing CRUD operations
   - Add validation
   - Add error handling
   - Add logging

### **1.2 Add Missing Features**
1. Inventory Management:
```java
@Service
public class ProductService {
    
    public void decreaseStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
        
        // Publish event
        InventoryUpdatedEvent event = new InventoryUpdatedEvent();
        event.setProductId(productId);
        event.setQuantity(quantity);
        event.setAction("DECREASE");
        eventPublisher.publishInventoryUpdated(event);
    }
}
```

2. Order Cancellation:
```java
@Service
public class OrderService {
    
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel order in " + order.getStatus() + " status");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // Restore inventory
        order.getItems().forEach(item -> {
            productService.increaseStock(item.getProductId(), item.getQuantity());
        });
        
        // Publish event
        OrderCancelledEvent event = new OrderCancelledEvent();
        event.setOrderId(orderId);
        event.setReason(reason);
        eventPublisher.publishOrderCancelled(event);
    }
}
```

---

## 🎯 **Exercise 2: Project 2 - End-to-End Testing** (2h)

**Mục tiêu:** Test complete flows

**Yêu cầu:**

### **2.1 Complete Order Flow Test**
1. Test full order flow:
```java
@SpringBootTest
@Transactional
class CompleteOrderFlowTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private UserService userService;
    
    @Test
    void testCompleteOrderFlow() {
        // 1. Create user
        UserResponse user = userService.register(createUserRequest());
        
        // 2. Create product
        ProductResponse product = productService.createProduct(createProductRequest());
        
        // 3. Create order
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setUserId(user.getId());
        orderRequest.setItems(List.of(new OrderItemDTO(product.getId(), 2)));
        
        OrderResponse order = orderService.createOrder(orderRequest);
        assertEquals(OrderStatus.PENDING, order.getStatus());
        
        // 4. Process payment
        ProcessPaymentRequest paymentRequest = new ProcessPaymentRequest();
        paymentRequest.setOrderId(order.getId());
        paymentRequest.setAmount(order.getTotalAmount());
        
        PaymentResponse payment = paymentService.processPayment(paymentRequest);
        assertEquals("COMPLETED", payment.getStatus());
        
        // 5. Verify order status updated
        OrderResponse updatedOrder = orderService.getOrderById(order.getId());
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
        
        // 6. Verify inventory decreased
        ProductResponse updatedProduct = productService.getProductById(product.getId());
        assertEquals(product.getStock() - 2, updatedProduct.getStock());
    }
}
```

### **2.2 Event Flow Test**
1. Test event-driven flow:
```java
@SpringBootTest
class EventFlowTest {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Autowired
    private OrderService orderService;
    
    @Test
    void testEventFlow() throws InterruptedException {
        // Create order
        OrderResponse order = orderService.createOrder(createOrderRequest());
        
        // Wait for OrderCreatedEvent to be consumed
        Thread.sleep(2000);
        
        // Verify payment was processed (triggered by event)
        // Verify order status updated (triggered by PaymentProcessedEvent)
        // Verify notification created
    }
}
```

---

### **Buổi tối (4h): Docker Compose & Documentation**

---

## 🎯 **Exercise 3: Project 2 - Docker Compose Setup** (2h)

**Mục tiêu:** Containerize all services

**Yêu cầu:**

### **3.1 Dockerfile for Each Service**
1. Create Dockerfile:
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

2. Build images:
```bash
# Build each service
docker build -t user-service:latest ./user-service
docker build -t product-service:latest ./product-service
docker build -t order-service:latest ./order-service
docker build -t payment-service:latest ./payment-service
docker build -t notification-service:latest ./notification-service
docker build -t api-gateway:latest ./api-gateway
```

### **3.2 Docker Compose**
1. Create docker-compose.yml:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: user_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092

  eureka-server:
    image: eureka-server:latest
    ports:
      - "8761:8761"

  user-service:
    image: user-service:latest
    depends_on:
      - postgres
      - redis
      - eureka-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/user_db
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

  product-service:
    image: product-service:latest
    depends_on:
      - postgres
      - redis
      - eureka-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/product_db
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

  order-service:
    image: order-service:latest
    depends_on:
      - postgres
      - kafka
      - eureka-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/order_db
      KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

  payment-service:
    image: payment-service:latest
    depends_on:
      - postgres
      - kafka
      - eureka-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/payment_db
      KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

  notification-service:
    image: notification-service:latest
    depends_on:
      - postgres
      - kafka
      - eureka-server
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/notification_db
      KAFKA_BOOTSTRAP_SERVERS: kafka:9092
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

  api-gateway:
    image: api-gateway:latest
    depends_on:
      - eureka-server
    ports:
      - "8080:8080"
    environment:
      EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE: http://eureka-server:8761/eureka/

volumes:
  postgres_data:
```

3. Run with Docker Compose:
```bash
docker-compose up -d
```

---

## 🎯 **Exercise 4: Project 2 - Documentation & Review** (2h)

**Mục tiêu:** Document architecture, code review

**Yêu cầu:**

### **4.1 Architecture Documentation**
1. Create architecture diagram:
   - Services and their responsibilities
   - Communication patterns
   - Database schema
   - Event flow

2. Write README:
```markdown
# E-Commerce Microservices

## Architecture
- User Service: User management and authentication
- Product Service: Product catalog management
- Order Service: Order processing
- Payment Service: Payment processing
- Notification Service: Event-driven notifications
- API Gateway: Single entry point
- Eureka Server: Service discovery

## Tech Stack
- Spring Boot
- Spring Cloud (Eureka, Gateway, OpenFeign)
- PostgreSQL
- Redis
- Kafka
- Docker

## Setup
1. Start infrastructure: `docker-compose up -d`
2. Start Eureka Server
3. Start all services
4. Access API Gateway: http://localhost:8080
```

### **4.2 API Documentation**
1. Document all endpoints:
   - User Service APIs
   - Product Service APIs
   - Order Service APIs
   - Payment Service APIs
   - Notification Service APIs

2. Use Swagger/OpenAPI:
```java
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce Microservices API")
                        .version("1.0")
                        .description("API documentation"));
    }
}
```

### **4.3 Code Review**
1. Review checklist:
   - ✅ Code follows best practices
   - ✅ Proper error handling
   - ✅ Logging implemented
   - ✅ Tests written
   - ✅ Documentation complete
   - ✅ No hardcoded values
   - ✅ Security implemented

---

## 🎯 **Exercise 5: Week 3-4 Review & Reflection** (Optional)

**Mục tiêu:** Review microservices concepts

**Yêu cầu:**

1. Review key concepts:
   - Microservices architecture
   - Service discovery
   - API Gateway
   - Event-driven architecture
   - Circuit breaker pattern
   - Inter-service communication

2. Reflect on learning:
   - What went well?
   - What was challenging?
   - What would you do differently?

---

## 📝 **Checklist Day 28**

### Buổi sáng:
- [ ] Exercise 1.1: Review All Services
- [ ] Exercise 1.2: Add Missing Features
- [ ] Exercise 2.1: Complete Order Flow Test
- [ ] Exercise 2.2: Event Flow Test

### Buổi tối:
- [ ] Exercise 3.1: Dockerfile for Each Service
- [ ] Exercise 3.2: Docker Compose Setup
- [ ] Exercise 4.1: Architecture Documentation
- [ ] Exercise 4.2: API Documentation
- [ ] Exercise 4.3: Code Review
- [ ] Exercise 5: Week 3-4 Review & Reflection
- [ ] Test: Run complete system with Docker Compose
- [ ] Test: Verify all services work together

---

## 💡 **Tips**

1. Docker:
   - ✅ Use multi-stage builds for smaller images
   - ✅ Use .dockerignore
   - ✅ Set appropriate health checks
   - ✅ Use environment variables

2. Documentation:
   - ✅ Keep documentation up to date
   - ✅ Include setup instructions
   - ✅ Document API endpoints
   - ✅ Include architecture diagrams

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 28, bạn nên:
- ✅ Complete all services
- ✅ Test complete flows
- ✅ Dockerize all services
- ✅ Setup Docker Compose
- ✅ Document architecture
- ✅ Review and reflect

---

## 🔗 **Resources**

- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **Spring Cloud**: https://spring.io/projects/spring-cloud

Chúc bạn luyện tập tốt! 🚀
