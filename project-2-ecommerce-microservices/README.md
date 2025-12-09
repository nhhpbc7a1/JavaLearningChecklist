# 🛒 Project 2: E-Commerce Microservices

## 🎯 Mục tiêu

Xây dựng hệ thống E-Commerce với **microservices architecture** sử dụng **Spring Boot**, **Spring Cloud**, **Kafka**, và **Redis**.

## ⏱️ Thời gian

**2 tuần** (buổi tối 4h/ngày = 56 giờ)

---

## 📋 Overview

Hệ thống E-Commerce với các microservices:
1. **User Service**: User management, authentication
2. **Product Service**: Product catalog, inventory
3. **Order Service**: Order processing
4. **Payment Service**: Payment processing
5. **Notification Service**: Email/SMS notifications
6. **API Gateway**: Centralized entry point
7. **Service Discovery**: Eureka/Consul

---

## 🏗️ Architecture

```
                    ┌─────────────┐
                    │  API Gateway │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐    ┌─────▼─────┐
   │  User   │      │   Product   │    │   Order   │
   │ Service │      │   Service   │    │  Service  │
   └────┬────┘      └──────┬──────┘    └─────┬─────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼──────┐
                    │    Kafka     │
                    │  (Events)    │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌──────▼──────┐    ┌─────▼─────┐
   │ Payment │      │Notification │    │   Redis   │
   │ Service │      │   Service   │    │  (Cache)  │
   └─────────┘      └─────────────┘    └───────────┘
```

---

## 📝 Requirements

Xem chi tiết trong `requirements.md`

### Core Features
1. ✅ User Service: Registration, Login, Profile
2. ✅ Product Service: Product CRUD, Search, Inventory
3. ✅ Order Service: Create Order, Order History
4. ✅ Payment Service: Process Payment
5. ✅ Notification Service: Send notifications
6. ✅ API Gateway: Routing, Authentication
7. ✅ Service Discovery: Eureka Server

### Technical Requirements
- Spring Boot 3.x
- Spring Cloud (Gateway, Eureka, Config)
- Kafka for messaging
- Redis for caching
- PostgreSQL databases (per service)
- Docker & Docker Compose
- Inter-service communication
- Distributed tracing

---

## 🚀 Setup Guide

Xem chi tiết trong `setup-guide.md`

### Quick Start

1. **Start Infrastructure**
   ```bash
   docker-compose up -d
   # Starts: PostgreSQL, Redis, Kafka, Zookeeper, Eureka
   ```

2. **Start Services** (in order)
   - Eureka Server
   - API Gateway
   - User Service
   - Product Service
   - Order Service
   - Payment Service
   - Notification Service

3. **Access Services**
   - API Gateway: http://localhost:8080
   - Eureka Dashboard: http://localhost:8761
   - Swagger: http://localhost:8080/swagger-ui.html

---

## ✅ Best Practices Checklist

Xem chi tiết trong `../best-practices/checklist-project-2.md`

---

## 📚 Learning Resources

Xem `../learning-resources/week-3-4-resources.md`

---

## 🎯 Milestones

### Week 3
- [ ] Day 15-17: Setup infrastructure, User Service với Security
- [ ] Day 18-20: Product Service với Advanced JPA
- [ ] Day 21-23: Kafka integration, Redis caching

### Week 4
- [ ] Day 24-26: Order Service, Payment Service
- [ ] Day 27-28: API Gateway, Service Discovery, Testing

---

## 🔍 Key Learning Points

1. **Microservices Patterns**
   - Service discovery
   - API Gateway pattern
   - Database per service
   - Event-driven architecture

2. **Spring Cloud**
   - Eureka for service discovery
   - Spring Cloud Gateway
   - Spring Cloud Config
   - Spring Cloud Sleuth

3. **Distributed Systems**
   - Eventual consistency
   - Saga pattern
   - Circuit breaker
   - Distributed tracing

---

**Let's build microservices! 🚀**

