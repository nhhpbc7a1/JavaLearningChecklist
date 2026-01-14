## 📅 Kế hoạch luyện tập Day 40

### **Buổi sáng (4h): Project 3 - CI/CD Pipeline**

---

## 🎯 **Exercise 1: Project 3 - CI/CD Pipeline** (4h)

**Mục tiêu:** Setup GitHub Actions

**Yêu cầu:**

### **1.1 CI Pipeline**
1. .github/workflows/ci.yml:
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
      - run: mvn clean test
      - run: mvn jacoco:report
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

### **1.2 CD Pipeline**
1. Deployment workflow:
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
      - name: Deploy backend
        run: |
          # Deployment commands
      - name: Deploy frontend
        run: |
          # Deployment commands
```

---

### **Buổi tối (4h): Project 3 - Docker & Deployment**

---

## 🎯 **Exercise 2: Project 3 - Docker & Deployment** (4h)

**Mục tiêu:** Dockerize, deploy to cloud

**Yêu cầu:**

### **2.1 Dockerize Application**
1. Backend Dockerfile
2. Frontend Dockerfile
3. Docker Compose setup

### **2.2 Deploy to Cloud**
1. Deploy backend
2. Deploy frontend
3. Configure environment variables
4. Test deployed application

---

## 📝 **Checklist Day 40**

### Buổi sáng:
- [ ] Exercise 1: Project 3 - CI/CD Pipeline
- [ ] Setup: CI pipeline
- [ ] Setup: CD pipeline

### Buổi tối:
- [ ] Exercise 2: Project 3 - Docker & Deployment
- [ ] Dockerize: Backend
- [ ] Dockerize: Frontend
- [ ] Deploy: To cloud

---

## 💡 **Tips**

1. CI/CD:
   - ✅ Run tests on every push
   - ✅ Deploy automatically
   - ✅ Use environment-specific configs

2. Deployment:
   - ✅ Test in staging first
   - ✅ Monitor after deployment
   - ✅ Have rollback plan

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 40, bạn nên:
- ✅ Setup CI/CD pipeline
- ✅ Dockerize application
- ✅ Deploy to cloud

---

## 🔗 **Resources**

- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker**: https://docs.docker.com/

Chúc bạn luyện tập tốt! 🚀
