// Detailed checklist breakdown by session (morning/evening)
// 6 weeks = 42 days = 84 sessions (morning + evening)
// This file contains all tasks broken down by day and session

var detailedChecklistData = [
    // ========== WEEK 1 ==========
    // Day 1
    { category: 'Week 1 - Day 1', session: 'Morning (4h)', item: 'Setup Java Development Environment', description: 'Install JDK 17+, IntelliJ IDEA, configure IDE', xp: 5, completed: false },
    { category: 'Week 1 - Day 1', session: 'Morning (4h)', item: 'Java Syntax Basics', description: 'Variables, data types, operators, control flow', xp: 10, completed: false },
    { category: 'Week 1 - Day 1', session: 'Morning (4h)', item: 'Practice: Write 5 simple Java programs', description: 'Hello World, calculator, loops, conditionals', xp: 10, completed: false },
    { category: 'Week 1 - Day 1', session: 'Evening (4h)', item: 'OOP Concepts - Classes & Objects', description: 'Create classes, objects, methods, constructors', xp: 15, completed: false },
    { category: 'Week 1 - Day 1', session: 'Evening (4h)', item: 'Practice: Build a simple class hierarchy', description: 'Animal class with Dog, Cat subclasses', xp: 15, completed: false },
    
    // Day 2
    { category: 'Week 1 - Day 2', session: 'Morning (4h)', item: 'OOP - Inheritance & Polymorphism', description: 'extends, super, method overriding, @Override', xp: 15, completed: false },
    { category: 'Week 1 - Day 2', session: 'Morning (4h)', item: 'OOP - Encapsulation & Abstraction', description: 'private, protected, public, abstract classes', xp: 15, completed: false },
    { category: 'Week 1 - Day 2', session: 'Morning (4h)', item: 'Practice: Refactor Day 1 code with OOP', description: 'Apply inheritance and polymorphism', xp: 10, completed: false },
    { category: 'Week 1 - Day 2', session: 'Evening (4h)', item: 'Interfaces & Abstract Classes', description: 'interface keyword, implements, default methods', xp: 15, completed: false },
    { category: 'Week 1 - Day 2', session: 'Evening (4h)', item: 'Practice: LeetCode Easy problems (3 problems)', description: 'Solve using Java OOP concepts', xp: 15, completed: false },
    
    // Day 3
    { category: 'Week 1 - Day 3', session: 'Morning (4h)', item: 'Collections Framework - List', description: 'ArrayList, LinkedList, List operations', xp: 10, completed: false },
    { category: 'Week 1 - Day 3', session: 'Morning (4h)', item: 'Collections Framework - Set', description: 'HashSet, TreeSet, LinkedHashSet', xp: 10, completed: false },
    { category: 'Week 1 - Day 3', session: 'Morning (4h)', item: 'Collections Framework - Map', description: 'HashMap, TreeMap, LinkedHashMap', xp: 10, completed: false },
    { category: 'Week 1 - Day 3', session: 'Evening (4h)', item: 'Practice: Collections exercises', description: 'Manipulate data structures, solve problems', xp: 15, completed: false },
    { category: 'Week 1 - Day 3', session: 'Evening (4h)', item: 'Exception Handling', description: 'try-catch, finally, custom exceptions', xp: 10, completed: false },
    
    // Day 4
    { category: 'Week 1 - Day 4', session: 'Morning (4h)', item: 'Streams API Basics', description: 'filter, map, reduce, collect operations', xp: 15, completed: false },
    { category: 'Week 1 - Day 4', session: 'Morning (4h)', item: 'Lambda Expressions', description: 'Functional interfaces, method references', xp: 15, completed: false },
    { category: 'Week 1 - Day 4', session: 'Morning (4h)', item: 'Practice: Streams exercises', description: 'Process collections with streams', xp: 10, completed: false },
    { category: 'Week 1 - Day 4', session: 'Evening (4h)', item: 'Spring Framework Overview', description: 'What is Spring, Spring modules, benefits', xp: 10, completed: false },
    { category: 'Week 1 - Day 4', session: 'Evening (4h)', item: 'Spring Boot Introduction', description: 'Spring Boot vs Spring, auto-configuration', xp: 10, completed: false },
    { category: 'Week 1 - Day 4', session: 'Evening (4h)', item: 'Create First Spring Boot Project', description: 'Use Spring Initializr, run application', xp: 15, completed: false },
    
    // Day 5
    { category: 'Week 1 - Day 5', session: 'Morning (4h)', item: 'Dependency Injection (DI)', description: '@Autowired, @Component, @Service, @Repository', xp: 15, completed: false },
    { category: 'Week 1 - Day 5', session: 'Morning (4h)', item: 'Inversion of Control (IoC)', description: 'IoC container, bean lifecycle', xp: 15, completed: false },
    { category: 'Week 1 - Day 5', session: 'Morning (4h)', item: 'Practice: Build DI example', description: 'Create services with dependencies', xp: 10, completed: false },
    { category: 'Week 1 - Day 5', session: 'Evening (4h)', item: 'Spring Boot Starters', description: 'spring-boot-starter-web, data-jpa, etc.', xp: 10, completed: false },
    { category: 'Week 1 - Day 5', session: 'Evening (4h)', item: 'Application Properties', description: 'application.properties, application.yml', xp: 10, completed: false },
    { category: 'Week 1 - Day 5', session: 'Evening (4h)', item: 'Practice: Configure Spring Boot app', description: 'Set up properties, profiles', xp: 10, completed: false },
    
    // Day 6
    { category: 'Week 1 - Day 6', session: 'Morning (4h)', item: 'Spring MVC Architecture', description: 'MVC pattern, DispatcherServlet, HandlerMapping', xp: 15, completed: false },
    { category: 'Week 1 - Day 6', session: 'Morning (4h)', item: 'REST Controllers', description: '@RestController, @RequestMapping', xp: 15, completed: false },
    { category: 'Week 1 - Day 6', session: 'Morning (4h)', item: 'Practice: Create simple REST controller', description: 'GET, POST endpoints', xp: 10, completed: false },
    { category: 'Week 1 - Day 6', session: 'Evening (4h)', item: 'Request/Response Handling', description: '@RequestBody, @ResponseBody, ResponseEntity', xp: 15, completed: false },
    { category: 'Week 1 - Day 6', session: 'Evening (4h)', item: 'Path Variables & Query Parameters', description: '@PathVariable, @RequestParam', xp: 10, completed: false },
    { category: 'Week 1 - Day 6', session: 'Evening (4h)', item: 'Practice: Build REST API with 5 endpoints', description: 'CRUD operations', xp: 15, completed: false },
    
    // Day 7
    { category: 'Week 1 - Day 7', session: 'Morning (4h)', item: 'HTTP Methods & Status Codes', description: 'GET, POST, PUT, DELETE, status codes', xp: 10, completed: false },
    { category: 'Week 1 - Day 7', session: 'Morning (4h)', item: 'REST API Best Practices', description: 'Naming conventions, versioning, documentation', xp: 10, completed: false },
    { category: 'Week 1 - Day 7', session: 'Morning (4h)', item: 'Practice: Refactor Day 6 API', description: 'Apply best practices', xp: 10, completed: false },
    { category: 'Week 1 - Day 7', session: 'Evening (4h)', item: 'Project 1: Setup & Planning', description: 'Create project structure, plan features', xp: 10, completed: false },
    { category: 'Week 1 - Day 7', session: 'Evening (4h)', item: 'Project 1: Create Entities', description: 'User, Task, Category entities', xp: 15, completed: false },
    
    // ========== WEEK 2 ==========
    // Day 8
    { category: 'Week 2 - Day 8', session: 'Morning (4h)', item: 'JPA/Hibernate Basics', description: '@Entity, @Table, @Id, @GeneratedValue', xp: 15, completed: false },
    { category: 'Week 2 - Day 8', session: 'Morning (4h)', item: 'Entity Relationships', description: '@OneToMany, @ManyToOne, @ManyToMany', xp: 15, completed: false },
    { category: 'Week 2 - Day 8', session: 'Morning (4h)', item: 'Practice: Create entities with relationships', description: 'Build entity model', xp: 10, completed: false },
    { category: 'Week 2 - Day 8', session: 'Evening (4h)', item: 'Repository Pattern', description: 'JpaRepository, custom query methods', xp: 15, completed: false },
    { category: 'Week 2 - Day 8', session: 'Evening (4h)', item: 'Project 1: Setup Database', description: 'PostgreSQL setup, configure JPA', xp: 10, completed: false },
    
    // Day 9
    { category: 'Week 2 - Day 9', session: 'Morning (4h)', item: 'Database Migrations', description: 'Flyway or Liquibase basics', xp: 10, completed: false },
    { category: 'Week 2 - Day 9', session: 'Morning (4h)', item: 'CRUD Operations with JPA', description: 'save, findById, findAll, delete', xp: 15, completed: false },
    { category: 'Week 2 - Day 9', session: 'Morning (4h)', item: 'Practice: Build CRUD service', description: 'Service layer with repository', xp: 10, completed: false },
    { category: 'Week 2 - Day 9', session: 'Evening (4h)', item: 'Project 1: Implement User Service', description: 'User registration, login, profile', xp: 20, completed: false },
    { category: 'Week 2 - Day 9', session: 'Evening (4h)', item: 'Project 1: Implement User Controller', description: 'REST endpoints for user management', xp: 15, completed: false },
    
    // Day 10
    { category: 'Week 2 - Day 10', session: 'Morning (4h)', item: 'Input Validation', description: '@Valid, @NotNull, @NotBlank, @Size', xp: 10, completed: false },
    { category: 'Week 2 - Day 10', session: 'Morning (4h)', item: 'Exception Handling', description: '@ControllerAdvice, GlobalExceptionHandler', xp: 15, completed: false },
    { category: 'Week 2 - Day 10', session: 'Morning (4h)', item: 'Practice: Add validation to API', description: 'Validate requests, handle errors', xp: 10, completed: false },
    { category: 'Week 2 - Day 10', session: 'Evening (4h)', item: 'Project 1: Implement Task Service', description: 'Task CRUD operations', xp: 20, completed: false },
    { category: 'Week 2 - Day 10', session: 'Evening (4h)', item: 'Project 1: Implement Task Controller', description: 'REST endpoints for tasks', xp: 15, completed: false },
    
    // Day 11
    { category: 'Week 2 - Day 11', session: 'Morning (4h)', item: 'DTOs (Data Transfer Objects)', description: 'Request/Response DTOs, mapping', xp: 15, completed: false },
    { category: 'Week 2 - Day 11', session: 'Morning (4h)', item: 'Pagination & Sorting', description: 'Pageable, Sort, paginated responses', xp: 15, completed: false },
    { category: 'Week 2 - Day 11', session: 'Morning (4h)', item: 'Practice: Add pagination to API', description: 'Implement paginated endpoints', xp: 10, completed: false },
    { category: 'Week 2 - Day 11', session: 'Evening (4h)', item: 'Project 1: Implement Search & Filter', description: 'Search tasks, filter by status/priority', xp: 20, completed: false },
    { category: 'Week 2 - Day 11', session: 'Evening (4h)', item: 'Project 1: Implement Category Service', description: 'Category CRUD operations', xp: 15, completed: false },
    
    // Day 12
    { category: 'Week 2 - Day 12', session: 'Morning (4h)', item: 'Unit Testing - JUnit 5', description: '@Test, assertions, test lifecycle', xp: 15, completed: false },
    { category: 'Week 2 - Day 12', session: 'Morning (4h)', item: 'Mocking with Mockito', description: '@Mock, @InjectMocks, when(), verify()', xp: 15, completed: false },
    { category: 'Week 2 - Day 12', session: 'Morning (4h)', item: 'Practice: Write unit tests', description: 'Test service layer', xp: 10, completed: false },
    { category: 'Week 2 - Day 12', session: 'Evening (4h)', item: 'Project 1: Write Unit Tests', description: 'Test services, >80% coverage', xp: 20, completed: false },
    { category: 'Week 2 - Day 12', session: 'Evening (4h)', item: 'Project 1: Write Integration Tests', description: 'Test controllers, API endpoints', xp: 15, completed: false },
    
    // Day 13
    { category: 'Week 2 - Day 13', session: 'Morning (4h)', item: 'API Documentation - Swagger', description: 'SpringDoc OpenAPI, @Operation', xp: 15, completed: false },
    { category: 'Week 2 - Day 13', session: 'Morning (4h)', item: 'Code Review & Refactoring', description: 'Review code, apply best practices', xp: 10, completed: false },
    { category: 'Week 2 - Day 13', session: 'Morning (4h)', item: 'Practice: Document your API', description: 'Add Swagger annotations', xp: 10, completed: false },
    { category: 'Week 2 - Day 13', session: 'Evening (4h)', item: 'Project 1: Add API Documentation', description: 'Swagger UI, document all endpoints', xp: 15, completed: false },
    { category: 'Week 2 - Day 13', session: 'Evening (4h)', item: 'Project 1: Final Review & Polish', description: 'Code review, refactor, optimize', xp: 15, completed: false },
    
    // Day 14
    { category: 'Week 2 - Day 14', session: 'Morning (4h)', item: 'Project 1: Complete any missing features', description: 'Finish all requirements', xp: 20, completed: false },
    { category: 'Week 2 - Day 14', session: 'Morning (4h)', item: 'Project 1: Test all functionality', description: 'Manual testing, fix bugs', xp: 15, completed: false },
    { category: 'Week 2 - Day 14', session: 'Evening (4h)', item: 'Project 1: Write README', description: 'Documentation, setup guide', xp: 10, completed: false },
    { category: 'Week 2 - Day 14', session: 'Evening (4h)', item: 'Project 1: Deploy to cloud (optional)', description: 'Deploy to Render/Heroku', xp: 15, completed: false },
    { category: 'Week 2 - Day 14', session: 'Evening (4h)', item: 'Week 1-2 Review & Reflection', description: 'Review what you learned, take notes', xp: 10, completed: false },
    
    // ========== WEEK 3 ==========
    // Day 15
    { category: 'Week 3 - Day 15', session: 'Morning (4h)', item: 'Spring Security Basics', description: 'Security configuration, authentication', xp: 15, completed: false },
    { category: 'Week 3 - Day 15', session: 'Morning (4h)', item: 'Password Encoding', description: 'BCrypt, password hashing', xp: 10, completed: false },
    { category: 'Week 3 - Day 15', session: 'Morning (4h)', item: 'Practice: Secure a simple endpoint', description: 'Add basic authentication', xp: 10, completed: false },
    { category: 'Week 3 - Day 15', session: 'Evening (4h)', item: 'JWT Tokens Introduction', description: 'What is JWT, structure, use cases', xp: 15, completed: false },
    { category: 'Week 3 - Day 15', session: 'Evening (4h)', item: 'JWT Implementation', description: 'Generate, validate JWT tokens', xp: 20, completed: false },
    
    // Day 16
    { category: 'Week 3 - Day 16', session: 'Morning (4h)', item: 'JWT Authentication Flow', description: 'Login, token generation, token validation', xp: 20, completed: false },
    { category: 'Week 3 - Day 16', session: 'Morning (4h)', item: 'JWT Filter & Interceptor', description: 'Custom filter for JWT validation', xp: 15, completed: false },
    { category: 'Week 3 - Day 16', session: 'Morning (4h)', item: 'Practice: Implement JWT auth', description: 'Complete authentication flow', xp: 15, completed: false },
    { category: 'Week 3 - Day 16', session: 'Evening (4h)', item: 'Role-Based Access Control (RBAC)', description: 'Roles, authorities, @PreAuthorize', xp: 15, completed: false },
    { category: 'Week 3 - Day 16', session: 'Evening (4h)', item: 'Practice: Add RBAC to API', description: 'Admin, User roles', xp: 15, completed: false },
    
    // Day 17
    { category: 'Week 3 - Day 17', session: 'Morning (4h)', item: 'Security Best Practices', description: 'HTTPS, CSRF, XSS prevention', xp: 10, completed: false },
    { category: 'Week 3 - Day 17', session: 'Morning (4h)', item: 'OAuth2 Basics (optional)', description: 'OAuth2 flow, Spring Security OAuth2', xp: 10, completed: false },
    { category: 'Week 3 - Day 17', session: 'Morning (4h)', item: 'Practice: Review security implementation', description: 'Security audit, improvements', xp: 10, completed: false },
    { category: 'Week 3 - Day 17', session: 'Evening (4h)', item: 'Project 2: Setup Microservices', description: 'Create service structure, Eureka setup', xp: 15, completed: false },
    { category: 'Week 3 - Day 17', session: 'Evening (4h)', item: 'Project 2: User Service with Security', description: 'Implement JWT authentication', xp: 20, completed: false },
    
    // Day 18
    { category: 'Week 3 - Day 18', session: 'Morning (4h)', item: 'Spring Data JPA Query Methods', description: 'findBy, countBy, custom methods', xp: 15, completed: false },
    { category: 'Week 3 - Day 18', session: 'Morning (4h)', item: 'Custom Queries - JPQL', description: '@Query with JPQL, named queries', xp: 15, completed: false },
    { category: 'Week 3 - Day 18', session: 'Morning (4h)', item: 'Practice: Write custom queries', description: 'Complex queries with JPQL', xp: 10, completed: false },
    { category: 'Week 3 - Day 18', session: 'Evening (4h)', item: 'Native Queries', description: '@Query with native SQL', xp: 10, completed: false },
    { category: 'Week 3 - Day 18', session: 'Evening (4h)', item: 'Project 2: Product Service', description: 'Product CRUD, search, inventory', xp: 20, completed: false },
    
    // Day 19
    { category: 'Week 3 - Day 19', session: 'Morning (4h)', item: 'Specifications Pattern', description: 'JpaSpecificationExecutor, dynamic queries', xp: 15, completed: false },
    { category: 'Week 3 - Day 19', session: 'Morning (4h)', item: 'Pagination & Sorting Advanced', description: 'Custom pagination, sorting strategies', xp: 10, completed: false },
    { category: 'Week 3 - Day 19', session: 'Morning (4h)', item: 'Practice: Build search with specifications', description: 'Dynamic filtering', xp: 15, completed: false },
    { category: 'Week 3 - Day 19', session: 'Evening (4h)', item: 'Project 2: Advanced Product Queries', description: 'Search, filter, pagination', xp: 20, completed: false },
    { category: 'Week 3 - Day 19', session: 'Evening (4h)', item: 'Project 2: Product Categories', description: 'Category management', xp: 15, completed: false },
    
    // Day 20
    { category: 'Week 3 - Day 20', session: 'Morning (4h)', item: 'Entity Graphs', description: '@EntityGraph, solve N+1 problem', xp: 15, completed: false },
    { category: 'Week 3 - Day 20', session: 'Morning (4h)', item: 'Fetch Strategies', description: 'LAZY vs EAGER, performance optimization', xp: 10, completed: false },
    { category: 'Week 3 - Day 20', session: 'Morning (4h)', item: 'Practice: Optimize queries', description: 'Fix N+1 problems, improve performance', xp: 10, completed: false },
    { category: 'Week 3 - Day 20', session: 'Evening (4h)', item: 'Project 2: Optimize Database Queries', description: 'Add indexes, optimize queries', xp: 15, completed: false },
    { category: 'Week 3 - Day 20', session: 'Evening (4h)', item: 'Project 2: Product Service Testing', description: 'Unit & integration tests', xp: 15, completed: false },
    
    // Day 21
    { category: 'Week 3 - Day 21', session: 'Morning (4h)', item: 'Redis Introduction', description: 'What is Redis, use cases, setup', xp: 10, completed: false },
    { category: 'Week 3 - Day 21', session: 'Morning (4h)', item: 'Spring Cache Abstraction', description: '@Cacheable, @CacheEvict, cache managers', xp: 15, completed: false },
    { category: 'Week 3 - Day 21', session: 'Morning (4h)', item: 'Practice: Add caching to API', description: 'Cache frequently accessed data', xp: 15, completed: false },
    { category: 'Week 3 - Day 21', session: 'Evening (4h)', item: 'Spring Data Redis', description: 'RedisTemplate, RedisRepository', xp: 15, completed: false },
    { category: 'Week 3 - Day 21', session: 'Evening (4h)', item: 'Project 2: Add Redis Caching', description: 'Cache products, user sessions', xp: 20, completed: false },
    
    // Day 22
    { category: 'Week 3 - Day 22', session: 'Morning (4h)', item: 'Kafka Introduction', description: 'What is Kafka, topics, producers, consumers', xp: 15, completed: false },
    { category: 'Week 3 - Day 22', session: 'Morning (4h)', item: 'Spring Kafka Basics', description: '@KafkaListener, KafkaTemplate', xp: 15, completed: false },
    { category: 'Week 3 - Day 22', session: 'Morning (4h)', item: 'Practice: Send/receive messages', description: 'Simple producer/consumer', xp: 15, completed: false },
    { category: 'Week 3 - Day 22', session: 'Evening (4h)', item: 'Event-Driven Architecture', description: 'Events, event sourcing, CQRS basics', xp: 15, completed: false },
    { category: 'Week 3 - Day 22', session: 'Evening (4h)', item: 'Project 2: Setup Kafka', description: 'Docker setup, create topics', xp: 15, completed: false },
    
    // Day 23
    { category: 'Week 3 - Day 23', session: 'Morning (4h)', item: 'Kafka Event Publishing', description: 'Publish events from services', xp: 15, completed: false },
    { category: 'Week 3 - Day 23', session: 'Morning (4h)', item: 'Kafka Event Consumption', description: 'Consume events, handle errors', xp: 15, completed: false },
    { category: 'Week 3 - Day 23', session: 'Morning (4h)', item: 'Practice: Build event-driven flow', description: 'Order created -> Payment processed', xp: 15, completed: false },
    { category: 'Week 3 - Day 23', session: 'Evening (4h)', item: 'Project 2: Implement Event Flow', description: 'Order events, payment events', xp: 25, completed: false },
    { category: 'Week 3 - Day 23', session: 'Evening (4h)', item: 'Project 2: Notification Service', description: 'Consume events, send notifications', xp: 20, completed: false },
    
    // Day 24
    { category: 'Week 3 - Day 24', session: 'Morning (4h)', item: 'Unit Testing - JUnit 5 Advanced', description: 'Parameterized tests, test lifecycle', xp: 15, completed: false },
    { category: 'Week 3 - Day 24', session: 'Morning (4h)', item: 'Mockito Advanced', description: 'Argument matchers, verify interactions', xp: 15, completed: false },
    { category: 'Week 3 - Day 24', session: 'Morning (4h)', item: 'Practice: Write comprehensive tests', description: 'Test edge cases, error scenarios', xp: 10, completed: false },
    { category: 'Week 3 - Day 24', session: 'Evening (4h)', item: 'Integration Testing', description: '@SpringBootTest, @WebMvcTest, @DataJpaTest', xp: 15, completed: false },
    { category: 'Week 3 - Day 24', session: 'Evening (4h)', item: 'Project 2: Write Integration Tests', description: 'Test service interactions', xp: 20, completed: false },
    
    // Day 25
    { category: 'Week 3 - Day 25', session: 'Morning (4h)', item: 'Test Containers', description: 'Integration tests with real databases', xp: 15, completed: false },
    { category: 'Week 3 - Day 25', session: 'Morning (4h)', item: 'Test Coverage', description: 'JaCoCo, aim for >80% coverage', xp: 10, completed: false },
    { category: 'Week 3 - Day 25', session: 'Morning (4h)', item: 'Practice: Improve test coverage', description: 'Add missing tests', xp: 10, completed: false },
    { category: 'Week 3 - Day 25', session: 'Evening (4h)', item: 'Project 2: Order Service', description: 'Order creation, processing', xp: 25, completed: false },
    { category: 'Week 3 - Day 25', session: 'Evening (4h)', item: 'Project 2: Order-Payment Integration', description: 'Order -> Payment flow', xp: 20, completed: false },
    
    // Day 26
    { category: 'Week 3 - Day 26', session: 'Morning (4h)', item: 'Service Discovery - Eureka', description: 'Eureka server, client registration', xp: 20, completed: false },
    { category: 'Week 3 - Day 26', session: 'Morning (4h)', item: 'Practice: Setup service discovery', description: 'Register services with Eureka', xp: 15, completed: false },
    { category: 'Week 3 - Day 26', session: 'Evening (4h)', item: 'API Gateway - Spring Cloud Gateway', description: 'Gateway setup, routing, filtering', xp: 20, completed: false },
    { category: 'Week 3 - Day 26', session: 'Evening (4h)', item: 'Project 2: Setup API Gateway', description: 'Route requests to services', xp: 20, completed: false },
    
    // Day 27
    { category: 'Week 3 - Day 27', session: 'Morning (4h)', item: 'Inter-Service Communication', description: 'RestTemplate, WebClient, Feign', xp: 20, completed: false },
    { category: 'Week 3 - Day 27', session: 'Morning (4h)', item: 'Circuit Breaker Pattern', description: 'Resilience4j, fault tolerance', xp: 15, completed: false },
    { category: 'Week 3 - Day 27', session: 'Evening (4h)', item: 'Project 2: Service Communication', description: 'Services call each other', xp: 25, completed: false },
    { category: 'Week 3 - Day 27', session: 'Evening (4h)', item: 'Project 2: Payment Service', description: 'Payment processing', xp: 25, completed: false },
    
    // Day 28
    { category: 'Week 3 - Day 28', session: 'Morning (4h)', item: 'Project 2: Complete all services', description: 'Finish remaining features', xp: 20, completed: false },
    { category: 'Week 3 - Day 28', session: 'Morning (4h)', item: 'Project 2: End-to-End Testing', description: 'Test complete flows', xp: 20, completed: false },
    { category: 'Week 3 - Day 28', session: 'Evening (4h)', item: 'Project 2: Docker Compose Setup', description: 'Containerize all services', xp: 20, completed: false },
    { category: 'Week 3 - Day 28', session: 'Evening (4h)', item: 'Project 2: Documentation & Review', description: 'Document architecture, code review', xp: 15, completed: false },
    { category: 'Week 3 - Day 28', session: 'Evening (4h)', item: 'Week 3-4 Review & Reflection', description: 'Review microservices concepts', xp: 10, completed: false },
    
    // ========== WEEK 4 ==========
    // (Continuing with same pattern, but I'll add key sessions)
    // Day 29-31: Design Patterns
    { category: 'Week 4 - Day 29', session: 'Morning (4h)', item: 'Repository Pattern Deep Dive', description: 'Implement repository pattern', xp: 15, completed: false },
    { category: 'Week 4 - Day 29', session: 'Morning (4h)', item: 'Service Layer Pattern', description: 'Service interfaces, implementations', xp: 15, completed: false },
    { category: 'Week 4 - Day 29', session: 'Evening (4h)', item: 'Factory Pattern', description: 'Object creation patterns', xp: 15, completed: false },
    { category: 'Week 4 - Day 29', session: 'Evening (4h)', item: 'Practice: Apply patterns to code', description: 'Refactor with design patterns', xp: 15, completed: false },
    
    // Day 30
    { category: 'Week 4 - Day 30', session: 'Morning (4h)', item: 'Builder Pattern', description: 'Fluent API, object construction', xp: 15, completed: false },
    { category: 'Week 4 - Day 30', session: 'Morning (4h)', item: 'Strategy Pattern', description: 'Algorithm selection', xp: 15, completed: false },
    { category: 'Week 4 - Day 30', session: 'Evening (4h)', item: 'Observer Pattern', description: 'Event-driven with Spring Events', xp: 15, completed: false },
    { category: 'Week 4 - Day 30', session: 'Evening (4h)', item: 'Practice: Implement patterns', description: 'Build examples with patterns', xp: 15, completed: false },
    
    // Day 31
    { category: 'Week 4 - Day 31', session: 'Morning (4h)', item: 'SOLID Principles - Single Responsibility', description: 'One class, one reason to change', xp: 15, completed: false },
    { category: 'Week 4 - Day 31', session: 'Morning (4h)', item: 'SOLID - Open/Closed Principle', description: 'Open for extension, closed for modification', xp: 15, completed: false },
    { category: 'Week 4 - Day 31', session: 'Evening (4h)', item: 'SOLID - Liskov, Interface Segregation, Dependency Inversion', description: 'Remaining SOLID principles', xp: 20, completed: false },
    { category: 'Week 4 - Day 31', session: 'Evening (4h)', item: 'Practice: Refactor code with SOLID', description: 'Apply SOLID to existing code', xp: 15, completed: false },
    
    // Day 32-34: Clean Code
    { category: 'Week 4 - Day 32', session: 'Morning (4h)', item: 'Clean Code - Naming', description: 'Meaningful names, conventions', xp: 10, completed: false },
    { category: 'Week 4 - Day 32', session: 'Morning (4h)', item: 'Clean Code - Functions', description: 'Small functions, single purpose', xp: 10, completed: false },
    { category: 'Week 4 - Day 32', session: 'Evening (4h)', item: 'Refactoring Techniques', description: 'Extract method, extract class', xp: 15, completed: false },
    { category: 'Week 4 - Day 32', session: 'Evening (4h)', item: 'Practice: Refactor messy code', description: 'Apply refactoring techniques', xp: 15, completed: false },
    
    // Day 33
    { category: 'Week 4 - Day 33', session: 'Morning (4h)', item: 'Maven Deep Dive', description: 'POM structure, lifecycle, plugins', xp: 15, completed: false },
    { category: 'Week 4 - Day 33', session: 'Morning (4h)', item: 'Gradle Basics', description: 'build.gradle, tasks, dependencies', xp: 15, completed: false },
    { category: 'Week 4 - Day 33', session: 'Evening (4h)', item: 'Logging - SLF4J & Logback', description: 'Logging configuration, levels', xp: 15, completed: false },
    { category: 'Week 4 - Day 33', session: 'Evening (4h)', item: 'Practice: Configure logging', description: 'Setup structured logging', xp: 10, completed: false },
    
    // Day 34
    { category: 'Week 4 - Day 34', session: 'Morning (4h)', item: 'Spring Boot Actuator', description: 'Health checks, metrics, endpoints', xp: 15, completed: false },
    { category: 'Week 4 - Day 34', session: 'Morning (4h)', item: 'Monitoring & Metrics', description: 'Prometheus, Grafana basics', xp: 15, completed: false },
    { category: 'Week 4 - Day 34', session: 'Evening (4h)', item: 'Project 3: Setup & Planning', description: 'Plan full-stack application', xp: 10, completed: false },
    { category: 'Week 4 - Day 34', session: 'Evening (4h)', item: 'Project 3: Backend Setup', description: 'Create Spring Boot backend', xp: 15, completed: false },
    
    // Day 35-37: CI/CD
    { category: 'Week 4 - Day 35', session: 'Morning (4h)', item: 'GitHub Actions Basics', description: 'Workflow files, jobs, steps', xp: 15, completed: false },
    { category: 'Week 4 - Day 35', session: 'Morning (4h)', item: 'CI Pipeline Setup', description: 'Build, test, quality checks', xp: 20, completed: false },
    { category: 'Week 4 - Day 35', session: 'Evening (4h)', item: 'Docker Basics', description: 'Dockerfile, images, containers', xp: 15, completed: false },
    { category: 'Week 4 - Day 35', session: 'Evening (4h)', item: 'Practice: Dockerize application', description: 'Create Dockerfile, build image', xp: 15, completed: false },
    
    // Day 36
    { category: 'Week 4 - Day 36', session: 'Morning (4h)', item: 'Docker Compose', description: 'Multi-container applications', xp: 15, completed: false },
    { category: 'Week 4 - Day 36', session: 'Morning (4h)', item: 'CD Pipeline Setup', description: 'Deploy to staging/production', xp: 20, completed: false },
    { category: 'Week 4 - Day 36', session: 'Evening (4h)', item: 'Project 3: Backend Implementation', description: 'Implement core features', xp: 25, completed: false },
    { category: 'Week 4 - Day 36', session: 'Evening (4h)', item: 'Project 3: API Development', description: 'REST API endpoints', xp: 20, completed: false },
    
    // Day 37
    { category: 'Week 4 - Day 37', session: 'Morning (4h)', item: 'Cloud Deployment - Render', description: 'Deploy Spring Boot to Render', xp: 20, completed: false },
    { category: 'Week 4 - Day 37', session: 'Morning (4h)', item: 'Cloud Deployment - AWS (optional)', description: 'Deploy to AWS Elastic Beanstalk', xp: 15, completed: false },
    { category: 'Week 4 - Day 37', session: 'Evening (4h)', item: 'Project 3: Frontend Setup', description: 'Create React.js frontend', xp: 15, completed: false },
    { category: 'Week 4 - Day 37', session: 'Evening (4h)', item: 'Project 3: Frontend-Backend Integration', description: 'Connect React to Spring Boot API', xp: 20, completed: false },
    
    // Day 38-42: Final Project
    { category: 'Week 4 - Day 38', session: 'Morning (4h)', item: 'Project 3: Frontend Development', description: 'Build UI components', xp: 25, completed: false },
    { category: 'Week 4 - Day 38', session: 'Evening (4h)', item: 'Project 3: Authentication Flow', description: 'JWT in frontend, protected routes', xp: 25, completed: false },
    
    { category: 'Week 4 - Day 39', session: 'Morning (4h)', item: 'Project 3: Complete Features', description: 'Finish all functionality', xp: 30, completed: false },
    { category: 'Week 4 - Day 39', session: 'Evening (4h)', item: 'Project 3: Testing', description: 'Frontend & backend tests', xp: 20, completed: false },
    
    { category: 'Week 4 - Day 40', session: 'Morning (4h)', item: 'Project 3: CI/CD Pipeline', description: 'Setup GitHub Actions', xp: 25, completed: false },
    { category: 'Week 4 - Day 40', session: 'Evening (4h)', item: 'Project 3: Docker & Deployment', description: 'Dockerize, deploy to cloud', xp: 25, completed: false },
    
    { category: 'Week 4 - Day 41', session: 'Morning (4h)', item: 'Project 3: Documentation', description: 'README, API docs, setup guide', xp: 15, completed: false },
    { category: 'Week 4 - Day 41', session: 'Evening (4h)', item: 'Project 3: Code Review & Refactor', description: 'Final polish, best practices', xp: 20, completed: false },
    
    { category: 'Week 4 - Day 42', session: 'Morning (4h)', item: 'Portfolio Preparation', description: 'Prepare projects for portfolio', xp: 15, completed: false },
    { category: 'Week 4 - Day 42', session: 'Morning (4h)', item: 'Final Review', description: 'Review all 3 projects', xp: 15, completed: false },
    { category: 'Week 4 - Day 42', session: 'Evening (4h)', item: 'Learning Reflection', description: 'Reflect on 6 weeks journey', xp: 10, completed: false },
    { category: 'Week 4 - Day 42', session: 'Evening (4h)', item: 'Next Steps Planning', description: 'Plan for job search, interviews', xp: 10, completed: false },
];

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = detailedChecklistData;
}

