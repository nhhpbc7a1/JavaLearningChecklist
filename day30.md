## 📅 Kế hoạch luyện tập Day 30

### **Buổi sáng (4h): Design Patterns - Builder, Strategy, Observer**

---

## 🎯 **Exercise 1: Builder Pattern** (1.5h)

**Mục tiêu:** Fluent API, object construction

**Yêu cầu:**

### **1.1 Classic Builder Pattern**
1. Create builder:
```java
public class Product {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String description;
    
    private Product(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.price = builder.price;
        this.stock = builder.stock;
        this.description = builder.description;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private Long id;
        private String name;
        private BigDecimal price;
        private Integer stock;
        private String description;
        
        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder price(BigDecimal price) {
            this.price = price;
            return this;
        }
        
        public Builder stock(Integer stock) {
            this.stock = stock;
            return this;
        }
        
        public Builder description(String description) {
            this.description = description;
            return this;
        }
        
        public Product build() {
            if (name == null || price == null) {
                throw new IllegalStateException("Name and price are required");
            }
            return new Product(this);
        }
    }
}
```

2. Use builder:
```java
Product product = Product.builder()
    .name("Laptop")
    .price(new BigDecimal("999.99"))
    .stock(10)
    .description("Gaming laptop")
    .build();
```

### **1.2 Lombok @Builder**
1. Use Lombok:
```java
@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    private String description;
}

// Usage
ProductResponse response = ProductResponse.builder()
    .id(1L)
    .name("Laptop")
    .price(new BigDecimal("999.99"))
    .build();
```

---

## 🎯 **Exercise 2: Strategy Pattern** (1.5h)

**Mục tiêu:** Algorithm selection

**Yêu cầu:**

### **2.1 Strategy Interface**
1. Create strategy:
```java
public interface PaymentStrategy {
    PaymentResult processPayment(BigDecimal amount, PaymentRequest request);
}

public class CreditCardStrategy implements PaymentStrategy {
    @Override
    public PaymentResult processPayment(BigDecimal amount, PaymentRequest request) {
        // Credit card processing logic
        return PaymentResult.success("Payment processed via credit card");
    }
}

public class PayPalStrategy implements PaymentStrategy {
    @Override
    public PaymentResult processPayment(BigDecimal amount, PaymentRequest request) {
        // PayPal processing logic
        return PaymentResult.success("Payment processed via PayPal");
    }
}
```

### **2.2 Context Class**
1. Use strategy:
```java
@Service
public class PaymentService {
    
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public PaymentResult processPayment(BigDecimal amount, PaymentRequest request) {
        return paymentStrategy.processPayment(amount, request);
    }
}
```

### **2.3 Strategy Factory**
1. Create factory:
```java
@Component
public class PaymentStrategyFactory {
    
    private final Map<String, PaymentStrategy> strategies;
    
    public PaymentStrategyFactory(List<PaymentStrategy> strategies) {
        this.strategies = strategies.stream()
                .collect(Collectors.toMap(
                    s -> s.getClass().getSimpleName().replace("Strategy", "").toLowerCase(),
                    Function.identity()
                ));
    }
    
    public PaymentStrategy getStrategy(String paymentMethod) {
        PaymentStrategy strategy = strategies.get(paymentMethod.toLowerCase());
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown payment method: " + paymentMethod);
        }
        return strategy;
    }
}
```

---

## 🎯 **Exercise 3: Observer Pattern** (1h)

**Mục tiêu:** Event-driven with Spring Events

**Yêu cầu:**

### **3.1 Spring Events**
1. Create event:
```java
public class OrderCreatedEvent extends ApplicationEvent {
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    
    public OrderCreatedEvent(Object source, Long orderId, Long userId, BigDecimal totalAmount) {
        super(source);
        this.orderId = orderId;
        this.userId = userId;
        this.totalAmount = totalAmount;
    }
    // Getters
}
```

2. Create listeners:
```java
@Component
public class OrderEventListener {
    
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        System.out.println("Order created: " + event.getOrderId());
        // Send notification
    }
    
    @EventListener
    @Async
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Update inventory
    }
}
```

3. Publish event:
```java
@Service
public class OrderService {
    
    @Autowired
    private ApplicationEventPublisher eventPublisher;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = createAndSaveOrder(request);
        
        // Publish event
        eventPublisher.publishEvent(
            new OrderCreatedEvent(this, order.getId(), order.getUserId(), order.getTotalAmount())
        );
        
        return toResponse(order);
    }
}
```

---

### **Buổi tối (4h): Practice - Implement Patterns**

---

## 🎯 **Exercise 4: Practice - Implement Patterns** (4h)

**Mục tiêu:** Build examples with patterns

**Yêu cầu:**

1. Implement Builder for Order:
   - Create OrderBuilder
   - Use in OrderService

2. Implement Strategy for Discount:
   - Create DiscountStrategy interface
   - Implement different discount strategies
   - Use in OrderService

3. Implement Observer for Notifications:
   - Create notification listeners
   - Publish events
   - Handle events asynchronously

---

## 📝 **Checklist Day 30**

### Buổi sáng:
- [ ] Exercise 1.1: Classic Builder Pattern
- [ ] Exercise 1.2: Lombok @Builder
- [ ] Exercise 2.1: Strategy Interface
- [ ] Exercise 2.2: Context Class
- [ ] Exercise 2.3: Strategy Factory
- [ ] Exercise 3.1: Spring Events
- [ ] Exercise 3.2: Event Listeners
- [ ] Exercise 3.3: Publish Events

### Buổi tối:
- [ ] Exercise 4: Practice - Implement Patterns
- [ ] Implement: Builder for Order
- [ ] Implement: Strategy for Discount
- [ ] Implement: Observer for Notifications

---

## 💡 **Tips**

1. Builder Pattern:
   - ✅ Use for complex object construction
   - ✅ Make code more readable
   - ✅ Validate in build() method

2. Strategy Pattern:
   - ✅ Use for interchangeable algorithms
   - ✅ Follow Open/Closed Principle
   - ✅ Easy to add new strategies

3. Observer Pattern:
   - ✅ Decouple publishers and subscribers
   - ✅ Use Spring Events for simplicity
   - ✅ Handle events asynchronously

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 30, bạn nên:
- ✅ Implement builder pattern
- ✅ Use strategy pattern
- ✅ Implement observer pattern
- ✅ Apply patterns in practice

---

## 🔗 **Resources**

- **Design Patterns**: https://refactoring.guru/design-patterns
- **Spring Events**: https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#context-functionality-events

Chúc bạn luyện tập tốt! 🚀
