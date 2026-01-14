## 📅 Kế hoạch luyện tập Day 22

### **Buổi sáng (4h): Kafka Introduction & Spring Kafka Basics**

---

## 🎯 **Exercise 1: Kafka Introduction** (1.5h)

**Mục tiêu:** Hiểu Kafka, topics, producers, consumers

**Yêu cầu:**

### **1.1 What is Apache Kafka?**
1. Kafka là gì:
   - Distributed event streaming platform
   - Publish-subscribe messaging system
   - High-throughput, fault-tolerant
   - Used for real-time data pipelines, event sourcing, microservices communication

2. Kafka Core Concepts:
   - **Topic**: Category/feed name where messages are published
   - **Partition**: Topics are split into partitions for scalability
   - **Producer**: Applications that publish messages to topics
   - **Consumer**: Applications that read messages from topics
   - **Broker**: Kafka server that stores and serves messages
   - **Consumer Group**: Multiple consumers working together to consume a topic

3. Kafka Use Cases:
   - ✅ Microservices communication
   - ✅ Event-driven architecture
   - ✅ Real-time analytics
   - ✅ Log aggregation
   - ✅ Activity tracking
   - ✅ Stream processing

### **1.2 Kafka Setup**
1. Install Kafka (Docker - Recommended):
```bash
# Using Docker Compose
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
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
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

# Run: docker-compose up -d
```

2. Verify Kafka:
```bash
# Create a topic
docker exec -it kafka kafka-topics --create \
  --bootstrap-server localhost:9092 \
  --replication-factor 1 \
  --partitions 3 \
  --topic test-topic

# List topics
docker exec -it kafka kafka-topics --list \
  --bootstrap-server localhost:9092

# Describe topic
docker exec -it kafka kafka-topics --describe \
  --bootstrap-server localhost:9092 \
  --topic test-topic
```

3. Test Producer/Consumer:
```bash
# Start producer (in one terminal)
docker exec -it kafka kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic test-topic

# Start consumer (in another terminal)
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic test-topic \
  --from-beginning
```

---

## 🎯 **Exercise 2: Spring Kafka Basics** (2h)

**Mục tiêu:** Sử dụng @KafkaListener và KafkaTemplate

**Yêu cầu:**

### **2.1 Spring Kafka Dependencies**
1. Add dependencies:
```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
</dependencies>
```

2. Application configuration:
```yaml
# application.yml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: my-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
```

### **2.2 KafkaTemplate - Producer**
1. Send messages:
```java
@Service
public class KafkaProducerService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    private static final String TOPIC = "test-topic";
    
    public void sendMessage(String message) {
        kafkaTemplate.send(TOPIC, message);
    }
    
    public void sendMessageWithKey(String key, String message) {
        kafkaTemplate.send(TOPIC, key, message);
    }
    
    public void sendMessageToPartition(String message, int partition) {
        kafkaTemplate.send(TOPIC, partition, null, message);
    }
    
    // Send with callback
    public void sendMessageWithCallback(String message) {
        ListenableFuture<SendResult<String, String>> future = 
            kafkaTemplate.send(TOPIC, message);
        
        future.addCallback(new ListenableFutureCallback<SendResult<String, String>>() {
            @Override
            public void onSuccess(SendResult<String, String> result) {
                System.out.println("Sent message=[" + message + 
                    "] with offset=[" + result.getRecordMetadata().offset() + "]");
            }
            
            @Override
            public void onFailure(Throwable ex) {
                System.out.println("Unable to send message=[" + 
                    message + "] due to : " + ex.getMessage());
            }
        });
    }
}
```

2. Send JSON messages:
```java
@Service
public class KafkaJsonProducerService {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String TOPIC = "json-topic";
    
    public void sendEvent(Object event) {
        kafkaTemplate.send(TOPIC, event);
    }
    
    public void sendEventWithKey(String key, Object event) {
        kafkaTemplate.send(TOPIC, key, event);
    }
}
```

3. KafkaTemplate Configuration:
```java
@Configuration
@EnableKafka
public class KafkaConfig {
    
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;
    
    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }
    
    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
    
    // JSON Producer
    @Bean
    public ProducerFactory<String, Object> jsonProducerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }
    
    @Bean
    public KafkaTemplate<String, Object> jsonKafkaTemplate() {
        return new KafkaTemplate<>(jsonProducerFactory());
    }
}
```

### **2.3 @KafkaListener - Consumer**
1. Basic consumer:
```java
@Component
public class KafkaConsumerService {
    
    @KafkaListener(topics = "test-topic", groupId = "my-group")
    public void consume(String message) {
        System.out.println("Received message: " + message);
    }
    
    @KafkaListener(topics = "test-topic", groupId = "my-group")
    public void consumeWithHeaders(String message, 
                                   @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                   @Header(KafkaHeaders.RECEIVED_PARTITION_ID) int partition,
                                   @Header(KafkaHeaders.OFFSET) long offset) {
        System.out.println("Received message: " + message);
        System.out.println("Topic: " + topic + ", Partition: " + partition + ", Offset: " + offset);
    }
    
    @KafkaListener(topics = "test-topic", groupId = "my-group")
    public void consumeWithConsumerRecord(ConsumerRecord<String, String> record) {
        System.out.println("Key: " + record.key());
        System.out.println("Value: " + record.value());
        System.out.println("Partition: " + record.partition());
        System.out.println("Offset: " + record.offset());
    }
}
```

2. Multiple topics:
```java
@Component
public class KafkaConsumerService {
    
    @KafkaListener(topics = {"topic1", "topic2"}, groupId = "my-group")
    public void consumeFromMultipleTopics(String message) {
        System.out.println("Received: " + message);
    }
    
    @KafkaListener(topicPattern = "test-.*", groupId = "my-group")
    public void consumeWithPattern(String message) {
        System.out.println("Received: " + message);
    }
}
```

3. JSON consumer:
```java
@Component
public class KafkaJsonConsumerService {
    
    @KafkaListener(topics = "json-topic", groupId = "json-group")
    public void consumeJson(Object event) {
        System.out.println("Received event: " + event);
    }
    
    @KafkaListener(topics = "order-topic", groupId = "order-group")
    public void consumeOrderEvent(OrderEvent event) {
        System.out.println("Received order: " + event.getOrderId());
        // Process order event
    }
}
```

4. Consumer Configuration:
```java
@Configuration
@EnableKafka
public class KafkaConsumerConfig {
    
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;
    
    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "my-group");
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return new DefaultKafkaConsumerFactory<>(configProps);
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
    
    // JSON Consumer
    @Bean
    public ConsumerFactory<String, Object> jsonConsumerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ConsumerConfig.GROUP_ID_CONFIG, "json-group");
        configProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        configProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        configProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        configProps.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(configProps);
    }
    
    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> jsonKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = 
            new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(jsonConsumerFactory());
        return factory;
    }
}
```

---

## 🎯 **Exercise 3: Practice - Send/Receive Messages** (0.5h)

**Mục tiêu:** Tạo simple producer/consumer

**Yêu cầu:**

1. Create a simple event:
```java
public class UserEvent {
    private String userId;
    private String action;
    private LocalDateTime timestamp;
    
    // Constructors, getters, setters
}
```

2. Create producer:
```java
@RestController
@RequestMapping("/api/kafka")
public class KafkaController {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody String message) {
        kafkaTemplate.send("test-topic", message);
        return ResponseEntity.ok("Message sent");
    }
    
    @PostMapping("/send-event")
    public ResponseEntity<String> sendEvent(@RequestBody UserEvent event) {
        kafkaTemplate.send("user-events", event);
        return ResponseEntity.ok("Event sent");
    }
}
```

3. Create consumer:
```java
@Component
public class UserEventConsumer {
    
    @KafkaListener(topics = "user-events", groupId = "user-group")
    public void consumeUserEvent(UserEvent event) {
        System.out.println("Received user event: " + event.getUserId() + " - " + event.getAction());
        // Process event
    }
}
```

4. Test:
   - Start Kafka
   - Send message via REST API
   - Verify consumer receives message

---

### **Buổi tối (4h): Event-Driven Architecture & Project 2 Kafka Setup**

---

## 🎯 **Exercise 4: Event-Driven Architecture** (2h)

**Mục tiêu:** Hiểu Events, event sourcing, CQRS basics

**Yêu cầu:**

### **4.1 Event-Driven Architecture Concepts**
1. What is Event-Driven Architecture:
   - Services communicate through events
   - Loose coupling between services
   - Asynchronous communication
   - Scalable and resilient

2. Event Types:
   - **Domain Events**: Business events (OrderCreated, PaymentProcessed)
   - **Integration Events**: Events for service communication
   - **System Events**: Technical events (ServiceStarted, ErrorOccurred)

3. Event Sourcing:
   - Store all changes as a sequence of events
   - Reconstruct state by replaying events
   - Audit trail built-in
   - Time travel queries

4. CQRS (Command Query Responsibility Segregation):
   - Separate read and write models
   - Commands: Write operations (CreateOrder, UpdateProduct)
   - Queries: Read operations (GetOrder, ListProducts)
   - Benefits: Scalability, optimization

### **4.2 Event Design**
1. Event structure:
```java
public abstract class BaseEvent {
    private String eventId;
    private String eventType;
    private LocalDateTime timestamp;
    private String source;
    
    // Constructors, getters, setters
}

public class OrderCreatedEvent extends BaseEvent {
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    private List<OrderItem> items;
    
    // Constructors, getters, setters
}

public class PaymentProcessedEvent extends BaseEvent {
    private Long paymentId;
    private Long orderId;
    private BigDecimal amount;
    private String status;
    
    // Constructors, getters, setters
}
```

2. Event Publisher:
```java
@Service
public class EventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    public void publishEvent(BaseEvent event) {
        event.setEventId(UUID.randomUUID().toString());
        event.setTimestamp(LocalDateTime.now());
        event.setSource("order-service");
        
        kafkaTemplate.send(event.getEventType(), event);
    }
    
    public void publishOrderCreated(OrderCreatedEvent event) {
        publishEvent(event);
    }
    
    public void publishPaymentProcessed(PaymentProcessedEvent event) {
        publishEvent(event);
    }
}
```

### **4.3 Event Handlers**
1. Event handlers:
```java
@Component
public class OrderEventHandler {
    
    @KafkaListener(topics = "order-created", groupId = "notification-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        System.out.println("Order created: " + event.getOrderId());
        // Send notification
    }
    
    @KafkaListener(topics = "payment-processed", groupId = "order-service")
    public void handlePaymentProcessed(PaymentProcessedEvent event) {
        System.out.println("Payment processed: " + event.getPaymentId());
        // Update order status
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Setup Kafka** (2h)

**Mục tiêu:** Docker setup và create topics

**Yêu cầu:**

### **5.1 Docker Compose Setup**
1. Add Kafka to docker-compose.yml:
```yaml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
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
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: user_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
```

2. Create topics script:
```bash
#!/bin/bash
# create-topics.sh

KAFKA_CONTAINER="kafka"
BOOTSTRAP_SERVER="localhost:9092"

# Wait for Kafka to be ready
sleep 10

# Create topics
docker exec $KAFKA_CONTAINER kafka-topics --create \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --replication-factor 1 \
  --partitions 3 \
  --topic order-created

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --replication-factor 1 \
  --partitions 3 \
  --topic payment-processed

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --replication-factor 1 \
  --partitions 3 \
  --topic order-updated

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --bootstrap-server $BOOTSTRAP_SERVER \
  --replication-factor 1 \
  --partitions 3 \
  --topic product-updated

# List topics
docker exec $KAFKA_CONTAINER kafka-topics --list \
  --bootstrap-server $BOOTSTRAP_SERVER
```

### **5.2 Configure Services**
1. Update application.yml for each service:
```yaml
# user-service/application.yml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      group-id: user-service-group
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

2. Create Event classes:
```java
// Common event classes
public class OrderCreatedEvent {
    private String eventId;
    private LocalDateTime timestamp;
    private Long orderId;
    private Long userId;
    private BigDecimal totalAmount;
    // ... getters, setters
}

public class PaymentProcessedEvent {
    private String eventId;
    private LocalDateTime timestamp;
    private Long paymentId;
    private Long orderId;
    private String status;
    // ... getters, setters
}
```

3. Test Kafka connection:
```java
@SpringBootTest
class KafkaConnectionTest {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Test
    void testKafkaConnection() {
        String message = "Test message";
        kafkaTemplate.send("test-topic", message);
        // Verify message is sent
    }
}
```

---

## 📝 **Checklist Day 22**

### Buổi sáng:
- [ ] Exercise 1.1: Understanding Kafka
- [ ] Exercise 1.2: Kafka Setup with Docker
- [ ] Exercise 1.3: Test Producer/Consumer with CLI
- [ ] Exercise 2.1: Spring Kafka Dependencies & Configuration
- [ ] Exercise 2.2: KafkaTemplate - Producer
- [ ] Exercise 2.3: @KafkaListener - Consumer
- [ ] Exercise 3: Practice - Send/Receive Messages

### Buổi tối:
- [ ] Exercise 4.1: Event-Driven Architecture Concepts
- [ ] Exercise 4.2: Event Design
- [ ] Exercise 4.3: Event Handlers
- [ ] Exercise 5.1: Docker Compose Setup
- [ ] Exercise 5.2: Create Topics
- [ ] Exercise 5.3: Configure Services
- [ ] Test: Verify Kafka connection
- [ ] Test: Send and receive test messages

---

## 💡 **Tips**

1. Kafka Best Practices:
   - ✅ Use appropriate number of partitions (3-5 for most cases)
   - ✅ Use consumer groups for parallel processing
   - ✅ Handle errors and retries
   - ✅ Use idempotent producers

2. Event Design:
   - ✅ Make events immutable
   - ✅ Include all necessary data
   - ✅ Use versioning for events
   - ✅ Document event schemas

3. Performance:
   - ✅ Batch messages when possible
   - ✅ Use compression
   - ✅ Monitor consumer lag
   - ✅ Tune producer/consumer settings

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 22, bạn nên:
- ✅ Hiểu Kafka concepts (topics, partitions, producers, consumers)
- ✅ Setup Kafka với Docker
- ✅ Sử dụng KafkaTemplate để send messages
- ✅ Sử dụng @KafkaListener để receive messages
- ✅ Hiểu Event-Driven Architecture
- ✅ Setup Kafka cho Project 2
- ✅ Create topics và test connection

---

## 🔗 **Resources**

- **Apache Kafka**: https://kafka.apache.org/documentation/
- **Spring Kafka**: https://docs.spring.io/spring-kafka/docs/current/reference/html/
- **Event-Driven Architecture**: https://martinfowler.com/articles/201701-event-driven.html

Chúc bạn luyện tập tốt! 🚀
