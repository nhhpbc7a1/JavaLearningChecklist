Đang kiểm tra nội dung Day 12 để lập kế hoạch luyện tập:


[3 tools called]


Kế hoạch luyện tập Day 12 - Unit Testing với JUnit 5 & Mockito:

## 📅 Kế hoạch luyện tập Day 12

### **Buổi sáng (4h): Unit Testing - JUnit 5 & Mockito**

---

## 🎯 **Exercise 1: JUnit 5 Basics** (1.5h)

**Mục tiêu:** Nắm JUnit 5, annotations, assertions, test lifecycle

**Yêu cầu:**

### **1.1 Setup Dependencies**
1. Thêm dependencies vào `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<!-- Spring Boot Test includes:
     - JUnit 5 (Jupiter)
     - Mockito
     - AssertJ
     - Hamcrest
     - Spring Test & Spring Boot Test
-->
```

### **1.2 JUnit 5 Annotations**
1. Tạo test class cơ bản:
```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Task Service Tests")
class TaskServiceTest {
    
    // @BeforeAll - chạy 1 lần trước tất cả tests (static method)
    @BeforeAll
    static void setUpAll() {
        System.out.println("Before all tests");
    }
    
    // @AfterAll - chạy 1 lần sau tất cả tests (static method)
    @AfterAll
    static void tearDownAll() {
        System.out.println("After all tests");
    }
    
    // @BeforeEach - chạy trước mỗi test method
    @BeforeEach
    void setUp() {
        System.out.println("Before each test");
    }
    
    // @AfterEach - chạy sau mỗi test method
    @AfterEach
    void tearDown() {
        System.out.println("After each test");
    }
    
    // @Test - đánh dấu method là test case
    @Test
    @DisplayName("Should create task successfully")
    void testCreateTask() {
        // Test code here
    }
    
    // @Disabled - skip test này
    @Disabled("Not implemented yet")
    @Test
    void testUpdateTask() {
        // This test will be skipped
    }
    
    // @RepeatedTest - chạy test nhiều lần
    @RepeatedTest(5)
    void testRandomNumber() {
        int num = (int) (Math.random() * 100);
        assertTrue(num >= 0 && num < 100);
    }
    
    // @ParameterizedTest - test với nhiều input values
    @ParameterizedTest
    @ValueSource(strings = {"TODO", "IN_PROGRESS", "DONE"})
    void testTaskStatus(String status) {
        assertNotNull(TaskStatus.valueOf(status));
    }
}
```

### **1.3 Assertions**
1. JUnit 5 Assertions:
```java
@Test
void testAssertions() {
    // assertEquals - so sánh expected vs actual
    assertEquals(5, 2 + 3, "Math should work");
    assertEquals("Hello", "Hello", () -> "Strings should match");
    
    // assertNotEquals
    assertNotEquals(5, 2 + 2);
    
    // assertTrue / assertFalse
    assertTrue(5 > 3);
    assertFalse(2 > 5);
    
    // assertNull / assertNotNull
    String str = null;
    assertNull(str);
    str = "Hello";
    assertNotNull(str);
    
    // assertSame / assertNotSame (so sánh reference)
    String s1 = "Hello";
    String s2 = "Hello";
    String s3 = new String("Hello");
    assertSame(s1, s2); // Same reference (string pool)
    assertNotSame(s1, s3); // Different references
    
    // assertArrayEquals
    int[] expected = {1, 2, 3};
    int[] actual = {1, 2, 3};
    assertArrayEquals(expected, actual);
    
    // assertThrows - kiểm tra exception
    assertThrows(IllegalArgumentException.class, () -> {
        throw new IllegalArgumentException("Invalid input");
    });
    
    // assertDoesNotThrow
    assertDoesNotThrow(() -> {
        int result = 5 + 3;
    });
    
    // assertAll - group multiple assertions
    assertAll(
        () -> assertEquals(5, 2 + 3),
        () -> assertTrue(5 > 0),
        () -> assertNotNull("Hello")
    );
    
    // assertTimeout - kiểm tra execution time
    assertTimeout(Duration.ofSeconds(1), () -> {
        Thread.sleep(500);
    });
}
```

### **1.4 AssertJ (Fluent Assertions)**
1. AssertJ (đã có trong spring-boot-starter-test):
```java
import static org.assertj.core.api.Assertions.*;

@Test
void testAssertJ() {
    String str = "Hello World";
    
    // String assertions
    assertThat(str)
        .isNotNull()
        .isNotEmpty()
        .hasSize(11)
        .startsWith("Hello")
        .endsWith("World")
        .contains("lo Wo")
        .doesNotContain("Java");
    
    // Number assertions
    int number = 42;
    assertThat(number)
        .isPositive()
        .isGreaterThan(40)
        .isLessThan(50)
        .isBetween(40, 50);
    
    // List assertions
    List<String> list = Arrays.asList("Java", "Spring", "Boot");
    assertThat(list)
        .isNotEmpty()
        .hasSize(3)
        .contains("Spring")
        .containsExactly("Java", "Spring", "Boot")
        .doesNotContain("Python");
    
    // Exception assertions
    assertThatThrownBy(() -> {
        throw new IllegalArgumentException("Invalid");
    })
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage("Invalid");
}
```

---

## 🎯 **Exercise 2: Mocking with Mockito** (1.5h)

**Mục tiêu:** Sử dụng Mockito để mock dependencies

**Yêu cầu:**

### **2.1 Mockito Basics**
1. Tạo mocks:
```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;

class TaskServiceTest {
    
    // @Mock - tạo mock object
    @Mock
    private TaskRepository taskRepository;
    
    @Mock
    private UserRepository userRepository;
    
    // @InjectMocks - tự động inject mocks vào object này
    @InjectMocks
    private TaskServiceImpl taskService;
    
    @BeforeEach
    void setUp() {
        // Khởi tạo mocks
        MockitoAnnotations.openMocks(this);
    }
}
```

### **2.2 When-Then Pattern**
1. Stubbing behavior:
```java
@Test
void testCreateTask() {
    // Arrange (Given)
    CreateTaskRequest request = new CreateTaskRequest();
    request.setTitle("Test Task");
    request.setStatus(TaskStatus.TODO);
    
    User user = new User();
    user.setId(1L);
    user.setUsername("testuser");
    
    Task savedTask = new Task();
    savedTask.setId(1L);
    savedTask.setTitle("Test Task");
    savedTask.setUser(user);
    
    // Mock repository behavior
    when(userRepository.findById(1L))
        .thenReturn(Optional.of(user));
    
    when(taskRepository.save(any(Task.class)))
        .thenReturn(savedTask);
    
    // Act (When)
    TaskResponse response = taskService.createTask(request, 1L);
    
    // Assert (Then)
    assertThat(response).isNotNull();
    assertThat(response.getTitle()).isEqualTo("Test Task");
    assertThat(response.getId()).isEqualTo(1L);
    
    // Verify interactions
    verify(userRepository, times(1)).findById(1L);
    verify(taskRepository, times(1)).save(any(Task.class));
}
```

### **2.3 Argument Matchers**
1. Sử dụng argument matchers:
```java
@Test
void testArgumentMatchers() {
    // any() - match any value
    when(taskRepository.findById(anyLong()))
        .thenReturn(Optional.of(new Task()));
    
    // any(Class) - match any object of type
    when(taskRepository.save(any(Task.class)))
        .thenReturn(new Task());
    
    // eq() - exact match
    when(taskRepository.findByTitle(eq("Test")))
        .thenReturn(Optional.of(new Task()));
    
    // anyString(), anyInt(), anyList(), etc.
    when(taskRepository.findByTitle(anyString()))
        .thenReturn(Optional.of(new Task()));
    
    // ArgumentCaptor - capture arguments
    ArgumentCaptor<Task> taskCaptor = ArgumentCaptor.forClass(Task.class);
    taskService.createTask(request, userId);
    
    verify(taskRepository).save(taskCaptor.capture());
    Task capturedTask = taskCaptor.getValue();
    assertThat(capturedTask.getTitle()).isEqualTo("Test Task");
}
```

### **2.4 Exception Handling**
1. Test exceptions:
```java
@Test
void testUserNotFound() {
    // Arrange
    CreateTaskRequest request = new CreateTaskRequest();
    request.setTitle("Test Task");
    
    when(userRepository.findById(1L))
        .thenReturn(Optional.empty());
    
    // Act & Assert
    assertThatThrownBy(() -> taskService.createTask(request, 1L))
        .isInstanceOf(ResourceNotFoundException.class)
        .hasMessage("User not found with id: 1");
    
    verify(taskRepository, never()).save(any());
}
```

### **2.5 Verify Interactions**
1. Verify method calls:
```java
@Test
void testVerifyInteractions() {
    // Verify method was called
    verify(taskRepository).findById(1L);
    
    // Verify number of calls
    verify(taskRepository, times(2)).findAll();
    verify(taskRepository, atLeastOnce()).save(any());
    verify(taskRepository, atMost(3)).delete(any());
    verify(taskRepository, never()).deleteById(999L);
    
    // Verify no more interactions
    verifyNoMoreInteractions(taskRepository);
    
    // Verify in order
    InOrder inOrder = inOrder(taskRepository, userRepository);
    inOrder.verify(userRepository).findById(1L);
    inOrder.verify(taskRepository).save(any());
}
```

### **2.6 Spy (Partial Mocking)**
1. Sử dụng Spy:
```java
import org.mockito.Spy;

class TaskServiceTest {
    
    @Spy
    private TaskMapper taskMapper = new TaskMapper();
    
    @Test
    void testSpy() {
        // Spy calls real methods by default
        Task task = new Task();
        task.setTitle("Test");
        
        // Real method is called
        TaskResponse response = taskMapper.toResponse(task);
        
        // But we can verify it was called
        verify(taskMapper).toResponse(task);
        
        // Or stub specific methods
        doReturn(new TaskResponse()).when(taskMapper).toResponse(any());
    }
}
```

---

## 🎯 **Exercise 3: Write Unit Tests** (1h)

**Mục tiêu:** Viết unit tests cho service layer

**Yêu cầu:**

### **3.1 Test TaskService**
1. Tạo `TaskServiceTest.java`:
```java
@ExtendWith(MockitoExtension.class)
@DisplayName("Task Service Unit Tests")
class TaskServiceTest {
    
    @Mock
    private TaskRepository taskRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private TaskMapper taskMapper;
    
    @InjectMocks
    private TaskServiceImpl taskService;
    
    private User testUser;
    private Task testTask;
    private CreateTaskRequest createRequest;
    private TaskResponse taskResponse;
    
    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setStatus(TaskStatus.TODO);
        testTask.setPriority(TaskPriority.MEDIUM);
        testTask.setUser(testUser);
        
        createRequest = new CreateTaskRequest();
        createRequest.setTitle("Test Task");
        createRequest.setDescription("Test Description");
        createRequest.setStatus(TaskStatus.TODO);
        createRequest.setPriority(TaskPriority.MEDIUM);
        
        taskResponse = TaskResponse.builder()
            .id(1L)
            .title("Test Task")
            .status(TaskStatus.TODO)
            .build();
    }
    
    @Test
    @DisplayName("Should create task successfully")
    void testCreateTask_Success() {
        // Arrange
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(testUser));
        when(taskMapper.toEntity(any(), any()))
            .thenReturn(testTask);
        when(taskRepository.save(any(Task.class)))
            .thenReturn(testTask);
        when(taskMapper.toResponse(any(Task.class)))
            .thenReturn(taskResponse);
        
        // Act
        TaskResponse response = taskService.createTask(createRequest, 1L);
        
        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Test Task");
        
        verify(userRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));
        verify(taskMapper).toResponse(any(Task.class));
    }
    
    @Test
    @DisplayName("Should throw exception when user not found")
    void testCreateTask_UserNotFound() {
        // Arrange
        when(userRepository.findById(1L))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> taskService.createTask(createRequest, 1L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("User not found");
        
        verify(taskRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should get task by id successfully")
    void testGetTaskById_Success() {
        // Arrange
        when(taskRepository.findById(1L))
            .thenReturn(Optional.of(testTask));
        when(taskMapper.toResponse(testTask))
            .thenReturn(taskResponse);
        
        // Act
        TaskResponse response = taskService.getTaskById(1L, 1L);
        
        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        
        verify(taskRepository).findById(1L);
    }
    
    @Test
    @DisplayName("Should throw exception when task not found")
    void testGetTaskById_NotFound() {
        // Arrange
        when(taskRepository.findById(1L))
            .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> taskService.getTaskById(1L, 1L))
            .isInstanceOf(ResourceNotFoundException.class);
    }
    
    @Test
    @DisplayName("Should update task successfully")
    void testUpdateTask_Success() {
        // Arrange
        UpdateTaskRequest updateRequest = new UpdateTaskRequest();
        updateRequest.setTitle("Updated Task");
        updateRequest.setStatus(TaskStatus.IN_PROGRESS);
        
        Task updatedTask = new Task();
        updatedTask.setId(1L);
        updatedTask.setTitle("Updated Task");
        updatedTask.setStatus(TaskStatus.IN_PROGRESS);
        updatedTask.setUser(testUser);
        
        TaskResponse updatedResponse = TaskResponse.builder()
            .id(1L)
            .title("Updated Task")
            .status(TaskStatus.IN_PROGRESS)
            .build();
        
        when(taskRepository.findById(1L))
            .thenReturn(Optional.of(testTask));
        when(taskRepository.save(any(Task.class)))
            .thenReturn(updatedTask);
        when(taskMapper.toResponse(updatedTask))
            .thenReturn(updatedResponse);
        
        // Act
        TaskResponse response = taskService.updateTask(1L, updateRequest, 1L);
        
        // Assert
        assertThat(response.getTitle()).isEqualTo("Updated Task");
        assertThat(response.getStatus()).isEqualTo(TaskStatus.IN_PROGRESS);
        
        verify(taskRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));
    }
    
    @Test
    @DisplayName("Should delete task successfully")
    void testDeleteTask_Success() {
        // Arrange
        when(taskRepository.findById(1L))
            .thenReturn(Optional.of(testTask));
        doNothing().when(taskRepository).delete(testTask);
        
        // Act
        taskService.deleteTask(1L, 1L);
        
        // Assert
        verify(taskRepository).findById(1L);
        verify(taskRepository).delete(testTask);
    }
}
```

### **3.2 Test UserService**
1. Tạo `UserServiceTest.java` tương tự

### **3.3 Test CategoryService**
1. Tạo `CategoryServiceTest.java` tương tự

---

### **Buổi tối (4h): Project 1 - Write Unit Tests**

---

## 🎯 **Exercise 4: Write Unit Tests for Project 1** (4h)

**Mục tiêu:** Viết unit tests cho tất cả services, đạt >80% coverage

**Yêu cầu:**

### **4.1 Test Coverage Setup**
1. Thêm JaCoCo plugin vào `pom.xml`:
```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <rule>
                        <element>PACKAGE</element>
                        <limits>
                            <limit>
                                <counter>LINE</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.80</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

2. Chạy tests và xem coverage:
```bash
mvn clean test
mvn jacoco:report
# Open target/site/jacoco/index.html
```

### **4.2 Test All Services**
1. Viết unit tests cho:
   - ✅ TaskService (create, read, update, delete, getAll, search, filter)
   - ✅ UserService (create, read, update, delete, getAll)
   - ✅ CategoryService (create, read, update, delete, getAll)

2. Test cases cần cover:
   - ✅ Happy path (success scenarios)
   - ✅ Error cases (not found, validation errors)
   - ✅ Edge cases (empty lists, null values)
   - ✅ Business logic (permissions, ownership)

### **4.3 Test Examples**
1. Test TaskService - Search & Filter:
```java
@Test
@DisplayName("Should filter tasks by status")
void testFilterTasksByStatus() {
    // Arrange
    TaskFilter filter = TaskFilter.builder()
        .status(TaskStatus.TODO)
        .build();
    
    Pageable pageable = PageRequest.of(0, 10);
    
    List<Task> tasks = Arrays.asList(testTask);
    Page<Task> taskPage = new PageImpl<>(tasks);
    
    when(taskRepository.findAll(any(Specification.class), eq(pageable)))
        .thenReturn(taskPage);
    when(taskMapper.toResponse(any(Task.class)))
        .thenReturn(taskResponse);
    
    // Act
    PageResponse<TaskResponse> response = taskService.getAllTasks(1L, filter, pageable);
    
    // Assert
    assertThat(response.getContent()).hasSize(1);
    verify(taskRepository).findAll(any(Specification.class), eq(pageable));
}
```

2. Test TaskService - Pagination:
```java
@Test
@DisplayName("Should return paginated tasks")
void testGetAllTasks_Pagination() {
    // Arrange
    Pageable pageable = PageRequest.of(1, 5); // Page 2, size 5
    
    List<Task> tasks = Arrays.asList(testTask);
    Page<Task> taskPage = new PageImpl<>(tasks, pageable, 10);
    
    when(taskRepository.findAll(any(Specification.class), eq(pageable)))
        .thenReturn(taskPage);
    when(taskMapper.toResponse(any(Task.class)))
        .thenReturn(taskResponse);
    
    // Act
    PageResponse<TaskResponse> response = taskService.getAllTasks(1L, new TaskFilter(), pageable);
    
    // Assert
    assertThat(response.getPage()).isEqualTo(1);
    assertThat(response.getSize()).isEqualTo(5);
    assertThat(response.getTotalElements()).isEqualTo(10);
    assertThat(response.getTotalPages()).isEqualTo(2);
}
```

### **4.4 Test Utilities**
1. Tạo test utilities để reuse code:
```java
public class TestDataBuilder {
    
    public static User createTestUser(Long id) {
        User user = new User();
        user.setId(id);
        user.setUsername("testuser" + id);
        user.setEmail("test" + id + "@example.com");
        user.setPassword("password");
        return user;
    }
    
    public static Task createTestTask(Long id, User user) {
        Task task = new Task();
        task.setId(id);
        task.setTitle("Test Task " + id);
        task.setDescription("Description " + id);
        task.setStatus(TaskStatus.TODO);
        task.setPriority(TaskPriority.MEDIUM);
        task.setUser(user);
        return task;
    }
    
    public static CreateTaskRequest createTaskRequest() {
        CreateTaskRequest request = new CreateTaskRequest();
        request.setTitle("Test Task");
        request.setDescription("Test Description");
        request.setStatus(TaskStatus.TODO);
        request.setPriority(TaskPriority.MEDIUM);
        return request;
    }
}
```

### **4.5 Run All Tests**
1. Chạy tất cả tests:
```bash
mvn clean test
```

2. Kiểm tra coverage:
```bash
mvn jacoco:report
# Open target/site/jacoco/index.html in browser
```

3. Đảm bảo coverage > 80%

---

## 📝 **Checklist Day 12**

### Buổi sáng:
- [ ] Exercise 1.1: Setup JUnit 5 dependencies
- [ ] Exercise 1.2: JUnit 5 Annotations (@Test, @BeforeEach, @AfterEach, etc.)
- [ ] Exercise 1.3: JUnit 5 Assertions (assertEquals, assertTrue, assertThrows, etc.)
- [ ] Exercise 1.4: AssertJ Fluent Assertions
- [ ] Exercise 2.1: Mockito Basics (@Mock, @InjectMocks)
- [ ] Exercise 2.2: When-Then Pattern
- [ ] Exercise 2.3: Argument Matchers (any(), eq(), ArgumentCaptor)
- [ ] Exercise 2.4: Exception Handling Tests
- [ ] Exercise 2.5: Verify Interactions
- [ ] Exercise 2.6: Spy (Partial Mocking)
- [ ] Exercise 3.1: Write Unit Tests for TaskService
- [ ] Exercise 3.2: Write Unit Tests for UserService
- [ ] Exercise 3.3: Write Unit Tests for CategoryService

### Buổi tối:
- [ ] Exercise 4.1: Setup JaCoCo for test coverage
- [ ] Exercise 4.2: Write unit tests for all services
- [ ] Exercise 4.3: Test search & filter functionality
- [ ] Exercise 4.4: Test pagination
- [ ] Exercise 4.5: Create test utilities
- [ ] Exercise 4.6: Run all tests and check coverage (>80%)

---

## 💡 **Tips**

1. Test Structure (AAA Pattern):
   - Arrange: Setup test data và mocks
   - Act: Execute method under test
   - Assert: Verify results

2. Test Naming:
   - `methodName_scenario_expectedResult`
   - Example: `createTask_userNotFound_throwsException`

3. Best Practices:
   - Mỗi test nên test 1 thing
   - Tests nên độc lập (không phụ thuộc vào nhau)
   - Sử dụng descriptive test names
   - Mock external dependencies
   - Test cả happy path và error cases

4. Coverage:
   - Aim for >80% line coverage
   - Focus on business logic, not getters/setters
   - Test edge cases và error handling

5. Common Mistakes:
   - ❌ Testing framework code (Spring, JPA)
   - ❌ Testing getters/setters
   - ❌ Too many assertions in one test
   - ❌ Tests that depend on each other
   - ✅ Test business logic
   - ✅ Test error handling
   - ✅ Use mocks for dependencies

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 12, bạn nên:
- ✅ Hiểu JUnit 5 annotations và assertions
- ✅ Sử dụng Mockito để mock dependencies
- ✅ Viết unit tests cho service layer
- ✅ Đạt >80% test coverage
- ✅ Sử dụng AssertJ cho fluent assertions
- ✅ Test cả success và error scenarios

---

## 🔗 **Resources**

- **JUnit 5 User Guide**: https://junit.org/junit5/docs/current/user-guide/
- **Mockito Documentation**: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html
- **AssertJ Documentation**: https://assertj.github.io/doc/
- **JaCoCo Maven Plugin**: https://www.jacoco.org/jacoco/trunk/doc/maven.html

Chúc bạn luyện tập tốt.