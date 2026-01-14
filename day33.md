## 📅 Kế hoạch luyện tập Day 33

### **Buổi sáng (4h): Maven Deep Dive & Gradle Basics**

---

## 🎯 **Exercise 1: Maven Deep Dive** (2h)

**Mục tiêu:** POM structure, lifecycle, plugins

**Yêu cầu:**

### **1.1 POM Structure**
1. Complete POM:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>product-service</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <name>Product Service</name>
    <description>Product management service</description>
    
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.1.0</spring-boot.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
    </parent>
    
    <dependencies>
        <!-- Dependencies -->
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

### **1.2 Maven Lifecycle**
1. Lifecycle phases:
```bash
mvn validate    # Validate project
mvn compile     # Compile source code
mvn test        # Run tests
mvn package     # Package into JAR/WAR
mvn install     # Install to local repository
mvn deploy      # Deploy to remote repository
```

### **1.3 Maven Plugins**
1. Common plugins:
```xml
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <configuration>
            <source>17</source>
            <target>17</target>
        </configuration>
    </plugin>
    
    <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
    </plugin>
</plugins>
```

---

## 🎯 **Exercise 2: Gradle Basics** (2h)

**Mục tiêu:** build.gradle, tasks, dependencies

**Yêu cầu:**

### **2.1 build.gradle**
1. Basic build.gradle:
```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.1.0'
    id 'io.spring.dependency-management' version '1.1.0'
}

group = 'com.example'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### **2.2 Gradle Tasks**
1. Common tasks:
```bash
./gradlew build      # Build project
./gradlew test       # Run tests
./gradlew clean      # Clean build
./gradlew bootRun    # Run Spring Boot app
```

---

### **Buổi tối (4h): Logging - SLF4J & Logback**

---

## 🎯 **Exercise 3: Logging - SLF4J & Logback** (3h)

**Mục tiêu:** Logging configuration, levels

**Yêu cầu:**

### **3.1 Logging Configuration**
1. logback-spring.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/application.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/application-%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="FILE" />
    </root>
    
    <logger name="com.example" level="DEBUG" />
</configuration>
```

### **3.2 Logging Levels**
1. Use logging:
```java
@Slf4j
@Service
public class ProductService {
    
    public ProductResponse createProduct(CreateProductRequest request) {
        log.debug("Creating product: {}", request.getName());
        
        try {
            Product product = productRepository.save(toEntity(request));
            log.info("Product created successfully: id={}, name={}", 
                product.getId(), product.getName());
            return toResponse(product);
        } catch (Exception e) {
            log.error("Failed to create product: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create product", e);
        }
    }
}
```

### **3.3 Structured Logging**
1. JSON logging:
```xml
<encoder class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">
    <providers>
        <timestamp/>
        <version/>
        <logLevel/>
        <message/>
        <mdc/>
        <stackTrace/>
    </providers>
</encoder>
```

---

## 🎯 **Exercise 4: Practice - Configure Logging** (1h)

**Mục tiêu:** Setup structured logging

**Yêu cầu:**

1. Configure logback-spring.xml
2. Add logging to services
3. Use appropriate log levels
4. Test logging output

---

## 📝 **Checklist Day 33**

### Buổi sáng:
- [ ] Exercise 1.1: POM Structure
- [ ] Exercise 1.2: Maven Lifecycle
- [ ] Exercise 1.3: Maven Plugins
- [ ] Exercise 2.1: build.gradle
- [ ] Exercise 2.2: Gradle Tasks

### Buổi tối:
- [ ] Exercise 3.1: Logging Configuration
- [ ] Exercise 3.2: Logging Levels
- [ ] Exercise 3.3: Structured Logging
- [ ] Exercise 4: Practice - Configure Logging

---

## 💡 **Tips**

1. Maven:
   - ✅ Understand POM structure
   - ✅ Use properties for versions
   - ✅ Configure plugins properly

2. Logging:
   - ✅ Use appropriate log levels
   - ✅ Include context in logs
   - ✅ Use structured logging for production

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 33, bạn nên:
- ✅ Hiểu Maven POM structure
- ✅ Sử dụng Maven lifecycle
- ✅ Hiểu Gradle basics
- ✅ Configure logging
- ✅ Use structured logging

---

## 🔗 **Resources**

- **Maven**: https://maven.apache.org/
- **Gradle**: https://gradle.org/
- **Logback**: http://logback.qos.ch/

Chúc bạn luyện tập tốt! 🚀
