## 📅 Kế hoạch luyện tập Day 35

### **Buổi sáng (4h): GitHub Actions & CI Pipeline**

---

## 🎯 **Exercise 1: GitHub Actions Basics** (2h)

**Mục tiêu:** Workflow files, jobs, steps

**Yêu cầu:**

### **1.1 Create Workflow**
1. .github/workflows/ci.yml:
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Build with Maven
      run: mvn clean package
    
    - name: Run tests
      run: mvn test
```

### **1.2 Multi-Job Workflow**
1. Build and test:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
      - run: mvn clean package
  
  test:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
      - run: mvn test
```

---

## 🎯 **Exercise 2: CI Pipeline Setup** (2h)

**Mục tiêu:** Build, test, quality checks

**Yêu cầu:**

### **2.1 Complete CI Pipeline**
1. Full pipeline:
```yaml
name: CI Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Cache Maven dependencies
      uses: actions/cache@v3
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    
    - name: Build
      run: mvn clean compile
    
    - name: Run tests
      run: mvn test
    
    - name: Generate test coverage
      run: mvn jacoco:report
    
    - name: Check coverage
      run: mvn jacoco:check
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./target/site/jacoco/jacoco.xml
```

---

### **Buổi tối (4h): Docker Basics**

---

## 🎯 **Exercise 3: Docker Basics** (2h)

**Mục tiêu:** Dockerfile, images, containers

**Yêu cầu:**

### **3.1 Create Dockerfile**
1. Dockerfile:
```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### **3.2 Build and Run**
1. Build image:
```bash
docker build -t product-service:latest .
```

2. Run container:
```bash
docker run -p 8080:8080 product-service:latest
```

---

## 🎯 **Exercise 4: Practice - Dockerize Application** (2h)

**Mục tiêu:** Create Dockerfile, build image

**Yêu cầu:**

1. Create Dockerfile for your application
2. Build Docker image
3. Run container
4. Test application in container

---

## 📝 **Checklist Day 35**

### Buổi sáng:
- [ ] Exercise 1.1: Create Workflow
- [ ] Exercise 1.2: Multi-Job Workflow
- [ ] Exercise 2.1: Complete CI Pipeline

### Buổi tối:
- [ ] Exercise 3.1: Create Dockerfile
- [ ] Exercise 3.2: Build and Run
- [ ] Exercise 4: Practice - Dockerize Application

---

## 💡 **Tips**

1. GitHub Actions:
   - ✅ Cache dependencies
   - ✅ Run tests in parallel
   - ✅ Check code quality
   - ✅ Generate reports

2. Docker:
   - ✅ Use multi-stage builds
   - ✅ Use .dockerignore
   - ✅ Optimize image size

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 35, bạn nên:
- ✅ Create GitHub Actions workflows
- ✅ Setup CI pipeline
- ✅ Create Dockerfile
- ✅ Build Docker images

---

## 🔗 **Resources**

- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker**: https://docs.docker.com/

Chúc bạn luyện tập tốt! 🚀
