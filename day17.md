Đang kiểm tra nội dung buổi tối Day 17:


[7 tools called]


Kế hoạch buổi tối Day 17 - Project 2: Setup Microservices & User Service với Security:

## 📅 Kế hoạch buổi tối Day 17

### **Project 2: E-Commerce Microservices - Setup & User Service**

---

## 🎯 **Exercise 1: Setup Microservices Structure** (2h)

**Mục tiêu:** Tạo cấu trúc microservices và setup Eureka Server

**Yêu cầu:**

### **1.1 Create Parent Project (Multi-Module Maven)**
1. Tạo parent project structure:
```
ecommerce-microservices/
├── pom.xml (parent)
├── eureka-server/
│   ├── pom.xml
│   └── src/
├── api-gateway/
│   ├── pom.xml
│   └── src/
├── user-service/
│   ├── pom.xml
│   └── src/
├── product-service/
│   ├── pom.xml
│   └── src/
├── order-service/
│   ├── pom.xml
│   └── src/
├── payment-service/
│   ├── pom.xml
│   └── src/
└── notification-service/
    ├── pom.xml
    └── src/
```

2. Parent `pom.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.ecommerce</groupId>
    <artifactId>ecommerce-microservices</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>
    
    <name>E-Commerce Microservices</name>
    <description>E-Commerce system with microservices architecture</description>
    
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.2.0</spring-boot.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
    
    <modules>
        <module>eureka-server</module>
        <module>api-gateway</module>
        <module>user-service</module>
        <module>product-service</module>
        <module>order-service</module>
        <module>payment-service</module>
        <module>notification-service</module>
    </modules>
    
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot BOM -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            
            <!-- Spring Cloud BOM -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                    <version>${spring-boot.version}</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

### **1.2 Setup Eureka Server**
1. Eureka Server `pom.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.ecommerce</groupId>
        <artifactId>ecommerce-microservices</artifactId>
        <version>1.0.0</version>
    </parent>
    
    <artifactId>eureka-server</artifactId>
    <packaging>jar</packaging>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

2. Eureka Server Application:
```java
package com.ecommerce.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

3. `application.yml`:
```yaml
server:
  port: 8761

spring:
  application:
    name: eureka-server

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false  # Eureka server không tự register
    fetch-registry: false         # Eureka server không fetch registry
    service-url:
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```

### **1.3 Setup User Service Structure**
1. User Service `pom.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>com.ecommerce</groupId>
        <artifactId>ecommerce-microservices</artifactId>
        <version>1.0.0</version>
    </parent>
    
    <artifactId>user-service</artifactId>
    <packaging>jar</packaging>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

2. User Service Application:
```java
package com.ecommerce.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
```

3. User Service `application.yml`:
```yaml
server:
  port: 8081

spring:
  application:
    name: user-service
  datasource:
    url: jdbc:postgresql://localhost:5432/user_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true

jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400000 # 24 hours in milliseconds
```

### **1.4 Create Database**
1. Tạo PostgreSQL database:
```sql
CREATE DATABASE user_db;
```

---

## 🎯 **Exercise 2: User Service with JWT Authentication** (2h)

**Mục tiêu:** Implement User Service với JWT authentication

**Yêu cầu:**

### **2.1 Entity & Repository**
1. User Entity:
```java
package com.ecommerce.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String fullName;
    
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

enum UserRole {
    USER, ADMIN
}
```

2. User Repository:
```java
package com.ecommerce.user.repository;

import com.ecommerce.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
```

### **2.2 JWT Utilities**
1. JWT Service:
```java
package com.ecommerce.user.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username);
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}
```

### **2.3 DTOs**
1. Request/Response DTOs:
```java
package com.ecommerce.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    private String fullName;
    private String phone;
}

@Data
public class LoginRequest {
    @NotBlank(message = "Username is required")
    private String username;
    
    @NotBlank(message = "Password is required")
    private String password;
}

@Data
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private String role;
}

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
}
```

### **2.4 Service Layer**
1. User Service:
```java
package com.ecommerce.user.service;

import com.ecommerce.user.dto.*;
import com.ecommerce.user.entity.User;
import com.ecommerce.user.entity.UserRole;
import com.ecommerce.user.repository.UserRepository;
import com.ecommerce.user.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.USER);
        user.setEnabled(true);
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(savedUser.getUsername(), savedUser.getRole().name());
        
        // Build response
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(savedUser.getId());
        response.setUsername(savedUser.getUsername());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().name());
        
        return response;
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        
        // Check if user is enabled
        if (!user.getEnabled()) {
            throw new RuntimeException("User account is disabled");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        
        // Build response
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        
        return response;
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        
        return response;
    }
    
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        
        return response;
    }
}
```

### **2.5 Security Configuration**
1. Security Config:
```java
package com.ecommerce.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/register", "/api/users/login").permitAll()
                .anyRequest().authenticated()
            );
        
        return http.build();
    }
}
```

### **2.6 Controller**
1. User Controller:
```java
package com.ecommerce.user.controller;

import com.ecommerce.user.dto.*;
import com.ecommerce.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse response = userService.getUserByUsername(username);
        return ResponseEntity.ok(response);
    }
}
```

### **2.7 Enable JPA Auditing**
1. Config:
```java
package com.ecommerce.user.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
}
```

---

## 📝 **Checklist Day 17 - Buổi tối**

- [ ] Exercise 1.1: Create parent project (multi-module Maven)
- [ ] Exercise 1.2: Setup Eureka Server
- [ ] Exercise 1.3: Setup User Service structure
- [ ] Exercise 1.4: Create PostgreSQL database
- [ ] Exercise 2.1: Create User Entity & Repository
- [ ] Exercise 2.2: Implement JWT Service
- [ ] Exercise 2.3: Create DTOs (RegisterRequest, LoginRequest, AuthResponse, UserResponse)
- [ ] Exercise 2.4: Implement User Service (register, login, getUserById)
- [ ] Exercise 2.5: Configure Spring Security
- [ ] Exercise 2.6: Create User Controller
- [ ] Exercise 2.7: Enable JPA Auditing
- [ ] Test: Start Eureka Server (port 8761)
- [ ] Test: Start User Service (port 8081)
- [ ] Test: Register new user via Postman
- [ ] Test: Login and get JWT token
- [ ] Test: Verify user service registered with Eureka

---

## 💡 **Tips**

1. Multi-Module Maven:
   - Parent POM quản lý dependencies chung
   - Mỗi service là một module độc lập
   - Có thể build từng service riêng hoặc build tất cả

2. Eureka Server:
   - Phải start Eureka Server trước
   - Các services sẽ tự động register khi start
   - Access Eureka Dashboard: http://localhost:8761

3. JWT Authentication:
   - Secret key phải đủ dài (ít nhất 256 bits)
   - Token expiration time hợp lý (24h)
   - Không lưu password dạng plain text

4. Service Discovery:
   - Services tự động discover nhau qua Eureka
   - Có thể gọi service bằng tên thay vì IP:Port

---

## 🎯 **Mục tiêu cuối buổi tối**

Sau buổi tối Day 17, bạn nên:
- ✅ Setup được multi-module Maven project
- ✅ Eureka Server chạy và accessible
- ✅ User Service đã register với Eureka
- ✅ User Service có JWT authentication
- ✅ Test được register và login endpoints
- ✅ JWT token được generate và validate

---

## 🔗 **Resources**

- **Spring Cloud Eureka**: https://spring.io/projects/spring-cloud-netflix
- **JWT with Spring Boot**: https://www.baeldung.com/spring-security-jwt
- **Multi-Module Maven**: https://maven.apache.org/guides/mini/guide-multiple-modules.html

Chúc bạn luyện tập tốt.