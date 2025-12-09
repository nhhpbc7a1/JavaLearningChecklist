# 📚 Learning Resources - Week 3-4

## 🎯 Tuần 3-4: Advanced Spring + Microservices

---

## 🔒 Spring Security (Ngày 15-17)

### Official Documentation
- **Spring Security**: https://docs.spring.io/spring-security/reference/
- **Spring Security Reference**: https://spring.io/projects/spring-security

### Video Tutorials
- **Spring Security Tutorial** (Java Brains)
  - YouTube: https://www.youtube.com/playlist?list=PLqq-6Pq4lTTa8V5z4a6By4SFAyfNlR4kP
  - Focus: Authentication, Authorization, JWT

### Key Topics
1. **Authentication**
   - Username/Password authentication
   - JWT (JSON Web Tokens)
   - Token generation và validation
   - Password encoding (BCrypt)

2. **Authorization**
   - Role-based access control (RBAC)
   - Method-level security (`@PreAuthorize`, `@Secured`)
   - Resource-based authorization

3. **Security Configuration**
   - `SecurityFilterChain`
   - CORS configuration
   - CSRF protection

### Practice
- **Spring Boot Guide**: "Securing a Web Application"
- **Baeldung**: Spring Security series

### Libraries
- **JJWT**: https://github.com/jwtk/jjwt (JWT library)
- **BCrypt**: Built-in với Spring Security

---

## 📊 Advanced JPA (Ngày 18-20)

### Official Documentation
- **Spring Data JPA**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/
- **Hibernate**: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/

### Video Tutorials
- **Advanced JPA** (Java Brains)
  - YouTube: Search for "Advanced JPA" tutorials

### Key Topics
1. **Query Methods**
   - Method naming conventions
   - Custom query methods
   - `@Query` với JPQL
   - Native queries

2. **Specifications Pattern**
   - Dynamic queries
   - Complex filtering
   - `JpaSpecificationExecutor`

3. **Pagination & Sorting**
   - `Pageable` interface
   - `Sort` interface
   - Custom pagination

4. **Entity Graphs**
   - `@EntityGraph` annotation
   - Solving N+1 problem
   - Fetch strategies

### Practice
- **Baeldung**: Advanced JPA tutorials
- **Spring Data JPA Examples**: https://github.com/spring-projects/spring-data-examples

### Books
- **"Java Persistence with Spring Data and Hibernate"** - Catalin Tudose

---

## 💾 Caching & Messaging (Ngày 21-23)

### Redis Caching

#### Official Documentation
- **Spring Cache**: https://docs.spring.io/spring-framework/reference/integration/cache.html
- **Redis**: https://redis.io/docs/

#### Video Tutorials
- **Redis Tutorial** (Java Brains hoặc other channels)

#### Key Topics
1. **Spring Cache Abstraction**
   - `@Cacheable`, `@CacheEvict`, `@CachePut`
   - Cache configuration
   - Cache managers

2. **Redis Integration**
   - Redis setup
   - Spring Data Redis
   - RedisTemplate, RedisRepository

#### Practice
- **Spring Boot Guide**: "Caching Data with Spring"
- **Baeldung**: Redis với Spring Boot

### Kafka Integration

#### Official Documentation
- **Spring Kafka**: https://spring.io/projects/spring-kafka
- **Apache Kafka**: https://kafka.apache.org/documentation/

#### Video Tutorials
- **Kafka Tutorial** (Confluent hoặc other channels)

#### Key Topics
1. **Spring Kafka**
   - `@KafkaListener`
   - KafkaTemplate
   - Producer/Consumer configuration

2. **Event-Driven Architecture**
   - Event publishing
   - Event consumption
   - Error handling

#### Practice
- **Spring Boot Guide**: "Messaging with Kafka"
- **Baeldung**: Kafka với Spring Boot

#### Setup
- **Docker Kafka**: `docker-compose` với Kafka và Zookeeper
- **Confluent Platform**: Local development

---

## 🧪 Testing (Ngày 24-28)

### Official Documentation
- **Spring Boot Testing**: https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing
- **JUnit 5**: https://junit.org/junit5/docs/current/user-guide/
- **Mockito**: https://site.mockito.org/

### Video Tutorials
- **JUnit 5 Tutorial** (Java Brains)
- **Mockito Tutorial** (Java Brains)

### Key Topics
1. **Unit Testing**
   - JUnit 5 annotations
   - Assertions
   - Test lifecycle
   - Parameterized tests

2. **Mocking**
   - Mockito basics
   - `@Mock`, `@InjectMocks`
   - `when()`, `verify()`
   - Argument matchers

3. **Integration Testing**
   - `@SpringBootTest`
   - `@WebMvcTest` (Controller tests)
   - `@DataJpaTest` (Repository tests)
   - `@MockMvc` for API testing

4. **Test Containers** (Advanced)
   - Database testing với real DB
   - Integration tests với containers

### Practice
- **Spring Boot Guide**: "Testing the Web Layer"
- **Baeldung**: Testing series

### Tools
- **JUnit 5**: Testing framework
- **Mockito**: Mocking framework
- **AssertJ**: Fluent assertions
- **Testcontainers**: Integration testing

---

## 🏗️ Microservices Architecture (Project 2)

### Official Documentation
- **Spring Cloud**: https://spring.io/projects/spring-cloud
- **Microservices Patterns**: https://microservices.io/patterns/

### Video Tutorials
- **Microservices with Spring Boot** (Java Brains)
  - YouTube: Search for "Spring Cloud" tutorials

### Key Topics
1. **Service Discovery**
   - Eureka Server/Client
   - Consul
   - Service registration

2. **API Gateway**
   - Spring Cloud Gateway
   - Routing, Filtering
   - Load balancing

3. **Configuration Management**
   - Spring Cloud Config
   - Centralized configuration
   - Environment-specific configs

4. **Inter-Service Communication**
   - RestTemplate
   - WebClient (Reactive)
   - Feign Client

5. **Distributed Tracing**
   - Spring Cloud Sleuth
   - Zipkin

### Practice
- **Spring Cloud Guides**: https://spring.io/guides#cloud
- **Baeldung**: Microservices tutorials

### Books
- **"Microservices Patterns"** - Chris Richardson
- **"Building Microservices"** - Sam Newman

---

## 🛠️ Tools & Setup

### Docker
- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- **Docker Compose**: For multi-container apps
- **Docker Tutorial**: https://docs.docker.com/get-started/

### Kafka Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    # ...
  kafka:
    image: confluentinc/cp-kafka:latest
    # ...
```

### Redis Setup
```bash
docker run -d -p 6379:6379 redis:latest
```

### Testing Tools
- **Postman**: API testing
- **JMeter**: Load testing (optional)
- **Testcontainers**: Integration testing

---

## 📝 Cheat Sheets

### Spring Security
```java
@EnableWebSecurity
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) { }
}
```

### JPA Specifications
```java
public class TaskSpecifications {
    public static Specification<Task> hasStatus(String status) {
        return (root, query, cb) -> 
            cb.equal(root.get("status"), status);
    }
}
```

### Spring Cache
```java
@Cacheable(value = "tasks", key = "#id")
public Task findById(Long id) { }

@CacheEvict(value = "tasks", key = "#id")
public void deleteById(Long id) { }
```

### Kafka
```java
@KafkaListener(topics = "task-events")
public void handleTaskEvent(TaskEvent event) { }

kafkaTemplate.send("task-events", event);
```

---

## 🔗 Useful Links

### Documentation
- Spring Cloud: https://spring.io/projects/spring-cloud
- Spring Security: https://spring.io/projects/spring-security
- Spring Kafka: https://spring.io/projects/spring-kafka
- Redis: https://redis.io/docs/
- Kafka: https://kafka.apache.org/documentation/

### Tutorials
- Baeldung: Comprehensive Spring tutorials
- Spring Guides: Official guides
- Microservices.io: Patterns và best practices

### Communities
- Stack Overflow: Tag `spring-cloud`, `spring-security`
- Reddit: r/SpringBoot, r/microservices

---

## 📚 Recommended Reading Order

1. **Week 3, Day 15-17**: Spring Security, JWT
2. **Week 3, Day 18-20**: Advanced JPA
3. **Week 3, Day 21-23**: Caching (Redis), Messaging (Kafka)
4. **Week 4, Day 24-28**: Testing (JUnit, Mockito)
5. **Week 4**: Project 2 - Microservices

---

## 💡 Tips

1. **Security First**: Implement security từ đầu, không để sau
2. **Test Coverage**: Aim for >80% coverage
3. **Microservices**: Start simple, add complexity gradually
4. **Docker**: Use Docker cho local development
5. **Documentation**: Document microservices architecture

---

## ✅ Week 3-4 Goals

By the end of Week 4, bạn nên:
- ✅ Implement authentication/authorization với JWT
- ✅ Sử dụng advanced JPA features
- ✅ Integrate Redis caching
- ✅ Integrate Kafka messaging
- ✅ Write comprehensive tests
- ✅ Hoàn thành Project 2 (Microservices)

---

**Keep Learning! 🚀**

