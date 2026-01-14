## 📅 Kế hoạch luyện tập Day 37

### **Buổi sáng (4h): Cloud Deployment**

---

## 🎯 **Exercise 1: Cloud Deployment - Render** (2h)

**Mục tiêu:** Deploy Spring Boot to Render

**Yêu cầu:**

### **1.1 Render Setup**
1. Create render.yaml:
```yaml
services:
  - type: web
    name: product-service
    env: java
    buildCommand: mvn clean package
    startCommand: java -jar target/*.jar
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: mydb
          property: connectionString
```

2. Deploy:
   - Connect GitHub repository
   - Configure environment variables
   - Deploy application

---

## 🎯 **Exercise 2: Cloud Deployment - AWS (Optional)** (2h)

**Mục tiêu:** Deploy to AWS Elastic Beanstalk

**Yêu cầu:**

1. Setup AWS account
2. Create Elastic Beanstalk application
3. Deploy Spring Boot application
4. Configure environment

---

### **Buổi tối (4h): Project 3 Frontend**

---

## 🎯 **Exercise 3: Project 3 - Frontend Setup** (2h)

**Mục tiêu:** Create React.js frontend

**Yêu cầu:**

1. Create React app:
```bash
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
```

2. Setup project structure
3. Configure routing
4. Setup API client

---

## 🎯 **Exercise 4: Project 3 - Frontend-Backend Integration** (2h)

**Mục tiêu:** Connect React to Spring Boot API

**Yêu cầu:**

1. Create API service:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

2. Create components
3. Connect to backend
4. Test integration

---

## 📝 **Checklist Day 37**

### Buổi sáng:
- [ ] Exercise 1: Cloud Deployment - Render
- [ ] Exercise 2: Cloud Deployment - AWS (Optional)

### Buổi tối:
- [ ] Exercise 3: Project 3 - Frontend Setup
- [ ] Exercise 4: Project 3 - Frontend-Backend Integration

---

## 💡 **Tips**

1. Cloud Deployment:
   - ✅ Configure environment variables
   - ✅ Setup database connections
   - ✅ Monitor application logs

2. Frontend:
   - ✅ Use environment variables for API URL
   - ✅ Handle errors gracefully
   - ✅ Add loading states

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 37, bạn nên:
- ✅ Deploy to cloud
- ✅ Setup React frontend
- ✅ Connect frontend to backend

---

## 🔗 **Resources**

- **Render**: https://render.com/
- **AWS Elastic Beanstalk**: https://aws.amazon.com/elasticbeanstalk/
- **React**: https://react.dev/

Chúc bạn luyện tập tốt! 🚀
