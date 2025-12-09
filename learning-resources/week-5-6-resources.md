# 📚 Learning Resources - Week 5-6

## 🎯 Tuần 5-6: Production-Ready Features

---

## 🎨 Design Patterns (Ngày 29-31)

### Official Documentation
- **Design Patterns**: https://refactoring.guru/design-patterns
- **Java Design Patterns**: https://www.javatpoint.com/design-patterns-in-java

### Video Tutorials
- **Design Patterns** (Derek Banas hoặc other channels)
- **Java Design Patterns** (Java Brains)

### Key Patterns for Spring Boot

1. **Repository Pattern**
   - Data access abstraction
   - Spring Data JPA implementation
   - Custom repositories

2. **Service Layer Pattern**
   - Business logic separation
   - Transaction management
   - Service interfaces

3. **Factory Pattern**
   - Object creation
   - Spring `@Bean` factories
   - Builder pattern

4. **Strategy Pattern**
   - Algorithm selection
   - Payment processing example
   - Policy pattern

5. **Observer Pattern**
   - Event-driven architecture
   - Spring Events (`@EventListener`)

### Practice
- **Refactoring Guru**: Interactive design patterns
- **Head First Design Patterns** book exercises

### Books
- **"Head First Design Patterns"** - Eric Freeman
- **"Design Patterns: Elements of Reusable OO Software"** - Gang of Four

---

## 🧹 Clean Code & SOLID (Ngày 32-34)

### Official Documentation
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID
- **Clean Code**: https://github.com/ryanmcdermott/clean-code-javascript (concepts apply to Java)

### Video Tutorials
- **Clean Code** (Uncle Bob - Robert C. Martin)
- **SOLID Principles** (various channels)

### Key Topics

1. **SOLID Principles**
   - **S**ingle Responsibility Principle
   - **O**pen/Closed Principle
   - **L**iskov Substitution Principle
   - **I**nterface Segregation Principle
   - **D**ependency Inversion Principle

2. **Clean Code Practices**
   - Meaningful names
   - Small functions
   - No comments (self-documenting code)
   - Error handling
   - Formatting

3. **Refactoring Techniques**
   - Extract method
   - Extract class
   - Rename variable
   - Remove duplication

### Practice
- **Refactor existing code**: Apply SOLID principles
- **Code reviews**: Review và improve code

### Books
- **"Clean Code"** - Robert C. Martin (Must read!)
- **"Refactoring"** - Martin Fowler

---

## 🔧 Build Tools & DevOps (Ngày 35-37)

### Maven

#### Official Documentation
- **Maven Guide**: https://maven.apache.org/guides/
- **Maven Getting Started**: https://maven.apache.org/guides/getting-started/

#### Key Topics
1. **POM Structure**
   - Dependencies management
   - Plugins configuration
   - Profiles

2. **Maven Lifecycle**
   - `clean`, `compile`, `test`, `package`, `install`, `deploy`

3. **Advanced Features**
   - Multi-module projects
   - Dependency scopes
   - Build profiles

### Gradle

#### Official Documentation
- **Gradle User Guide**: https://docs.gradle.org/current/userguide/userguide.html

#### Key Topics
1. **Build Scripts**
   - `build.gradle` structure
   - Dependencies
   - Tasks

2. **Gradle vs Maven**
   - When to use which
   - Migration

### Logging

#### Official Documentation
- **SLF4J**: http://www.slf4j.org/
- **Logback**: http://logback.qos.ch/

#### Key Topics
1. **Logging Frameworks**
   - SLF4J (abstraction)
   - Logback (implementation)
   - Log4j2 (alternative)

2. **Logging Best Practices**
   - Log levels (DEBUG, INFO, WARN, ERROR)
   - Structured logging
   - Log aggregation

3. **Configuration**
   - `logback-spring.xml`
   - Environment-specific logging

### Monitoring

#### Official Documentation
- **Spring Boot Actuator**: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
- **Micrometer**: https://micrometer.io/

#### Key Topics
1. **Actuator Endpoints**
   - `/actuator/health`
   - `/actuator/info`
   - `/actuator/metrics`
   - Custom endpoints

2. **Monitoring**
   - Prometheus integration
   - Grafana dashboards
   - Application metrics

### Practice
- **Maven Tutorial**: Build multi-module project
- **Logging**: Implement structured logging
- **Actuator**: Add monitoring endpoints

---

## 🚀 CI/CD & Deployment (Ngày 38-42)

### GitHub Actions

#### Official Documentation
- **GitHub Actions**: https://docs.github.com/en/actions
- **GitHub Actions for Java**: https://docs.github.com/en/actions/guides/building-and-testing-java-with-maven

#### Key Topics
1. **Workflow Files**
   - `.github/workflows/ci.yml`
   - Triggers (push, pull_request)
   - Jobs và steps

2. **CI Pipeline**
   - Build
   - Test
   - Code quality checks
   - Artifact publishing

3. **CD Pipeline**
   - Deployment to staging
   - Deployment to production
   - Rollback strategies

#### Example Workflow
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build
        run: ./mvnw clean package
      - name: Test
        run: ./mvnw test
```

### Docker

#### Official Documentation
- **Docker Documentation**: https://docs.docker.com/
- **Dockerfile Best Practices**: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/

#### Key Topics
1. **Dockerfile**
   - Multi-stage builds
   - Layer caching
   - Security best practices

2. **Docker Compose**
   - Multi-container applications
   - Networking
   - Volumes

3. **Docker Images**
   - Base images
   - Image optimization
   - Image scanning

#### Example Dockerfile
```dockerfile
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Cloud Deployment

#### Render
- **Render Documentation**: https://render.com/docs
- **Deploy Spring Boot**: https://render.com/docs/deploy-spring-boot

#### AWS (Optional)
- **AWS Elastic Beanstalk**: https://aws.amazon.com/elasticbeanstalk/
- **AWS ECS**: https://aws.amazon.com/ecs/

#### Google Cloud (Optional)
- **Cloud Run**: https://cloud.google.com/run
- **App Engine**: https://cloud.google.com/appengine

### Practice
- **Setup CI/CD**: GitHub Actions workflow
- **Dockerize Application**: Create Dockerfile
- **Deploy to Cloud**: Deploy to Render/AWS

---

## 📝 Cheat Sheets

### Maven Commands
```bash
mvn clean                    # Clean build
mvn compile                  # Compile
mvn test                     # Run tests
mvn package                  # Create JAR
mvn install                  # Install to local repo
mvn spring-boot:run          # Run Spring Boot app
```

### Gradle Commands
```bash
./gradlew clean              # Clean build
./gradlew build              # Build
./gradlew test               # Run tests
./gradlew bootRun            # Run Spring Boot app
```

### Docker Commands
```bash
docker build -t myapp .      # Build image
docker run -p 8080:8080 myapp  # Run container
docker-compose up            # Start services
docker-compose down          # Stop services
```

### Logging Levels
```
DEBUG: Detailed information
INFO:  General information
WARN:  Warning messages
ERROR: Error messages
```

---

## 🔗 Useful Links

### Documentation
- Maven: https://maven.apache.org/
- Gradle: https://gradle.org/
- Docker: https://docs.docker.com/
- GitHub Actions: https://docs.github.com/en/actions
- Spring Boot Actuator: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html

### Tutorials
- Baeldung: Build tools, CI/CD tutorials
- Spring Boot Guides: Production-ready features
- Docker Tutorial: https://docs.docker.com/get-started/

### Communities
- Stack Overflow: Tag `maven`, `gradle`, `docker`, `ci-cd`
- Reddit: r/devops, r/docker

---

## 📚 Recommended Reading Order

1. **Week 5, Day 29-31**: Design Patterns
2. **Week 5, Day 32-34**: Clean Code & SOLID
3. **Week 5, Day 35-37**: Build Tools, Logging, Monitoring
4. **Week 6, Day 38-42**: CI/CD, Docker, Deployment
5. **Week 6**: Project 3 - Full-Stack Application

---

## 💡 Tips

1. **Design Patterns**: Học patterns trong context của Spring Boot
2. **Clean Code**: Refactor code thường xuyên
3. **CI/CD**: Setup CI/CD từ đầu
4. **Docker**: Use Docker cho consistency
5. **Monitoring**: Add monitoring trước khi deploy production

---

## ✅ Week 5-6 Goals

By the end of Week 6, bạn nên:
- ✅ Hiểu và áp dụng design patterns
- ✅ Viết clean code theo SOLID principles
- ✅ Sử dụng Maven/Gradle effectively
- ✅ Setup CI/CD pipeline
- ✅ Dockerize applications
- ✅ Deploy to cloud
- ✅ Hoàn thành Project 3 (Full-Stack)

---

## 🎯 Final Checklist

Trước khi kết thúc lộ trình:

- [ ] Tất cả 3 projects hoàn thành
- [ ] Code follow best practices
- [ ] Tests coverage >80%
- [ ] CI/CD pipeline working
- [ ] Applications deployed
- [ ] Documentation complete
- [ ] Portfolio ready

---

**You're almost there! 🚀**

