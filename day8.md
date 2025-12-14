Đang kiểm tra nội dung Day 8 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 8 - JPA/Hibernate & Database Setup:

## 📅 Kế hoạch luyện tập Day 8

### **Buổi sáng (4h): JPA/Hibernate & Entity Relationships**

---

## 🎯 **Exercise 1: JPA/Hibernate Basics** (1.5h)

**Mục tiêu:** Nắm `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`

**Yêu cầu:**

### **1.1 Basic Entity**
1. Tạo simple entity:
```java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors, getters, setters
}
```

2. Test với Repository:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
}

// Test
@SpringBootTest
class ProductTest {
    @Autowired
    private ProductRepository repository;
    
    @Test
    void testSave() {
        Product product = new Product();
        product.setName("Laptop");
        product.setPrice(new BigDecimal("999.99"));
        Product saved = repository.save(product);
        assertNotNull(saved.getId());
    }
}
```

### **1.2 @Column Annotations**
1. Test các column options:
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(name = "email_address", unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(columnDefinition = "VARCHAR(255) DEFAULT 'USER'")
    private String role;
    
    @Column(updatable = false)  // Cannot update after insert
    private LocalDateTime createdAt;
    
    @Column(insertable = false)  // Cannot insert, only update
    private LocalDateTime lastLogin;
}
```

### **1.3 @GeneratedValue Strategies**
1. Test các strategies:
```java
@Entity
public class Example {
    // Strategy 1: IDENTITY (Auto-increment)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id1;
    
    // Strategy 2: SEQUENCE
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_gen")
    @SequenceGenerator(name = "seq_gen", sequenceName = "example_seq", allocationSize = 1)
    private Long id2;
    
    // Strategy 3: TABLE
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE, generator = "table_gen")
    @TableGenerator(name = "table_gen", table = "id_generator", pkColumnName = "gen_name", valueColumnName = "gen_value")
    private Long id3;
}
```

---

## 🎯 **Exercise 2: Entity Relationships** (1.5h)

**Mục tiêu:** Nắm `@OneToMany`, `@ManyToOne`, `@ManyToMany`

**Yêu cầu:**

### **2.1 One-to-Many / Many-to-One**
1. Tạo relationship: Author → Books
```java
@Entity
@Table(name = "authors")
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> books = new ArrayList<>();
    
    // Constructors, getters, setters
}

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private Author author;
    
    // Constructors, getters, setters
}
```

2. Test relationship:
```java
@Test
void testAuthorBookRelationship() {
    Author author = new Author();
    author.setName("John Doe");
    
    Book book1 = new Book();
    book1.setTitle("Book 1");
    book1.setAuthor(author);
    
    Book book2 = new Book();
    book2.setTitle("Book 2");
    book2.setAuthor(author);
    
    author.getBooks().add(book1);
    author.getBooks().add(book2);
    
    Author saved = authorRepository.save(author);
    assertEquals(2, saved.getBooks().size());
}
```

### **2.2 Many-to-Many**
1. Tạo relationship: Student ↔ Course
```java
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany
    @JoinTable(
        name = "student_courses",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> courses = new HashSet<>();
    
    // Constructors, getters, setters
}

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @ManyToMany(mappedBy = "courses")
    private Set<Student> students = new HashSet<>();
    
    // Constructors, getters, setters
}
```

2. Test relationship:
```java
@Test
void testStudentCourseRelationship() {
    Student student = new Student();
    student.setName("Alice");
    
    Course course1 = new Course();
    course1.setName("Java");
    
    Course course2 = new Course();
    course2.setName("Spring");
    
    student.getCourses().add(course1);
    student.getCourses().add(course2);
    
    Student saved = studentRepository.save(student);
    assertEquals(2, saved.getCourses().size());
}
```

### **2.3 One-to-One**
1. Tạo relationship: User → Profile
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;
    
    // Constructors, getters, setters
}

@Entity
@Table(name = "user_profiles")
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String bio;
    private String avatar;
    
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    // Constructors, getters, setters
}
```

### **2.4 Cascade Types**
1. Test các cascade types:
```java
// CascadeType.ALL - All operations cascade
@OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
private List<Book> books;

// CascadeType.PERSIST - Only persist cascades
@OneToMany(mappedBy = "author", cascade = CascadeType.PERSIST)
private List<Book> books;

// CascadeType.REMOVE - Only remove cascades
@OneToMany(mappedBy = "author", cascade = CascadeType.REMOVE)
private List<Book> books;
```

---

## 🎯 **Exercise 3: Create Entities with Relationships** (1h)

**Mục tiêu:** Áp dụng relationships vào Project 1

**Yêu cầu:**

1. Refactor entities từ Day 7 với relationships đúng:
   - User ↔ Task (One-to-Many)
   - Task ↔ Category (Many-to-Many)
   - User ↔ Category (One-to-Many)

2. Test relationships:
```java
@Test
void testUserTaskRelationship() {
    User user = new User();
    user.setUsername("testuser");
    user.setEmail("test@example.com");
    
    Task task1 = new Task();
    task1.setTitle("Task 1");
    task1.setUser(user);
    
    Task task2 = new Task();
    task2.setTitle("Task 2");
    task2.setUser(user);
    
    user.getTasks().add(task1);
    user.getTasks().add(task2);
    
    User saved = userRepository.save(user);
    assertEquals(2, saved.getTasks().size());
}
```

---

### **Buổi tối (4h): Repository Pattern & Database Setup**

---

## 🎯 **Exercise 4: Repository Pattern** (2h)

**Mục tiêu:** Sử dụng JpaRepository và custom query methods

**Yêu cầu:**

### **4.1 JpaRepository Basics**
1. Tạo repository với basic methods:
```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Inherited methods:
    // - save(T entity)
    // - findById(ID id)
    // - findAll()
    // - deleteById(ID id)
    // - count()
    // - existsById(ID id)
}
```

2. Test basic operations:
```java
@SpringBootTest
class TaskRepositoryTest {
    @Autowired
    private TaskRepository repository;
    
    @Test
    void testCrudOperations() {
        // Create
        Task task = new Task();
        task.setTitle("Test Task");
        Task saved = repository.save(task);
        
        // Read
        Optional<Task> found = repository.findById(saved.getId());
        assertTrue(found.isPresent());
        
        // Update
        saved.setTitle("Updated Task");
        Task updated = repository.save(saved);
        
        // Delete
        repository.deleteById(updated.getId());
        assertFalse(repository.existsById(updated.getId()));
    }
}
```

### **4.2 Custom Query Methods**
1. Tạo query methods theo naming convention:
```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find by field
    List<Task> findByTitle(String title);
    Optional<Task> findByTitleAndStatus(String title, TaskStatus status);
    
    // Find by user
    List<Task> findByUserId(Long userId);
    List<Task> findByUserUsername(String username);
    
    // Find by status
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByStatusIn(List<TaskStatus> statuses);
    
    // Count
    long countByStatus(TaskStatus status);
    long countByUserId(Long userId);
    
    // Exists
    boolean existsByTitle(String title);
    
    // Delete
    void deleteByStatus(TaskStatus status);
    
    // Sorting
    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Task> findByStatusOrderByPriorityDesc(TaskStatus status);
    
    // Pagination
    Page<Task> findByUserId(Long userId, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}
```

2. Test query methods:
```java
@Test
void testCustomQueries() {
    // Create test data
    User user = userRepository.save(new User(...));
    Task task1 = taskRepository.save(new Task(..., TaskStatus.TODO));
    Task task2 = taskRepository.save(new Task(..., TaskStatus.IN_PROGRESS));
    
    // Test queries
    List<Task> todoTasks = taskRepository.findByStatus(TaskStatus.TODO);
    assertEquals(1, todoTasks.size());
    
    long count = taskRepository.countByStatus(TaskStatus.TODO);
    assertEquals(1, count);
    
    Page<Task> page = taskRepository.findByUserId(user.getId(), PageRequest.of(0, 10));
    assertEquals(2, page.getTotalElements());
}
```

### **4.3 @Query Annotation**
1. Tạo custom queries với JPQL:
```java
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // JPQL Query
    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    List<Task> findUserTasksByStatus(@Param("userId") Long userId, 
                                     @Param("status") TaskStatus status);
    
    // JPQL with JOIN
    @Query("SELECT t FROM Task t JOIN t.categories c WHERE c.id = :categoryId")
    List<Task> findTasksByCategory(@Param("categoryId") Long categoryId);
    
    // Native SQL Query
    @Query(value = "SELECT * FROM tasks WHERE due_date < :date", nativeQuery = true)
    List<Task> findOverdueTasks(@Param("date") LocalDateTime date);
    
    // Update Query
    @Modifying
    @Query("UPDATE Task t SET t.status = :status WHERE t.id = :id")
    void updateTaskStatus(@Param("id") Long id, @Param("status") TaskStatus status);
    
    // Delete Query
    @Modifying
    @Query("DELETE FROM Task t WHERE t.status = :status")
    void deleteByStatus(@Param("status") TaskStatus status);
}
```

### **4.4 Specifications Pattern** (Advanced)
1. Tạo specifications cho dynamic queries:
```java
public class TaskSpecifications {
    public static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) -> 
            cb.equal(root.get("status"), status);
    }
    
    public static Specification<Task> hasUserId(Long userId) {
        return (root, query, cb) -> 
            cb.equal(root.get("user").get("id"), userId);
    }
    
    public static Specification<Task> titleContains(String title) {
        return (root, query, cb) -> 
            cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }
}

// Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
}

// Usage
List<Task> tasks = taskRepository.findAll(
    Specification.where(TaskSpecifications.hasStatus(TaskStatus.TODO))
        .and(TaskSpecifications.hasUserId(userId))
        .and(TaskSpecifications.titleContains("Java"))
);
```

---

## 🎯 **Exercise 5: Project 1 - Setup Database** (2h)

**Mục tiêu:** Setup PostgreSQL và configure JPA

**Yêu cầu:**

### **5.1 Install PostgreSQL**
1. Install PostgreSQL (nếu chưa có):
   - Download: https://www.postgresql.org/download/
   - Hoặc dùng Docker:
   ```bash
   docker run --name postgres-task -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_management_db -p 5432:5432 -d postgres:15
   ```

2. Create database:
```sql
CREATE DATABASE task_management_db;
```

### **5.2 Configure application.properties**
1. Update `application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/task_management_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
```

### **5.3 Configure application.yml** (Alternative)
1. Hoặc dùng `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/task_management_db
    username: postgres
    password: postgres
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

### **5.4 Test Database Connection**
1. Tạo test để verify connection:
```java
@SpringBootTest
class DatabaseConnectionTest {
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private UserRepository userRepository;
    
    @Test
    void testDatabaseConnection() throws SQLException {
        assertNotNull(dataSource);
        Connection connection = dataSource.getConnection();
        assertTrue(connection.isValid(1));
        connection.close();
    }
    
    @Test
    void testSaveUser() {
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPassword("password");
        
        User saved = userRepository.save(user);
        assertNotNull(saved.getId());
        
        Optional<User> found = userRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }
}
```

### **5.5 Verify Tables Created**
1. Check database tables:
```sql
-- Connect to database
\c task_management_db

-- List tables
\dt

-- Check users table structure
\d users

-- Check tasks table structure
\d tasks

-- Check categories table structure
\d categories
```

---

## 📝 **Checklist Day 8**

### Buổi sáng:
- [ ] Exercise 1.1: Basic Entity với @Entity, @Table, @Id, @GeneratedValue
- [ ] Exercise 1.2: @Column Annotations
- [ ] Exercise 1.3: @GeneratedValue Strategies
- [ ] Exercise 2.1: One-to-Many / Many-to-One
- [ ] Exercise 2.2: Many-to-Many
- [ ] Exercise 2.3: One-to-One
- [ ] Exercise 2.4: Cascade Types
- [ ] Exercise 3: Create Entities với Relationships cho Project 1

### Buổi tối:
- [ ] Exercise 4.1: JpaRepository Basics
- [ ] Exercise 4.2: Custom Query Methods
- [ ] Exercise 4.3: @Query Annotation (JPQL, Native)
- [ ] Exercise 4.4: Specifications Pattern
- [ ] Exercise 5.1: Install PostgreSQL
- [ ] Exercise 5.2: Configure application.properties
- [ ] Exercise 5.3: Configure application.yml
- [ ] Exercise 5.4: Test Database Connection
- [ ] Exercise 5.5: Verify Tables Created

---

## 💡 **Tips**

1. JPA Annotations:
   - `@Entity`: Đánh dấu class là entity
   - `@Table`: Specify table name
   - `@Id`: Primary key
   - `@GeneratedValue`: Auto-generate ID
   - `@Column`: Customize column properties

2. Relationships:
   - `@OneToMany`: One entity to many entities
   - `@ManyToOne`: Many entities to one entity
   - `@ManyToMany`: Many-to-many relationship
   - `@OneToOne`: One-to-one relationship
   - `mappedBy`: Specify owning side

3. Repository Pattern:
   - Extend `JpaRepository<T, ID>`
   - Use method naming conventions
   - Use `@Query` for complex queries
   - Use `@Modifying` for update/delete queries

4. Database Configuration:
   - `ddl-auto=update`: Auto create/update tables (dev only!)
   - `show-sql=true`: Show SQL queries in logs
   - `format_sql=true`: Format SQL for readability
   - Production: Use Flyway/Liquibase for migrations

5. Best Practices:
   - Use `@JoinColumn` để specify foreign key
   - Use `CascadeType.ALL` carefully
   - Use `orphanRemoval=true` để auto-delete orphans
   - Use `fetch = FetchType.LAZY` by default

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 8, bạn nên:
- ✅ Hiểu và sử dụng JPA annotations
- ✅ Tạo được entities với relationships
- ✅ Sử dụng JpaRepository và custom queries
- ✅ Setup PostgreSQL database
- ✅ Configure JPA/Hibernate
- ✅ Test database operations
- ✅ Verify tables được tạo đúng

---

## 🔗 **Resources**

- **JPA Documentation**: https://docs.oracle.com/javaee/7/api/javax/persistence/package-summary.html
- **Hibernate**: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/
- **Spring Data JPA**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/
- **PostgreSQL**: https://www.postgresql.org/docs/

Chúc bạn luyện tập tốt.