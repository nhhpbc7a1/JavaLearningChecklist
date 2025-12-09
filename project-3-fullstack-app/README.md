# 🌐 Project 3: Full-Stack Application

## 🎯 Mục tiêu

Xây dựng ứng dụng **full-stack** hoàn chỉnh với **Spring Boot backend** và **React.js frontend**, deploy lên cloud với CI/CD pipeline.

## ⏱️ Thời gian

**2 tuần** (buổi tối 4h/ngày = 56 giờ)

---

## 📋 Overview

Ứng dụng full-stack với:
- **Backend**: Spring Boot REST API
- **Frontend**: React.js với modern UI
- **Database**: PostgreSQL
- **Caching**: Redis
- **CI/CD**: GitHub Actions
- **Deployment**: Render/AWS/GCP
- **Monitoring**: Spring Boot Actuator

---

## 🏗️ Architecture

```
┌─────────────┐
│   React.js  │  (Frontend)
│   Frontend  │
└──────┬──────┘
       │ HTTP/REST
       │
┌──────▼──────┐
│ Spring Boot │  (Backend API)
│   Service   │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──┐
│PostgreSQL│ │Redis│
│ Database │ │Cache│
└─────────┘ └─────┘
```

---

## 📝 Requirements

Xem chi tiết trong `requirements.md`

### Core Features
1. ✅ User Authentication (JWT)
2. ✅ CRUD Operations
3. ✅ Search & Filter
4. ✅ File Upload (optional)
5. ✅ Real-time Updates (WebSocket, optional)
6. ✅ Responsive UI
7. ✅ API Documentation

### Technical Stack

**Backend:**
- Spring Boot 3.x
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Redis
- Swagger/OpenAPI

**Frontend:**
- React.js 18+
- React Router
- Axios/Fetch
- Bootstrap/Tailwind CSS
- State Management (Context API/Redux)

**DevOps:**
- Docker
- GitHub Actions
- Cloud Deployment

---

## 🚀 Setup Guide

Xem chi tiết trong `setup-guide.md`

### Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Swagger: http://localhost:8080/swagger-ui.html

---

## ✅ Best Practices Checklist

Xem chi tiết trong `../best-practices/checklist-project-3.md`

---

## 📚 Learning Resources

Xem `../learning-resources/week-5-6-resources.md`

---

## 🎯 Milestones

### Week 5
- [ ] Day 29-31: Design patterns, Clean code
- [ ] Day 32-34: Build tools, Logging, Monitoring
- [ ] Day 35-37: Backend implementation

### Week 6
- [ ] Day 38-40: Frontend implementation
- [ ] Day 41-42: CI/CD, Docker, Deployment

---

## 🔍 Key Learning Points

1. **Full-Stack Development**
   - Frontend-backend integration
   - API design
   - State management

2. **DevOps**
   - CI/CD pipelines
   - Docker containerization
   - Cloud deployment

3. **Production-Ready**
   - Monitoring
   - Logging
   - Error handling
   - Performance optimization

---

**Full-stack mastery! 🚀**

