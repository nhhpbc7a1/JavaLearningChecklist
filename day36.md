## 📅 Kế hoạch luyện tập Day 36

### **Buổi sáng (4h): Docker Compose & CD Pipeline**

---

## 🎯 **Exercise 1: Docker Compose** (2h)

**Mục tiêu:** Multi-container applications

**Yêu cầu:**

### **1.1 Docker Compose Setup**
1. docker-compose.yml:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7
    ports:
      - "6379:6379"
  
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb
```

### **1.2 Run with Compose**
1. Commands:
```bash
docker-compose up -d
docker-compose down
docker-compose logs
docker-compose ps
```

---

## 🎯 **Exercise 2: CD Pipeline Setup** (2h)

**Mục tiêu:** Deploy to staging/production

**Yêu cầu:**

### **2.1 Deployment Workflow**
1. .github/workflows/deploy.yml:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t myapp:latest .
      
      - name: Deploy to staging
        run: |
          # Deployment commands
```

---

### **Buổi tối (4h): Project 3 Backend Implementation**

---

## 🎯 **Exercise 3: Project 3 - Backend Implementation** (2h)

**Mục tiêu:** Implement core features

**Yêu cầu:**

1. Implement authentication
2. Implement product management
3. Implement cart functionality
4. Implement order processing

---

## 🎯 **Exercise 4: Project 3 - API Development** (2h)

**Mục tiêu:** REST API endpoints

**Yêu cầu:**

1. Create all API endpoints
2. Add validation
3. Add error handling
4. Test APIs with Postman

---

## 📝 **Checklist Day 36**

### Buổi sáng:
- [ ] Exercise 1.1: Docker Compose Setup
- [ ] Exercise 1.2: Run with Compose
- [ ] Exercise 2.1: Deployment Workflow

### Buổi tối:
- [ ] Exercise 3: Project 3 - Backend Implementation
- [ ] Exercise 4: Project 3 - API Development

---

## 💡 **Tips**

1. Docker Compose:
   - ✅ Use depends_on for service order
   - ✅ Configure networks
   - ✅ Use volumes for persistence

2. CD Pipeline:
   - ✅ Deploy to staging first
   - ✅ Run smoke tests
   - ✅ Deploy to production

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 36, bạn nên:
- ✅ Use Docker Compose
- ✅ Setup CD pipeline
- ✅ Implement Project 3 backend
- ✅ Develop REST APIs

---

## 🔗 **Resources**

- **Docker Compose**: https://docs.docker.com/compose/
- **GitHub Actions**: https://docs.github.com/en/actions

Chúc bạn luyện tập tốt! 🚀
