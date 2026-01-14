## 📅 Kế hoạch luyện tập Day 26

### **Buổi sáng (4h): Service Discovery - Eureka**

---

## 🎯 **Exercise 1: Service Discovery - Eureka** (3h)

**Mục tiêu:** Eureka server, client registration

**Yêu cầu:**

### **1.1 Eureka Server Setup**
1. Create Eureka Server module:
```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
```

2. Eureka Server Application:
```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

3. Application configuration:
```yaml
# application.yml
server:
  port: 8761

spring:
  application:
    name: eureka-server

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```

### **1.2 Eureka Client Setup**
1. Add dependency to services:
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

2. Enable Eureka Client:
```java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

3. Service configuration:
```yaml
# user-service/application.yml
spring:
  application:
    name: user-service

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true
    lease-renewal-interval-in-seconds: 30
    lease-expiration-duration-in-seconds: 90
```

### **1.3 Service Registration**
1. Verify registration:
   - Start Eureka Server
   - Start services
   - Check Eureka Dashboard: http://localhost:8761

2. Service discovery:
```java
@Service
public class OrderService {
    
    @Autowired
    private DiscoveryClient discoveryClient;
    
    public List<ServiceInstance> getInstances(String serviceName) {
        return discoveryClient.getInstances(serviceName);
    }
    
    public String getServiceUrl(String serviceName) {
        List<ServiceInstance> instances = discoveryClient.getInstances(serviceName);
        if (instances.isEmpty()) {
            throw new RuntimeException("Service not found: " + serviceName);
        }
        return instances.get(0).getUri().toString();
    }
}
```

---

## 🎯 **Exercise 2: Practice - Setup Service Discovery** (1h)

**Mục tiêu:** Register services with Eureka

**Yêu cầu:**

1. Register all services:
   - User Service
   - Product Service
   - Order Service
   - Payment Service
   - Notification Service

2. Verify in Eureka Dashboard
3. Test service discovery

---

### **Buổi tối (4h): API Gateway - Spring Cloud Gateway**

---

## 🎯 **Exercise 3: API Gateway - Spring Cloud Gateway** (3h)

**Mục tiêu:** Gateway setup, routing, filtering

**Yêu cầu:**

### **3.1 Gateway Setup**
1. Create API Gateway module:
```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>
```

2. Gateway Application:
```java
@SpringBootApplication
@EnableEurekaClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
```

3. Gateway configuration:
```yaml
# application.yml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=2
        
        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**
          filters:
            - StripPrefix=2
        
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=2
        
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payments/**
          filters:
            - StripPrefix=2

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### **3.2 Custom Filters**
1. Global filter:
```java
@Component
@Slf4j
public class LoggingFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        log.info("Request: {} {}", request.getMethod(), request.getURI());
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            log.info("Response: {}", response.getStatusCode());
        }));
    }
    
    @Override
    public int getOrder() {
        return -1;
    }
}
```

2. Authentication filter:
```java
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        if (request.getURI().getPath().startsWith("/api/auth")) {
            return chain.filter(exchange);
        }
        
        String token = request.getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }
        
        return chain.filter(exchange);
    }
    
    @Override
    public int getOrder() {
        return -2;
    }
}
```

3. Rate limiting filter:
```java
@Component
public class RateLimitFilter implements GlobalFilter, Ordered {
    
    private final Map<String, AtomicInteger> requestCounts = new ConcurrentHashMap<>();
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String clientId = getClientId(exchange.getRequest());
        
        AtomicInteger count = requestCounts.computeIfAbsent(clientId, k -> new AtomicInteger(0));
        if (count.incrementAndGet() > 100) { // 100 requests per minute
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return response.setComplete();
        }
        
        return chain.filter(exchange);
    }
    
    private String getClientId(ServerHttpRequest request) {
        // Extract client ID from request
        return request.getRemoteAddress() != null ? 
            request.getRemoteAddress().getAddress().getHostAddress() : "unknown";
    }
    
    @Override
    public int getOrder() {
        return -3;
    }
}
```

### **3.3 Route Configuration**
1. Programmatic routes:
```java
@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-service", r -> r
                    .path("/api/users/**")
                    .uri("lb://user-service"))
                .route("product-service", r -> r
                    .path("/api/products/**")
                    .filters(f -> f.stripPrefix(2))
                    .uri("lb://product-service"))
                .build();
    }
}
```

---

## 🎯 **Exercise 4: Project 2 - Setup API Gateway** (1h)

**Mục tiêu:** Route requests to services

**Yêu cầu:**

1. Create API Gateway module
2. Configure routes for all services
3. Add authentication filter
4. Add logging filter
5. Test routing through gateway

---

## 📝 **Checklist Day 26**

### Buổi sáng:
- [ ] Exercise 1.1: Eureka Server Setup
- [ ] Exercise 1.2: Eureka Client Setup
- [ ] Exercise 1.3: Service Registration
- [ ] Exercise 2: Practice - Setup Service Discovery

### Buổi tối:
- [ ] Exercise 3.1: Gateway Setup
- [ ] Exercise 3.2: Custom Filters
- [ ] Exercise 3.3: Route Configuration
- [ ] Exercise 4: Project 2 - Setup API Gateway
- [ ] Test: Verify all services registered
- [ ] Test: Route requests through gateway

---

## 💡 **Tips**

1. Eureka:
   - ✅ Use service names consistently
   - ✅ Configure health checks
   - ✅ Monitor service instances
   - ✅ Handle service unavailability

2. API Gateway:
   - ✅ Centralize authentication
   - ✅ Add request/response logging
   - ✅ Implement rate limiting
   - ✅ Handle CORS

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 26, bạn nên:
- ✅ Setup Eureka Server
- ✅ Register services with Eureka
- ✅ Setup Spring Cloud Gateway
- ✅ Configure routes
- ✅ Implement custom filters

---

## 🔗 **Resources**

- **Spring Cloud Eureka**: https://spring.io/projects/spring-cloud-netflix
- **Spring Cloud Gateway**: https://spring.io/projects/spring-cloud-gateway

Chúc bạn luyện tập tốt! 🚀
