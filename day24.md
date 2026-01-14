## 📅 Kế hoạch luyện tập Day 24

### **Buổi sáng (4h): JUnit 5 Advanced & Mockito Advanced**

---

## 🎯 **Exercise 1: JUnit 5 Advanced** (1.5h)

**Mục tiêu:** Parameterized tests, test lifecycle

**Yêu cầu:**

### **1.1 Parameterized Tests**
1. Basic parameterized test:
```java
@ParameterizedTest
@ValueSource(ints = {1, 3, 5, 7, 9})
void testIsOdd(int number) {
    assertTrue(number % 2 == 1);
}

@ParameterizedTest
@ValueSource(strings = {"hello", "world", "test"})
void testStringLength(String str) {
    assertTrue(str.length() > 0);
}
```

2. Multiple arguments:
```java
@ParameterizedTest
@CsvSource({
    "1, 2, 3",
    "4, 5, 9",
    "10, 20, 30"
})
void testAddition(int a, int b, int expected) {
    assertEquals(expected, a + b);
}

@ParameterizedTest
@CsvFileSource(resources = "/test-data.csv")
void testFromCsvFile(int a, int b, int expected) {
    assertEquals(expected, a + b);
}
```

3. Method source:
```java
@ParameterizedTest
@MethodSource("provideTestData")
void testWithMethodSource(int input, int expected) {
    assertEquals(expected, input * 2);
}

static Stream<Arguments> provideTestData() {
    return Stream.of(
        Arguments.of(1, 2),
        Arguments.of(2, 4),
        Arguments.of(3, 6)
    );
}
```

4. Arguments source:
```java
@ParameterizedTest
@ArgumentsSource(CustomArgumentsProvider.class)
void testWithCustomProvider(String input, boolean expected) {
    assertEquals(expected, input.length() > 5);
}

static class CustomArgumentsProvider implements ArgumentsProvider {
    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
        return Stream.of(
            Arguments.of("short", false),
            Arguments.of("very long string", true)
        );
    }
}
```

### **1.2 Test Lifecycle**
1. Lifecycle annotations:
```java
class TestLifecycleExample {
    
    @BeforeAll
    static void setUpAll() {
        System.out.println("Before all tests");
    }
    
    @AfterAll
    static void tearDownAll() {
        System.out.println("After all tests");
    }
    
    @BeforeEach
    void setUp() {
        System.out.println("Before each test");
    }
    
    @AfterEach
    void tearDown() {
        System.out.println("After each test");
    }
    
    @Test
    void test1() {
        System.out.println("Test 1");
    }
    
    @Test
    void test2() {
        System.out.println("Test 2");
    }
}
```

2. Test execution order:
```java
@TestMethodOrder(OrderAnnotation.class)
class OrderedTests {
    
    @Test
    @Order(3)
    void testThird() {
        System.out.println("Third");
    }
    
    @Test
    @Order(1)
    void testFirst() {
        System.out.println("First");
    }
    
    @Test
    @Order(2)
    void testSecond() {
        System.out.println("Second");
    }
}
```

### **1.3 Nested Tests**
1. Nested test classes:
```java
@DisplayName("Product Service Tests")
class ProductServiceTest {
    
    @Nested
    @DisplayName("Create Product")
    class CreateProductTests {
        @Test
        void shouldCreateProductSuccessfully() {
            // Test
        }
        
        @Test
        void shouldThrowExceptionWhenNameIsNull() {
            // Test
        }
    }
    
    @Nested
    @DisplayName("Update Product")
    class UpdateProductTests {
        @Test
        void shouldUpdateProductSuccessfully() {
            // Test
        }
    }
}
```

### **1.4 Dynamic Tests**
1. Dynamic test generation:
```java
@TestFactory
Stream<DynamicTest> dynamicTests() {
    return Stream.of("apple", "banana", "orange")
        .map(fruit -> DynamicTest.dynamicTest(
            "Test " + fruit,
            () -> assertNotNull(fruit)
        ));
}
```

---

## 🎯 **Exercise 2: Mockito Advanced** (2h)

**Mục tiêu:** Argument matchers, verify interactions

**Yêu cầu:**

### **2.1 Argument Matchers**
1. Basic matchers:
```java
@Test
void testArgumentMatchers() {
    when(productRepository.findById(anyLong()))
        .thenReturn(Optional.of(testProduct));
    
    when(productRepository.findByName(anyString()))
        .thenReturn(Optional.of(testProduct));
    
    when(productRepository.save(any(Product.class)))
        .thenReturn(testProduct);
    
    // Verify with matchers
    verify(productRepository).findById(eq(1L));
    verify(productRepository).save(argThat(product -> 
        product.getName().equals("Laptop")));
}
```

2. Custom argument matcher:
```java
@Test
void testCustomMatcher() {
    when(productRepository.save(argThat(product -> 
        product.getPrice().compareTo(BigDecimal.valueOf(100)) > 0)))
        .thenReturn(testProduct);
    
    Product product = new Product();
    product.setPrice(BigDecimal.valueOf(150));
    productRepository.save(product);
    
    verify(productRepository).save(argThat(product -> 
        product.getPrice().compareTo(BigDecimal.valueOf(100)) > 0));
}
```

3. Argument captor:
```java
@Captor
ArgumentCaptor<Product> productCaptor;

@Test
void testArgumentCaptor() {
    productService.createProduct(createRequest);
    
    verify(productRepository).save(productCaptor.capture());
    Product capturedProduct = productCaptor.getValue();
    
    assertEquals("Laptop", capturedProduct.getName());
    assertEquals(BigDecimal.valueOf(999.99), capturedProduct.getPrice());
}
```

### **2.2 Verify Interactions**
1. Verify method calls:
```java
@Test
void testVerifyInteractions() {
    productService.getProductById(1L);
    
    // Verify method was called
    verify(productRepository).findById(1L);
    
    // Verify method was called exactly once
    verify(productRepository, times(1)).findById(1L);
    
    // Verify method was never called
    verify(productRepository, never()).deleteById(anyLong());
    
    // Verify method was called at least once
    verify(productRepository, atLeastOnce()).findById(1L);
    
    // Verify method was called at most 3 times
    verify(productRepository, atMost(3)).findById(1L);
}
```

2. Verify call order:
```java
@Test
void testVerifyOrder() {
    InOrder inOrder = inOrder(productRepository, categoryRepository);
    
    productService.createProduct(createRequest);
    
    inOrder.verify(categoryRepository).findById(1L);
    inOrder.verify(productRepository).save(any(Product.class));
}
```

3. Verify no more interactions:
```java
@Test
void testVerifyNoMoreInteractions() {
    productService.getProductById(1L);
    
    verify(productRepository).findById(1L);
    verifyNoMoreInteractions(productRepository);
}
```

### **2.3 Stubbing Behavior**
1. Multiple stubs:
```java
@Test
void testMultipleStubs() {
    when(productRepository.findById(1L))
        .thenReturn(Optional.of(testProduct))
        .thenThrow(new RuntimeException("Not found"));
    
    // First call returns product
    Optional<Product> product1 = productRepository.findById(1L);
    assertTrue(product1.isPresent());
    
    // Second call throws exception
    assertThrows(RuntimeException.class, () -> 
        productRepository.findById(1L));
}
```

2. Stub void methods:
```java
@Test
void testVoidMethodStub() {
    doNothing().when(productRepository).deleteById(1L);
    doThrow(new RuntimeException()).when(productRepository).deleteById(2L);
    
    productService.deleteProduct(1L); // Should not throw
    assertThrows(RuntimeException.class, () -> 
        productService.deleteProduct(2L));
}
```

3. Answer for complex stubbing:
```java
@Test
void testAnswer() {
    when(productRepository.save(any(Product.class)))
        .thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(1L);
            return product;
        });
    
    Product product = new Product();
    product.setName("Laptop");
    Product saved = productRepository.save(product);
    
    assertEquals(1L, saved.getId());
}
```

### **2.4 Spy**
1. Using spy:
```java
@Test
void testSpy() {
    List<String> list = new ArrayList<>();
    List<String> spyList = spy(list);
    
    // Stub size method
    when(spyList.size()).thenReturn(100);
    
    spyList.add("one");
    spyList.add("two");
    
    assertEquals(100, spyList.size()); // Stubbed
    verify(spyList).add("one");
    verify(spyList).add("two");
}
```

2. Spy on real object:
```java
@Test
void testSpyOnRealObject() {
    ProductService realService = new ProductService(productRepository);
    ProductService spyService = spy(realService);
    
    // Stub one method, call real implementation for others
    doReturn(testProduct).when(spyService).getProductById(1L);
    
    Product product = spyService.getProductById(1L);
    assertEquals(testProduct, product);
}
```

---

## 🎯 **Exercise 3: Practice - Write Comprehensive Tests** (0.5h)

**Mục tiêu:** Test edge cases, error scenarios

**Yêu cầu:**

1. Write comprehensive tests for ProductService:
```java
@ExtendWith(MockitoExtension.class)
class ProductServiceComprehensiveTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @InjectMocks
    private ProductService productService;
    
    @Test
    @DisplayName("Should create product with valid data")
    void testCreateProduct_Success() {
        // Test success case
    }
    
    @Test
    @DisplayName("Should throw exception when category not found")
    void testCreateProduct_CategoryNotFound() {
        // Test error case
    }
    
    @Test
    @DisplayName("Should throw exception when price is negative")
    void testCreateProduct_NegativePrice() {
        // Test validation
    }
    
    @ParameterizedTest
    @ValueSource(ints = {-1, 0, 1000})
    @DisplayName("Should handle different stock values")
    void testCreateProduct_StockValues(int stock) {
        // Test edge cases
    }
    
    @Test
    @DisplayName("Should update product and evict cache")
    void testUpdateProduct_CacheEviction() {
        // Test cache interaction
    }
}
```

---

### **Buổi tối (4h): Integration Testing**

---

## 🎯 **Exercise 4: Integration Testing** (2h)

**Mục tiêu:** @SpringBootTest, @WebMvcTest, @DataJpaTest

**Yêu cầu:**

### **4.1 @SpringBootTest**
1. Full integration test:
```java
@SpringBootTest
@Transactional
@AutoConfigureMockMvc
class ProductServiceIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Test
    void testCreateProduct() throws Exception {
        // Create category
        Category category = new Category();
        category.setName("Electronics");
        category = categoryRepository.save(category);
        
        // Create product request
        CreateProductRequest request = new CreateProductRequest();
        request.setName("Laptop");
        request.setPrice(new BigDecimal("999.99"));
        request.setStock(10);
        request.setCategoryId(category.getId());
        
        // Send request
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop"));
        
        // Verify in database
        List<Product> products = productRepository.findAll();
        assertEquals(1, products.size());
    }
}
```

### **4.2 @WebMvcTest**
1. Web layer test:
```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ProductService productService;
    
    @Test
    void testGetProduct() throws Exception {
        ProductResponse response = ProductResponse.builder()
                .id(1L)
                .name("Laptop")
                .build();
        
        when(productService.getProductById(1L)).thenReturn(response);
        
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Laptop"));
    }
}
```

### **4.3 @DataJpaTest**
1. Repository test:
```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ProductRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void testFindByCategoryId() {
        // Create category
        Category category = new Category();
        category.setName("Electronics");
        category = entityManager.persistAndFlush(category);
        
        // Create products
        Product product1 = new Product();
        product1.setName("Laptop");
        product1.setCategory(category);
        entityManager.persistAndFlush(product1);
        
        Product product2 = new Product();
        product2.setName("Mouse");
        product2.setCategory(category);
        entityManager.persistAndFlush(product2);
        
        // Test
        List<Product> products = productRepository.findByCategoryId(category.getId());
        assertEquals(2, products.size());
    }
}
```

### **4.4 Test Slices**
1. @JsonTest:
```java
@JsonTest
class ProductResponseTest {
    
    @Autowired
    private JacksonTester<ProductResponse> json;
    
    @Test
    void testSerialize() throws Exception {
        ProductResponse response = ProductResponse.builder()
                .id(1L)
                .name("Laptop")
                .price(new BigDecimal("999.99"))
                .build();
        
        assertThat(json.write(response))
                .extractingJsonPathNumberValue("$.id")
                .isEqualTo(1);
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Write Integration Tests** (2h)

**Mục tiêu:** Test service interactions

**Yêu cầu:**

1. Test Order Service:
```java
@SpringBootTest
@Transactional
class OrderServiceIntegrationTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @MockBean
    private EventPublisher eventPublisher;
    
    @Test
    void testCreateOrder() {
        // Setup
        Product product = createTestProduct();
        CreateOrderRequest request = new CreateOrderRequest();
        request.setUserId(1L);
        request.setItems(List.of(new OrderItemDTO(product.getId(), 2)));
        
        // Execute
        OrderResponse response = orderService.createOrder(request);
        
        // Verify
        assertNotNull(response.getId());
        verify(eventPublisher).publishOrderCreated(any());
    }
}
```

2. Test Payment Service:
```java
@SpringBootTest
@Transactional
class PaymentServiceIntegrationTest {
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @MockBean
    private EventPublisher eventPublisher;
    
    @Test
    void testProcessPayment() {
        ProcessPaymentRequest request = new ProcessPaymentRequest();
        request.setOrderId(1L);
        request.setAmount(new BigDecimal("100.00"));
        
        PaymentResponse response = paymentService.processPayment(request);
        
        assertNotNull(response.getId());
        assertEquals("COMPLETED", response.getStatus());
        verify(eventPublisher).publishPaymentProcessed(any());
    }
}
```

3. Test Event Flow:
```java
@SpringBootTest
class EventFlowIntegrationTest {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @Test
    void testOrderToPaymentFlow() throws InterruptedException {
        // Create order
        OrderResponse order = orderService.createOrder(createOrderRequest());
        
        // Wait for event
        Thread.sleep(1000);
        
        // Process payment (should be triggered by event)
        PaymentResponse payment = paymentService.processPayment(
            createPaymentRequest(order.getId()));
        
        assertNotNull(payment);
    }
}
```

---

## 📝 **Checklist Day 24**

### Buổi sáng:
- [ ] Exercise 1.1: Parameterized Tests
- [ ] Exercise 1.2: Test Lifecycle
- [ ] Exercise 1.3: Nested Tests
- [ ] Exercise 1.4: Dynamic Tests
- [ ] Exercise 2.1: Argument Matchers
- [ ] Exercise 2.2: Verify Interactions
- [ ] Exercise 2.3: Stubbing Behavior
- [ ] Exercise 2.4: Spy
- [ ] Exercise 3: Practice - Write Comprehensive Tests

### Buổi tối:
- [ ] Exercise 4.1: @SpringBootTest
- [ ] Exercise 4.2: @WebMvcTest
- [ ] Exercise 4.3: @DataJpaTest
- [ ] Exercise 4.4: Test Slices
- [ ] Exercise 5: Project 2 - Write Integration Tests
- [ ] Test: Run all integration tests
- [ ] Test: Verify test coverage

---

## 💡 **Tips**

1. Testing Best Practices:
   - ✅ Test one thing per test method
   - ✅ Use descriptive test names
   - ✅ Arrange-Act-Assert pattern
   - ✅ Test edge cases and error scenarios

2. Integration Tests:
   - ✅ Use @Transactional for cleanup
   - ✅ Use @MockBean for external dependencies
   - ✅ Test real database interactions
   - ✅ Keep tests independent

3. Test Organization:
   - ✅ Group related tests with @Nested
   - ✅ Use @DisplayName for readable test names
   - ✅ Separate unit and integration tests
   - ✅ Maintain test data separately

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 24, bạn nên:
- ✅ Sử dụng parameterized tests
- ✅ Hiểu test lifecycle
- ✅ Sử dụng Mockito advanced features
- ✅ Viết integration tests với @SpringBootTest
- ✅ Sử dụng @WebMvcTest và @DataJpaTest
- ✅ Viết integration tests cho Project 2

---

## 🔗 **Resources**

- **JUnit 5**: https://junit.org/junit5/docs/current/user-guide/
- **Mockito**: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html
- **Spring Boot Testing**: https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing

Chúc bạn luyện tập tốt! 🚀
