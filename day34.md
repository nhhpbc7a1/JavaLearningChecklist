## 📅 Kế hoạch luyện tập Day 34

### **Buổi sáng (4h): Spring Boot Actuator & Monitoring**

---

## 🎯 **Exercise 1: Spring Boot Actuator** (2h)

**Mục tiêu:** Health checks, metrics, endpoints

**Yêu cầu:**

### **1.1 Actuator Setup**
1. Add dependency:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

2. Configuration:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

### **1.2 Health Endpoints**
1. Custom health indicator:
```java
@Component
public class DatabaseHealthIndicator implements HealthIndicator {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public Health health() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(1)) {
                return Health.up()
                        .withDetail("database", "Available")
                        .build();
            }
        } catch (SQLException e) {
            return Health.down()
                    .withDetail("database", "Unavailable")
                    .withException(e)
                    .build();
        }
        return Health.down().build();
    }
}
```

### **1.3 Custom Metrics**
1. Add custom metrics:
```java
@Service
public class ProductService {
    
    @Autowired
    private MeterRegistry meterRegistry;
    
    public ProductResponse createProduct(CreateProductRequest request) {
        Counter counter = Counter.builder("products.created")
                .description("Number of products created")
                .register(meterRegistry);
        counter.increment();
        
        // Create product logic
    }
}
```

---

## 🎯 **Exercise 2: Monitoring & Metrics** (2h)

**Mục tiêu:** Prometheus, Grafana basics

**Yêu cầu:**

### **2.1 Prometheus Setup**
1. Add dependency:
```xml
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

2. Access metrics:
```
http://localhost:8080/actuator/prometheus
```

### **2.2 Grafana Dashboard**
1. Setup Grafana
2. Create dashboard
3. Visualize metrics

---

### **Buổi tối (4h): Project 3 Setup**

---

## 🎯 **Exercise 3: Project 3 - Setup & Planning** (1h)

**Mục tiêu:** Plan full-stack application

**Yêu cầu:**

1. Plan features:
   - User authentication
   - Product catalog
   - Shopping cart
   - Order management
   - Payment integration

2. Plan architecture:
   - Backend: Spring Boot
   - Frontend: React.js
   - Database: PostgreSQL
   - Cache: Redis

---

## 🎯 **Exercise 4: Project 3 - Backend Setup** (3h)

**Mục tiêu:** Create Spring Boot backend

**Yêu cầu:**

1. Create Spring Boot project
2. Setup database
3. Create entities
4. Create repositories
5. Create services
6. Create controllers
7. Setup security
8. Configure CORS

---

## 📝 **Checklist Day 34**

### Buổi sáng:
- [ ] Exercise 1.1: Actuator Setup
- [ ] Exercise 1.2: Health Endpoints
- [ ] Exercise 1.3: Custom Metrics
- [ ] Exercise 2.1: Prometheus Setup
- [ ] Exercise 2.2: Grafana Dashboard

### Buổi tối:
- [ ] Exercise 3: Project 3 - Setup & Planning
- [ ] Exercise 4: Project 3 - Backend Setup

---

## 💡 **Tips**

1. Actuator:
   - ✅ Expose only necessary endpoints
   - ✅ Secure actuator endpoints
   - ✅ Use custom health indicators

2. Monitoring:
   - ✅ Monitor key metrics
   - ✅ Set up alerts
   - ✅ Use dashboards

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 34, bạn nên:
- ✅ Setup Spring Boot Actuator
- ✅ Create custom health indicators
- ✅ Add custom metrics
- ✅ Setup Prometheus
- ✅ Plan Project 3
- ✅ Setup Project 3 backend

---

## 🔗 **Resources**

- **Spring Boot Actuator**: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
- **Prometheus**: https://prometheus.io/
- **Grafana**: https://grafana.com/

Chúc bạn luyện tập tốt! 🚀
