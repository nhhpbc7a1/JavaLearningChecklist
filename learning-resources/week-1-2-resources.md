# 📚 Learning Resources - Week 1-2

## 🎯 Tuần 1-2: Java Core + Spring Boot Foundation

---

## 📖 Java Fundamentals (Ngày 1-3)

### Official Documentation
- **Oracle Java Tutorials**: https://docs.oracle.com/javase/tutorial/
- **Java Language Specification**: https://docs.oracle.com/javase/specs/

### Video Tutorials
- **Java Tutorial for Beginners** (Programming with Mosh)
  - YouTube: https://www.youtube.com/watch?v=eIrMbAQSU34
  - Focus: Syntax, OOP basics

### Key Topics to Master
1. **OOP Concepts**
   - Classes & Objects
   - Inheritance, Polymorphism, Encapsulation, Abstraction
   - Interfaces vs Abstract Classes

2. **Collections Framework**
   - List (ArrayList, LinkedList)
   - Set (HashSet, TreeSet)
   - Map (HashMap, TreeMap)
   - When to use which?

3. **Streams API**
   - `filter()`, `map()`, `reduce()`
   - `collect()`, `forEach()`
   - Parallel streams

4. **Lambda Expressions**
   - Functional interfaces
   - Method references

### Practice
- **LeetCode**: Filter by Java, Easy-Medium problems
- **HackerRank Java**: https://www.hackerrank.com/domains/java

### Books
- **"Effective Java"** - Joshua Bloch (Reference, không cần đọc hết ngay)
- **"Java: The Complete Reference"** - Herbert Schildt (Comprehensive)

---

## 🌱 Spring Framework Basics (Ngày 4-7)

### Official Documentation
- **Spring Framework Documentation**: https://spring.io/projects/spring-framework
- **Spring Boot Reference**: https://docs.spring.io/spring-boot/docs/current/reference/html/

### Video Tutorials
- **Spring Boot Tutorial** (Java Brains)
  - YouTube: https://www.youtube.com/playlist?list=PLqq-6Pq4lTTbx8p2oCgcAQGQyqN8XeA1x
  - Focus: Spring Boot fundamentals

- **Spring Framework Tutorial** (Java Brains)
  - YouTube: https://www.youtube.com/playlist?list=PLqq-6Pq4lTTa8V5z4a6By4SFAyfNlR4kP

### Key Topics
1. **Dependency Injection (DI)**
   - `@Autowired`, `@Component`, `@Service`, `@Repository`
   - Constructor injection vs Field injection
   - IoC Container

2. **Spring Boot Auto-Configuration**
   - How it works
   - `@SpringBootApplication`
   - Application properties

3. **Spring Boot Starters**
   - `spring-boot-starter-web`
   - `spring-boot-starter-data-jpa`
   - `spring-boot-starter-test`

### Hands-on Practice
- **Spring Boot Guides**: https://spring.io/guides
  - Start with: "Building a RESTful Web Service"
  - Then: "Accessing Data with JPA"

### Books
- **"Spring Boot in Action"** - Craig Walls (Highly recommended)
- **"Pro Spring 6"** - Iuliana Cosmina (Comprehensive)

---

## 🌐 Spring MVC & REST (Ngày 8-10)

### Official Documentation
- **Spring MVC Documentation**: https://docs.spring.io/spring-framework/reference/web/webmvc.html
- **REST with Spring**: https://www.baeldung.com/rest-with-spring-series

### Video Tutorials
- **REST API with Spring Boot** (Java Brains)
  - YouTube: https://www.youtube.com/playlist?list=PLqq-6Pq4lTTa8V5z4a6By4SFAyfNlR4kP

### Key Topics
1. **REST Controllers**
   - `@RestController` vs `@Controller`
   - `@RequestMapping`, `@GetMapping`, `@PostMapping`, etc.
   - Path variables, Query parameters

2. **Request/Response Handling**
   - `@RequestBody`, `@ResponseBody`
   - `@PathVariable`, `@RequestParam`
   - `ResponseEntity<T>`

3. **HTTP Status Codes**
   - 200 OK, 201 Created, 204 No Content
   - 400 Bad Request, 404 Not Found, 500 Internal Server Error

### Practice
- **Spring Boot Guides**: "Building REST services with Spring"
- **Baeldung Tutorials**: https://www.baeldung.com/spring-boot

### Articles
- **REST API Best Practices**: https://restfulapi.net/
- **HTTP Status Codes**: https://httpstatuses.com/

---

## 🗄️ Database Integration (Ngày 11-14)

### Official Documentation
- **Spring Data JPA**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/
- **Hibernate Documentation**: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html

### Video Tutorials
- **Spring Data JPA Tutorial** (Java Brains)
  - YouTube: https://www.youtube.com/playlist?list=PLqq-6Pq4lTTa8V5z4a6By4SFAyfNlR4kP

### Key Topics
1. **JPA/Hibernate Basics**
   - `@Entity`, `@Table`, `@Id`, `@GeneratedValue`
   - `@Column`, `@OneToMany`, `@ManyToOne`, `@ManyToMany`
   - Entity Lifecycle

2. **Spring Data JPA**
   - Repository interfaces
   - Query methods (findBy, countBy, etc.)
   - `@Query` annotation
   - Pagination & Sorting

3. **Entity Relationships**
   - One-to-One
   - One-to-Many / Many-to-One
   - Many-to-Many
   - Cascade types, Fetch types

4. **Database Migrations**
   - Flyway hoặc Liquibase
   - Schema versioning

### Practice
- **Spring Boot Guide**: "Accessing Data with JPA"
- **Baeldung JPA Tutorials**: https://www.baeldung.com/spring-data-jpa-tutorial

### Books
- **"Java Persistence with Spring Data and Hibernate"** - Catalin Tudose

### SQL Resources (nếu cần refresh)
- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/current/tutorial.html
- **SQLBolt**: https://sqlbolt.com/ (Interactive SQL tutorial)

---

## 🛠️ Tools & Setup

### IDE
- **IntelliJ IDEA** (Recommended)
  - Download: https://www.jetbrains.com/idea/
  - Free for students: https://www.jetbrains.com/student/
  - Plugins: Lombok, Spring Assistant

- **VS Code** (Alternative)
  - Extensions: Java Extension Pack, Spring Boot Extension Pack

### Database Tools
- **pgAdmin**: PostgreSQL GUI
- **DBeaver**: Universal database tool
- **TablePlus**: Modern database client

### API Testing
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Swagger UI**: Built-in với SpringDoc

### Build Tools
- **Maven**: https://maven.apache.org/guides/getting-started/
- **Gradle**: https://docs.gradle.org/current/userguide/getting_started.html

---

## 📝 Cheat Sheets

### Java Collections
```
List: ArrayList, LinkedList
Set: HashSet, TreeSet, LinkedHashSet
Map: HashMap, TreeMap, LinkedHashMap
```

### Spring Annotations
```
@Component, @Service, @Repository, @Controller
@Autowired, @Qualifier
@RestController, @RequestMapping
@GetMapping, @PostMapping, @PutMapping, @DeleteMapping
@RequestBody, @ResponseBody, @PathVariable, @RequestParam
```

### JPA Annotations
```
@Entity, @Table, @Id, @GeneratedValue
@Column, @OneToMany, @ManyToOne, @ManyToMany
@JoinColumn, @JoinTable
```

---

## 🎯 Daily Schedule Example

### Buổi sáng (4h)
- **1h**: Đọc documentation/tutorial
- **2h**: Làm exercises, code examples
- **1h**: Review, take notes

### Buổi tối (4h)
- **3h**: Làm project
- **1h**: Review code, refactor

---

## 🔗 Useful Links

### Documentation
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- PostgreSQL: https://www.postgresql.org/docs/

### Tutorials
- Baeldung: https://www.baeldung.com/ (Excellent tutorials)
- Spring Boot Guides: https://spring.io/guides
- JavaTpoint: https://www.javatpoint.com/spring-boot-tutorial

### Communities
- Stack Overflow: Tag `spring-boot`, `java`
- Reddit: r/java, r/SpringBoot
- Spring Community: https://spring.io/community

### Practice Platforms
- LeetCode: https://leetcode.com/ (Java problems)
- HackerRank: https://www.hackerrank.com/domains/java
- Codewars: https://www.codewars.com/ (Java katas)

---

## 📚 Recommended Reading Order

1. **Week 1, Day 1-3**: Java fundamentals (syntax, OOP, Collections)
2. **Week 1, Day 4-7**: Spring Boot basics (DI, Auto-configuration)
3. **Week 1, Day 8-10**: REST APIs với Spring MVC
4. **Week 2, Day 11-14**: JPA/Hibernate, Database integration

---

## 💡 Tips

1. **Hands-on Learning**: Đừng chỉ đọc, phải code
2. **Build Projects**: Làm project song song với học lý thuyết
3. **Ask Questions**: Sử dụng AI, Stack Overflow khi stuck
4. **Code Review**: Review code của mình và của người khác
5. **Practice Daily**: Consistency quan trọng hơn intensity

---

## ✅ Week 1-2 Goals

By the end of Week 2, bạn nên:
- ✅ Hiểu Java OOP và Collections
- ✅ Hiểu Spring Boot DI và IoC
- ✅ Viết được REST API với Spring Boot
- ✅ Làm việc với JPA/Hibernate
- ✅ Hoàn thành Project 1 (Task Management API)

---

**Happy Learning! 🚀**

