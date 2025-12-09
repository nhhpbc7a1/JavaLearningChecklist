# 🚀 Project 1: Setup Guide

## Prerequisites

- ✅ Java 17 hoặc cao hơn
- ✅ Maven 3.6+ hoặc Gradle 7+
- ✅ PostgreSQL 12+
- ✅ IDE: IntelliJ IDEA (recommended) hoặc VS Code
- ✅ Postman hoặc similar tool để test API

---

## Step 1: Tạo Spring Boot Project

### Option 1: Spring Initializr (Recommended)

1. Truy cập: https://start.spring.io/
2. Chọn settings:
   - **Project**: Maven hoặc Gradle
   - **Language**: Java
   - **Spring Boot**: 3.2.x (latest stable)
   - **Packaging**: Jar
   - **Java**: 17 hoặc 21
3. **Dependencies** (Add):
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Boot DevTools
   - Lombok
   - SpringDoc OpenAPI (Swagger)
   - Spring Security (cho authentication)
   - Validation
4. Click **Generate** và download zip
5. Extract và mở trong IDE

### Option 2: Command Line

```bash
# Sử dụng Spring CLI (nếu đã cài)
spring init --dependencies=web,data-jpa,postgresql,devtools,lombok,springdoc-openapi,security,validation task-management-api
```

---

## Step 2: Project Structure

Sau khi tạo project, tạo folder structure:

```
src/main/java/com/taskmanagement/
├── TaskManagementApplication.java (đã có)
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
│   ├── request/
│   └── response/
├── exception/
├── config/
└── util/
```

### Tạo folders trong IDE:
- Right-click `com.taskmanagement` → New → Package
- Tạo từng package như trên

---

## Step 3: Database Setup

### 3.1 Install PostgreSQL

Nếu chưa có PostgreSQL:
- Download: https://www.postgresql.org/download/
- Hoặc dùng Docker:
  ```bash
  docker run --name postgres-task -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_management_db -p 5432:5432 -d postgres:15
  ```

### 3.2 Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE task_management_db;

-- Create user (optional)
CREATE USER task_user WITH PASSWORD 'task_password';
GRANT ALL PRIVILEGES ON DATABASE task_management_db TO task_user;
```

### 3.3 Configure Application

Tạo file `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: task-management-api
  
  datasource:
    url: jdbc:postgresql://localhost:5432/task_management_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Chỉ dùng cho development!
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  # Security (tạm thời disable cho development)
  security:
    user:
      name: admin
      password: admin

# Server
server:
  port: 8080

# Logging
logging:
  level:
    com.taskmanagement: DEBUG
    org.springframework.web: INFO
    org.hibernate.SQL: DEBUG

# Swagger
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
```

**Lưu ý**: 
- `ddl-auto: update` chỉ dùng cho development
- Production nên dùng Flyway/Liquibase cho migrations

---

## Step 4: Dependencies (pom.xml)

Nếu thiếu dependencies, thêm vào `pom.xml`:

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT (sẽ cần sau) -->
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
    
    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
    
    <!-- DevTools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- H2 for testing -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Step 5: First Run

### 5.1 Build Project

```bash
# Maven
./mvnw clean install

# Gradle
./gradlew build
```

### 5.2 Run Application

```bash
# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun

# Hoặc trong IDE: Run TaskManagementApplication.java
```

### 5.3 Verify

- Application chạy trên: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- Health check: http://localhost:8080/actuator/health (nếu có Actuator)

---

## Step 6: Disable Security (Tạm thời cho development)

Tạo file `src/main/java/com/taskmanagement/config/SecurityConfig.java`:

```java
package com.taskmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
```

**Lưu ý**: Đây chỉ là để bắt đầu. Sau đó sẽ implement JWT authentication.

---

## Step 7: Git Setup

### 7.1 Initialize Git

```bash
git init
```

### 7.2 Create .gitignore

```gitignore
# Compiled class file
*.class

# Log file
*.log

# BlueJ files
*.ctxt

# Mobile Tools for Java (J2ME)
.mtj.tmp/

# Package Files
*.jar
*.war
*.nar
*.ear
*.zip
*.tar.gz
*.rar

# Maven
target/
pom.xml.tag
pom.xml.releaseBackup
pom.xml.versionsBackup
pom.xml.next
release.properties
dependency-reduced-pom.xml
buildNumber.properties
.mvn/timing.properties
.mvn/wrapper/maven-wrapper.jar

# Gradle
.gradle
build/
!gradle/wrapper/gradle-wrapper.jar
!**/src/main/**/build/
!**/src/test/**/build/

# IDE
.idea/
*.iws
*.iml
*.ipr
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Application
application-local.properties
application-prod.properties
```

### 7.3 First Commit

```bash
git add .
git commit -m "Initial commit: Spring Boot project setup"
```

---

## Step 8: Verify Setup

Tạo một simple controller để test:

```java
package com.taskmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    
    @GetMapping("/health")
    public String health() {
        return "API is running!";
    }
}
```

Test: http://localhost:8080/api/v1/health

---

## ✅ Checklist

- [ ] Spring Boot project created
- [ ] Dependencies added
- [ ] Database configured
- [ ] Application runs successfully
- [ ] Swagger UI accessible
- [ ] Git initialized
- [ ] Project structure created

---

## 🐛 Troubleshooting

### Port 8080 already in use
```bash
# Change port in application.yml
server:
  port: 8081
```

### Database connection error
- Check PostgreSQL đang chạy: `pg_isready`
- Verify credentials trong `application.yml`
- Check firewall settings

### Lombok not working
- Install Lombok plugin trong IDE
- Enable annotation processing

---

## 🎯 Next Steps

1. ✅ Setup hoàn tất
2. 📖 Đọc `requirements.md`
3. 🏗️ Bắt đầu implement entities
4. ✅ Follow `../best-practices/checklist-project-1.md`

**Ready to code! 🚀**

