## 📅 Kế hoạch luyện tập Day 23

### **Buổi sáng (4h): Kafka Event Publishing & Consumption**

---

## 🎯 **Exercise 1: Kafka Event Publishing** (1.5h)

**Mục tiêu:** Publish events from services

**Yêu cầu:**

### **1.1 Event Publisher Service**
1. Create EventPublisher:
```java
@Service
@Slf4j
public class EventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void publishOrderCreated(OrderCreatedEvent event) {
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setSource("order-service");
        
        try {
            kafkaTemplate.send("order-created", event.getOrderId().toString(), event);
            log.info("Published OrderCreatedEvent: orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to publish OrderCreatedEvent: {}", e.getMessage(), e);
            throw new EventPublishException("Failed to publish event", e);
        }
    }
    
    public void publishPaymentProcessed(PaymentProcessedEvent event) {
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setSource("payment-service");
        
        kafkaTemplate.send("payment-processed", event.getOrderId().toString(), event);
        log.info("Published PaymentProcessedEvent: paymentId={}", event.getPaymentId());
    }
    
    public void publishOrderUpdated(OrderUpdatedEvent event) {
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setSource("order-service");
        
        kafkaTemplate.send("order-updated", event.getOrderId().toString(), event);
        log.info("Published OrderUpdatedEvent: orderId={}", event.getOrderId());
    }
    
    // Send with callback
    public void publishWithCallback(String topic, String key, Object event) {
        ListenableFuture<SendResult<String, Object>> future = 
            kafkaTemplate.send(topic, key, event);
        
        future.addCallback(
            result -> log.info("Event published successfully: topic={}, key={}", topic, key),
            failure -> log.error("Failed to publish event: topic={}, key={}, error={}", 
                topic, key, failure.getMessage())
        );
    }
}
```

### **1.2 Publish from Order Service**
1. Order Service - Create Order:
```java
@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Create order
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(OrderStatus.PENDING);
        order.setItems(request.getItems());
        
        order = orderRepository.save(order);
        
        // Publish event
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        event.setItems(order.getItems());
        
        eventPublisher.publishOrderCreated(event);
        
        return toResponse(order);
    }
    
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(status);
        order = orderRepository.save(order);
        
        // Publish event
        OrderUpdatedEvent event = new OrderUpdatedEvent();
        event.setOrderId(orderId);
        event.setOldStatus(oldStatus);
        event.setNewStatus(status);
        
        eventPublisher.publishOrderUpdated(event);
        
        return toResponse(order);
    }
}
```

### **1.3 Publish from Payment Service**
1. Payment Service - Process Payment:
```java
@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        // Process payment
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(PaymentStatus.PROCESSING);
        
        payment = paymentRepository.save(payment);
        
        // Simulate payment processing
        try {
            // Payment processing logic...
            payment.setStatus(PaymentStatus.COMPLETED);
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
            throw new PaymentProcessingException("Payment failed", e);
        }
    }
}
```

---

## 🎯 **Exercise 2: Kafka Event Consumption** (1.5h)

**Mục tiêu:** Consume events và handle errors

**Yêu cầu:**

### **2.1 Event Consumer with Error Handling**
1. Order Event Consumer:
```java
@Component
@Slf4j
public class OrderEventConsumer {
    
    @Autowired
    private OrderService orderService;
    
    @KafkaListener(topics = "payment-processed", groupId = "order-service")
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        try {
            log.info("Received PaymentProcessedEvent: paymentId={}, orderId={}", 
                event.getPaymentId(), event.getOrderId());
            
            // Update order status
            if ("COMPLETED".equals(event.getStatus())) {
                orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
            } else {
                orderService.updateOrderStatus(event.getOrderId(), OrderStatus.FAILED);
            }
        } catch (Exception e) {
            log.error("Error processing PaymentProcessedEvent: {}", e.getMessage(), e);
            // Handle error - could send to DLQ (Dead Letter Queue)
        }
    }
    
    @KafkaListener(topics = "order-created", groupId = "order-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent: orderId={}", event.getOrderId());
        // Handle order created event (e.g., update inventory)
    }
}
```

### **2.2 Error Handling & Retry**
1. Configure retry:
```java
@Configuration
@EnableKafka
public class KafkaConsumerConfig {
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(jsonConsumerFactory());
        
        // Retry configuration
        factory.setRetryTemplate(retryTemplate());
        
        // Error handler
        factory.setErrorHandler(new SeekToCurrentErrorHandler(
            new DeadLetterPublishingRecoverer(kafkaTemplate()),
            new FixedBackOff(1000L, 3L) // 1 second delay, 3 retries
        ));
        
        return factory;
    }
    
    private RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();
        
        FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
        backOffPolicy.setBackOffPeriod(1000L); // 1 second
        retryTemplate.setBackOffPolicy(backOffPolicy);
        
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);
        
        return retryTemplate;
    }
}
```

2. Manual acknowledgment:
```java
@Component
@Slf4j
public class OrderEventConsumer {
    
    @KafkaListener(topics = "payment-processed", groupId = "order-service",
                   containerFactory = "kafkaListenerContainerFactory")
    public void handlePaymentProcessed(
            PaymentProcessedEvent event,
            Acknowledgment acknowledgment) {
        try {
            // Process event
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
            
            // Acknowledge after successful processing
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Error processing event: {}", e.getMessage(), e);
            // Don't acknowledge - message will be retried
        }
    }
}
```

### **2.3 Dead Letter Queue (DLQ)**
1. DLQ Configuration:
```java
@Configuration
public class KafkaDLQConfig {
    
    @Bean
    public DeadLetterPublishingRecoverer dlqRecoverer(KafkaTemplate<String, Object> kafkaTemplate) {
        return new DeadLetterPublishingRecoverer(kafkaTemplate,
            (record, ex) -> new TopicPartition("dlq-" + record.topic(), record.partition()));
    }
    
    @Bean
    public ErrorHandler errorHandler(DeadLetterPublishingRecoverer dlqRecoverer) {
        return new SeekToCurrentErrorHandler(dlqRecoverer, new FixedBackOff(1000L, 3L));
    }
}
```

2. DLQ Consumer:
```java
@Component
@Slf4j
public class DLQConsumer {
    
    @KafkaListener(topics = "dlq-.*", groupId = "dlq-handler")
    public void handleDLQ(ConsumerRecord<String, Object> record) {
        log.error("DLQ Message - Topic: {}, Key: {}, Value: {}, Error: {}", 
            record.topic(), record.key(), record.value(), record.headers());
        // Handle failed messages - log, alert, manual review
    }
}
```

---

## 🎯 **Exercise 3: Practice - Build Event-Driven Flow** (1h)

**Mục tiêu:** Order created -> Payment processed flow

**Yêu cầu:**

1. Complete flow:
   - Order Service creates order → publishes OrderCreatedEvent
   - Payment Service consumes OrderCreatedEvent → processes payment → publishes PaymentProcessedEvent
   - Order Service consumes PaymentProcessedEvent → updates order status
   - Notification Service consumes both events → sends notifications

2. Implementation:
```java
// Order Service
@Service
public class OrderService {
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = createAndSaveOrder(request);
        
        // Publish event
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        eventPublisher.publishOrderCreated(event);
        
        return toResponse(order);
    }
}

// Payment Service
@Component
public class PaymentEventConsumer {
    @KafkaListener(topics = "order-created", groupId = "payment-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        // Process payment
        PaymentResponse payment = paymentService.processPayment(
            event.getOrderId(), event.getTotalAmount());
        
        // Publish event
        PaymentProcessedEvent paymentEvent = new PaymentProcessedEvent();
        paymentEvent.setOrderId(event.getOrderId());
        paymentEvent.setPaymentId(payment.getId());
        paymentEvent.setStatus("COMPLETED");
        eventPublisher.publishPaymentProcessed(paymentEvent);
    }
}

// Order Service
@Component
public class OrderEventConsumer {
    @KafkaListener(topics = "payment-processed", groupId = "order-service")
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        if ("COMPLETED".equals(event.getStatus())) {
            orderService.updateOrderStatus(event.getOrderId(), OrderStatus.CONFIRMED);
        }
    }
}
```

---

### **Buổi tối (4h): Project 2 - Event Flow & Notification Service**

---

## 🎯 **Exercise 4: Project 2 - Implement Event Flow** (2h)

**Mục tiêu:** Order events, payment events

**Yêu cầu:**

### **4.1 Order Service Events**
1. Create Order Events:
```java
public class OrderCreatedEvent extends BaseEvent {
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;
    private String shippingAddress;
}

public class OrderUpdatedEvent extends BaseEvent {
    private Long orderId;
    private OrderStatus oldStatus;
    private OrderStatus newStatus;
}

public class OrderCancelledEvent extends BaseEvent {
    private Long orderId;
    private String reason;
}
```

2. Publish from Order Service:
```java
@Service
public class OrderService {
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public OrderResponse createOrder(CreateOrderRequest request) {
        Order order = createAndSaveOrder(request);
        
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(order.getId());
        event.setUserId(order.getUserId());
        event.setTotalAmount(order.getTotalAmount());
        event.setItems(order.getItems());
        event.setShippingAddress(order.getShippingAddress());
        
        eventPublisher.publishOrderCreated(event);
        return toResponse(order);
    }
    
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        OrderCancelledEvent event = new OrderCancelledEvent();
        event.setOrderId(orderId);
        event.setReason(reason);
        eventPublisher.publishOrderCancelled(event);
    }
}
```

### **4.2 Payment Service Events**
1. Create Payment Events:
```java
public class PaymentProcessedEvent extends BaseEvent {
    private Long paymentId;
    private Long orderId;
    private BigDecimal amount;
    private String paymentMethod;
    private String status;
}

public class PaymentFailedEvent extends BaseEvent {
    private Long paymentId;
    private Long orderId;
    private String reason;
}
```

2. Publish from Payment Service:
```java
@Service
public class PaymentService {
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        Payment payment = createPayment(request);
        
        try {
            // Process payment
            payment = processPaymentLogic(payment);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment = paymentRepository.save(payment);
            
            // Publish success event
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
            
            // Publish failure event
            PaymentFailedEvent event = new PaymentFailedEvent();
            event.setPaymentId(payment.getId());
            event.setOrderId(payment.getOrderId());
            event.setReason(e.getMessage());
            eventPublisher.publishPaymentFailed(event);
            
            throw new PaymentProcessingException("Payment failed", e);
        }
    }
}
```

### **4.3 Product Service Events**
1. Product Events:
```java
public class ProductUpdatedEvent extends BaseEvent {
    private Long productId;
    private String name;
    private BigDecimal price;
    private Integer stock;
}

public class InventoryUpdatedEvent extends BaseEvent {
    private Long productId;
    private Integer quantity;
    private String action; // DECREASE, INCREASE
}
```

---

## 🎯 **Exercise 5: Project 2 - Notification Service** (2h)

**Mục tiêu:** Consume events và send notifications

**Yêu cầu:**

### **5.1 Notification Service Setup**
1. Create Notification Service module:
```java
@SpringBootApplication
@EnableKafka
public class NotificationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
```

2. Notification Entity:
```java
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private String type; // ORDER_CREATED, PAYMENT_PROCESSED, etc.
    private String title;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
}
```

### **5.2 Event Consumers**
1. Consume events and create notifications:
```java
@Component
@Slf4j
public class NotificationEventConsumer {
    
    @Autowired
    private NotificationService notificationService;
    
    @KafkaListener(topics = "order-created", groupId = "notification-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received OrderCreatedEvent: orderId={}", event.getOrderId());
        
        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setType("ORDER_CREATED");
        notification.setTitle("Order Created");
        notification.setMessage("Your order #" + event.getOrderId() + " has been created successfully.");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationService.createNotification(notification);
    }
    
    @KafkaListener(topics = "payment-processed", groupId = "notification-service")
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        log.info("Received PaymentProcessedEvent: paymentId={}", event.getPaymentId());
        
        // Get order to find userId
        Long userId = getUserIdFromOrder(event.getOrderId());
        
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("PAYMENT_PROCESSED");
        notification.setTitle("Payment Processed");
        notification.setMessage("Your payment for order #" + event.getOrderId() + " has been processed.");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationService.createNotification(notification);
    }
    
    @KafkaListener(topics = "order-updated", groupId = "notification-service")
    public void handleOrderUpdated(OrderUpdatedEvent event) {
        log.info("Received OrderUpdatedEvent: orderId={}", event.getOrderId());
        
        Long userId = getUserIdFromOrder(event.getOrderId());
        
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType("ORDER_UPDATED");
        notification.setTitle("Order Status Updated");
        notification.setMessage("Your order #" + event.getOrderId() + 
            " status changed from " + event.getOldStatus() + " to " + event.getNewStatus());
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        notificationService.createNotification(notification);
    }
    
    private Long getUserIdFromOrder(Long orderId) {
        // Call Order Service to get order details
        // Or store userId in event
        return 1L; // Placeholder
    }
}
```

### **5.3 Notification Service API**
1. Notification Service:
```java
@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }
    
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
```

2. Notification Controller:
```java
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<NotificationResponse>> getUnreadNotifications(@PathVariable Long userId) {
        List<Notification> notifications = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notifications.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## 📝 **Checklist Day 23**

### Buổi sáng:
- [ ] Exercise 1.1: Event Publisher Service
- [ ] Exercise 1.2: Publish from Order Service
- [ ] Exercise 1.3: Publish from Payment Service
- [ ] Exercise 2.1: Event Consumer with Error Handling
- [ ] Exercise 2.2: Error Handling & Retry
- [ ] Exercise 2.3: Dead Letter Queue (DLQ)
- [ ] Exercise 3: Practice - Build Event-Driven Flow

### Buổi tối:
- [ ] Exercise 4.1: Order Service Events
- [ ] Exercise 4.2: Payment Service Events
- [ ] Exercise 4.3: Product Service Events
- [ ] Exercise 5.1: Notification Service Setup
- [ ] Exercise 5.2: Event Consumers
- [ ] Exercise 5.3: Notification Service API
- [ ] Test: Complete event flow end-to-end
- [ ] Test: Verify notifications are created

---

## 💡 **Tips**

1. Event Publishing:
   - ✅ Always set event metadata (eventId, timestamp, source)
   - ✅ Use appropriate keys for partitioning
   - ✅ Handle publish failures
   - ✅ Log all published events

2. Event Consumption:
   - ✅ Implement idempotent handlers
   - ✅ Handle errors gracefully
   - ✅ Use retry with backoff
   - ✅ Monitor consumer lag

3. Event Design:
   - ✅ Include all necessary data
   - ✅ Version your events
   - ✅ Keep events immutable
   - ✅ Document event schemas

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 23, bạn nên:
- ✅ Publish events từ services
- ✅ Consume events với error handling
- ✅ Implement retry và DLQ
- ✅ Build complete event-driven flow
- ✅ Implement Notification Service
- ✅ Test end-to-end event flow

---

## 🔗 **Resources**

- **Spring Kafka**: https://docs.spring.io/spring-kafka/docs/current/reference/html/
- **Kafka Best Practices**: https://kafka.apache.org/documentation/#bestpractices
- **Event-Driven Architecture**: https://martinfowler.com/articles/201701-event-driven.html

Chúc bạn luyện tập tốt! 🚀
