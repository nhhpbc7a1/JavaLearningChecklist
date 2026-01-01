Đang kiểm tra nội dung Day 20 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 20 - JPA Performance Optimization & Testing:

## 📅 Kế hoạch luyện tập Day 20

### **Buổi sáng (4h): Entity Graphs & Fetch Strategies**

---

## 🎯 **Exercise 1: Entity Graphs** (2h)

**Mục tiêu:** Sử dụng @EntityGraph để giải quyết N+1 problem

**Yêu cầu:**

### **1.1 Understanding N+1 Problem**
1. N+1 Problem example:
```java
// This causes N+1 queries
List<Product> products = productRepository.findAll();
for (Product product : products) {
    Category category = product.getCategory(); // Lazy fetch - triggers query
    System.out.println(category.getName()); // Query for each product!
}
// Result: 1 query for products + N queries for categories = N+1 queries
```

### **1.2 @EntityGraph Basics**
1. Define Entity Graph in Entity:
```java
@Entity
@Table(name = "products")
@NamedEntityGraphs({
    @NamedEntityGraph(
        name = "Product.withCategory",
        attributeNodes = @NamedAttributeNode("category")
    ),
    @NamedEntityGraph(
        name = "Product.withCategoryAndSeller",
        attributeNodes = {
            @NamedAttributeNode("category"),
            @NamedAttributeNode("seller")
        }
    ),
    @NamedEntityGraph(
        name = "Product.withAll",
        attributeNodes = {
            @NamedAttributeNode("category"),
            @NamedAttributeNode("seller"),
            @NamedAttributeNode("reviews")
        }
    )
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private BigDecimal price;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User seller;
    
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<Review> reviews;
}
```

2. Use Entity Graph in Repository:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Using named entity graph
    @EntityGraph(value = "Product.withCategory")
    List<Product> findAll();
    
    @EntityGraph(value = "Product.withCategory")
    Optional<Product> findById(Long id);
    
    @EntityGraph(value = "Product.withCategoryAndSeller")
    Page<Product> findAll(Pageable pageable);
    
    // Using attributePaths (inline entity graph)
    @EntityGraph(attributePaths = {"category"})
    List<Product> findByCategoryName(String categoryName);
    
    @EntityGraph(attributePaths = {"category", "seller"})
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Multiple entity graphs
    @EntityGraph(value = "Product.withAll", type = EntityGraph.EntityGraphType.FETCH)
    @Query("SELECT p FROM Product p WHERE p.inStock = true")
    List<Product> findAvailableProducts();
    
    // Entity graph with specifications
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll(Specification<Product> spec);
}
```

### **1.3 Entity Graph Types**
1. FETCH vs LOAD:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // FETCH: Overrides fetch type to EAGER for specified attributes
    @EntityGraph(value = "Product.withCategory", type = EntityGraph.EntityGraphType.FETCH)
    List<Product> findAll();
    
    // LOAD: Only loads specified attributes, others follow default fetch type
    @EntityGraph(value = "Product.withCategory", type = EntityGraph.EntityGraphType.LOAD)
    List<Product> findAll();
}
```

### **1.4 Nested Entity Graphs**
1. Entity Graph với nested relationships:
```java
@Entity
@Table(name = "products")
@NamedEntityGraph(
    name = "Product.withCategoryAndSeller",
    attributeNodes = {
        @NamedAttributeNode("category"),
        @NamedAttributeNode(value = "seller", subgraph = "sellerDetails")
    },
    subgraphs = {
        @NamedSubgraph(
            name = "sellerDetails",
            attributeNodes = {
                @NamedAttributeNode("profile"),
                @NamedAttributeNode("addresses")
            }
        )
    }
)
public class Product {
    // ... fields
}
```

### **1.5 Dynamic Entity Graphs**
1. Entity Graph trong Service:
```java
@Service
public class ProductService {
    
    @Autowired
    private EntityManager entityManager;
    
    public List<Product> findAllWithCategory() {
        EntityGraph<?> entityGraph = entityManager.getEntityGraph("Product.withCategory");
        
        TypedQuery<Product> query = entityManager.createQuery(
            "SELECT p FROM Product p", Product.class
        );
        query.setHint("javax.persistence.fetchgraph", entityGraph);
        
        return query.getResultList();
    }
    
    public List<Product> findAllWithCustomGraph(String... attributes) {
        EntityGraph<Product> entityGraph = entityManager.createEntityGraph(Product.class);
        for (String attribute : attributes) {
            entityGraph.addAttributeNodes(attribute);
        }
        
        TypedQuery<Product> query = entityManager.createQuery(
            "SELECT p FROM Product p", Product.class
        );
        query.setHint("javax.persistence.fetchgraph", entityGraph);
        
        return query.getResultList();
    }
}
```

---

## 🎯 **Exercise 2: Fetch Strategies** (1h)

**Mục tiêu:** Hiểu LAZY vs EAGER và performance optimization

**Yêu cầu:**

### **2.1 FetchType.LAZY vs FetchType.EAGER**
1. LAZY Loading:
```java
@Entity
public class Product {
    @ManyToOne(fetch = FetchType.LAZY) // Load only when accessed
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<Review> reviews;
}
```

2. EAGER Loading:
```java
@Entity
public class Product {
    @ManyToOne(fetch = FetchType.EAGER) // Always load
    @JoinColumn(name = "category_id")
    private Category category;
}
```

### **2.2 When to Use LAZY vs EAGER**
1. Best Practices:
```java
// ✅ Use LAZY for:
// - @ManyToOne (default is EAGER, but should be LAZY)
// - @OneToMany (default is LAZY)
// - @ManyToMany (default is LAZY)

// ⚠️ Use EAGER only when:
// - Relationship is always needed
// - Small, frequently accessed data
// - One-to-one relationships (sometimes)

@Entity
public class Product {
    // ✅ LAZY - Category might not always be needed
    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;
    
    // ✅ LAZY - Reviews are large collection
    @OneToMany(fetch = FetchType.LAZY)
    private List<Review> reviews;
    
    // ✅ EAGER - Always needed, small data
    @OneToOne(fetch = FetchType.EAGER)
    private ProductMetadata metadata;
}
```

### **2.3 Fetch Join trong JPQL**
1. Use JOIN FETCH:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // JOIN FETCH loads relationships in single query
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.inStock = true")
    List<Product> findAvailableProductsWithCategory();
    
    @Query("SELECT DISTINCT p FROM Product p JOIN FETCH p.category JOIN FETCH p.seller")
    List<Product> findAllWithCategoryAndSeller();
    
    // Multiple JOIN FETCH
    @Query("""
        SELECT DISTINCT p FROM Product p 
        JOIN FETCH p.category 
        JOIN FETCH p.seller s
        LEFT JOIN FETCH p.reviews
        WHERE p.inStock = true
        """)
    List<Product> findAvailableProductsWithAll();
}
```

### **2.4 Batch Fetching**
1. Use @BatchSize:
```java
@Entity
public class Category {
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @BatchSize(size = 10) // Load 10 products at once
    private List<Product> products;
}

// Or globally in application.yml
spring:
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
```

---

## 🎯 **Exercise 3: Practice - Optimize Queries** (1h)

**Mục tiêu:** Fix N+1 problems và cải thiện performance

**Yêu cầu:**

1. Identify N+1 problems trong Product Service:
```java
// ❌ BAD - N+1 Problem
public List<ProductResponse> getAllProducts() {
    List<Product> products = productRepository.findAll(); // 1 query
    return products.stream()
        .map(product -> {
            Category category = product.getCategory(); // N queries!
            return toResponse(product, category);
        })
        .collect(Collectors.toList());
}

// ✅ GOOD - Using Entity Graph
public List<ProductResponse> getAllProducts() {
    List<Product> products = productRepository.findAll(); // Uses @EntityGraph
    return products.stream()
        .map(product -> {
            Category category = product.getCategory(); // Already loaded!
            return toResponse(product, category);
        })
        .collect(Collectors.toList());
}

// ✅ BETTER - Using JOIN FETCH
@Query("SELECT DISTINCT p FROM Product p JOIN FETCH p.category")
List<Product> findAllWithCategory();
```

2. Optimize queries:
   - Add @EntityGraph to repositories
   - Use JOIN FETCH in JPQL
   - Add @BatchSize for collections
   - Use pagination to limit data

3. Test performance:
```java
@Test
void testQueryPerformance() {
    long start = System.currentTimeMillis();
    
    List<Product> products = productRepository.findAll(); // Without entity graph
    products.forEach(p -> p.getCategory().getName()); // Triggers N queries
    
    long end = System.currentTimeMillis();
    System.out.println("Time without optimization: " + (end - start) + "ms");
    
    start = System.currentTimeMillis();
    
    List<Product> optimized = productRepository.findAll(); // With @EntityGraph
    optimized.forEach(p -> p.getCategory().getName()); // No additional queries
    
    end = System.currentTimeMillis();
    System.out.println("Time with optimization: " + (end - start) + "ms");
}
```

---

### **Buổi tối (4h): Project 2 - Database Optimization & Testing**

---

## 🎯 **Exercise 4: Project 2 - Optimize Database Queries** (2h)

**Mục tiêu:** Add indexes và optimize queries

**Yêu cầu:**

### **4.1 Database Indexes**
1. Create indexes cho Product table:
```sql
-- Indexes for frequently queried columns
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_in_stock ON products(in_stock);
CREATE INDEX idx_product_price ON products(price);
CREATE INDEX idx_product_created_at ON products(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_product_category_stock ON products(category_id, in_stock);
CREATE INDEX idx_product_price_stock ON products(price, in_stock);

-- Index for search (if using LIKE)
CREATE INDEX idx_product_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_product_description ON products USING gin(to_tsvector('english', description));
```

2. Create indexes via JPA:
```java
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_category", columnList = "category_id"),
    @Index(name = "idx_product_in_stock", columnList = "in_stock"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_category_stock", columnList = "category_id, in_stock")
})
public class Product {
    // ... fields
}
```

### **4.2 Optimize Repository Queries**
1. Add Entity Graphs:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll();
    
    @EntityGraph(attributePaths = {"category"})
    Optional<Product> findById(Long id);
    
    @EntityGraph(attributePaths = {"category"})
    Page<Product> findAll(Pageable pageable);
    
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll(Specification<Product> spec);
    
    @EntityGraph(attributePaths = {"category"})
    List<Product> findAll(Specification<Product> spec, Pageable pageable);
}
```

2. Optimize JPQL queries:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Use JOIN FETCH instead of separate queries
    @Query("SELECT DISTINCT p FROM Product p JOIN FETCH p.category WHERE p.inStock = true")
    List<Product> findAvailableProductsWithCategory();
    
    // Use pagination
    @Query("SELECT p FROM Product p JOIN FETCH p.category WHERE p.category.name = :categoryName")
    Page<Product> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);
}
```

### **4.3 Query Optimization Tips**
1. Best practices:
```java
// ✅ DO: Use pagination
Page<Product> products = productRepository.findAll(pageable);

// ❌ DON'T: Load all data
List<Product> products = productRepository.findAll(); // Could be millions!

// ✅ DO: Use projections for specific fields
@Query("SELECT p.id, p.name, p.price FROM Product p")
List<Object[]> findProductSummaries();

// ❌ DON'T: Load full entities when only need few fields
List<Product> products = productRepository.findAll();

// ✅ DO: Use batch fetching
@BatchSize(size = 20)
@OneToMany(mappedBy = "category")
private List<Product> products;

// ✅ DO: Use @QueryHints for query optimization
@QueryHints({
    @QueryHint(name = "javax.persistence.fetchgraph", value = "Product.withCategory"),
    @QueryHint(name = "org.hibernate.cacheable", value = "true")
})
@Query("SELECT p FROM Product p WHERE p.id = :id")
Optional<Product> findByIdWithHints(@Param("id") Long id);
```

### **4.4 Enable Query Logging**
1. Configure query logging:
```yaml
spring:
  jpa:
    properties:
      hibernate:
        show_sql: true
        format_sql: true
        use_sql_comments: true
        # Log slow queries
        jdbc:
          batch_size: 20
        # Statistics
        generate_statistics: true
```

2. Analyze queries:
```java
@Configuration
public class JpaConfig {
    
    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return props -> {
            props.put("hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS", 100);
        };
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Product Service Testing** (2h)

**Mục tiêu:** Viết unit tests và integration tests cho Product Service

**Yêu cầu:**

### **5.1 Unit Tests với Mockito**
1. ProductServiceTest:
```java
@ExtendWith(MockitoExtension.class)
@DisplayName("Product Service Unit Tests")
class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @Mock
    private CategoryRepository categoryRepository;
    
    @Mock
    private ProductMapper productMapper;
    
    @InjectMocks
    private ProductService productService;
    
    private Product testProduct;
    private Category testCategory;
    private CreateProductRequest createRequest;
    private ProductResponse productResponse;
    
    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1L);
        testCategory.setName("Electronics");
        
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Laptop");
        testProduct.setPrice(new BigDecimal("999.99"));
        testProduct.setStock(10);
        testProduct.setInStock(true);
        testProduct.setCategory(testCategory);
        
        createRequest = new CreateProductRequest();
        createRequest.setName("Laptop");
        createRequest.setPrice(new BigDecimal("999.99"));
        createRequest.setStock(10);
        createRequest.setCategoryId(1L);
        
        productResponse = ProductResponse.builder()
                .id(1L)
                .name("Laptop")
                .price(new BigDecimal("999.99"))
                .build();
    }
    
    @Test
    @DisplayName("Should create product successfully")
    void testCreateProduct_Success() {
        // Arrange
        when(categoryRepository.findById(1L))
                .thenReturn(Optional.of(testCategory));
        when(productMapper.toEntity(any()))
                .thenReturn(testProduct);
        when(productRepository.save(any(Product.class)))
                .thenReturn(testProduct);
        when(productMapper.toResponse(any(Product.class)))
                .thenReturn(productResponse);
        
        // Act
        ProductResponse response = productService.createProduct(createRequest);
        
        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Laptop");
        
        verify(categoryRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }
    
    @Test
    @DisplayName("Should throw exception when category not found")
    void testCreateProduct_CategoryNotFound() {
        // Arrange
        when(categoryRepository.findById(1L))
                .thenReturn(Optional.empty());
        
        // Act & Assert
        assertThatThrownBy(() -> productService.createProduct(createRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Category not found");
        
        verify(productRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("Should get product by id successfully")
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(testProduct));
        when(productMapper.toResponse(testProduct))
                .thenReturn(productResponse);
        
        // Act
        ProductResponse response = productService.getProductById(1L);
        
        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        
        verify(productRepository).findById(1L);
    }
    
    @Test
    @DisplayName("Should update stock successfully")
    void testUpdateStock_Success() {
        // Arrange
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class)))
                .thenReturn(testProduct);
        when(productMapper.toResponse(any(Product.class)))
                .thenReturn(productResponse);
        
        // Act
        ProductResponse response = productService.increaseStock(1L, 5);
        
        // Assert
        assertThat(testProduct.getStock()).isEqualTo(15);
        verify(productRepository).save(testProduct);
    }
    
    @Test
    @DisplayName("Should throw exception when insufficient stock")
    void testDecreaseStock_InsufficientStock() {
        // Arrange
        testProduct.setStock(5);
        when(productRepository.findById(1L))
                .thenReturn(Optional.of(testProduct));
        
        // Act & Assert
        assertThatThrownBy(() -> productService.decreaseStock(1L, 10))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Insufficient stock");
    }
}
```

### **5.2 Integration Tests**
1. ProductServiceIntegrationTest:
```java
@SpringBootTest
@Transactional
@DisplayName("Product Service Integration Tests")
class ProductServiceIntegrationTest {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Test
    @DisplayName("Should create and retrieve product")
    void testCreateAndRetrieveProduct() {
        // Create category
        Category category = new Category();
        category.setName("Electronics");
        category = categoryRepository.save(category);
        
        // Create product
        CreateProductRequest request = new CreateProductRequest();
        request.setName("Laptop");
        request.setPrice(new BigDecimal("999.99"));
        request.setStock(10);
        request.setCategoryId(category.getId());
        
        ProductResponse created = productService.createProduct(request);
        
        // Retrieve product
        ProductResponse retrieved = productService.getProductById(created.getId());
        
        // Assert
        assertThat(retrieved).isNotNull();
        assertThat(retrieved.getName()).isEqualTo("Laptop");
        assertThat(retrieved.getPrice()).isEqualTo(new BigDecimal("999.99"));
    }
    
    @Test
    @DisplayName("Should search products by keyword")
    void testSearchProducts() {
        // Create products
        Category category = categoryRepository.save(new Category());
        category.setName("Electronics");
        
        Product product1 = new Product();
        product1.setName("Laptop");
        product1.setDescription("Gaming laptop");
        product1.setPrice(new BigDecimal("999.99"));
        product1.setCategory(category);
        productRepository.save(product1);
        
        Product product2 = new Product();
        product2.setName("Mouse");
        product2.setDescription("Gaming mouse");
        product2.setPrice(new BigDecimal("49.99"));
        product2.setCategory(category);
        productRepository.save(product2);
        
        // Search
        ProductFilter filter = ProductFilter.builder()
                .search("gaming")
                .build();
        
        List<ProductResponse> results = productService.searchProducts(filter);
        
        // Assert
        assertThat(results).hasSize(2);
        assertThat(results).extracting(ProductResponse::getName)
                .containsExactlyInAnyOrder("Laptop", "Mouse");
    }
    
    @Test
    @DisplayName("Should filter products by category and price")
    void testFilterProducts() {
        // Setup test data
        Category electronics = categoryRepository.save(new Category());
        electronics.setName("Electronics");
        
        Product product1 = new Product();
        product1.setName("Laptop");
        product1.setPrice(new BigDecimal("999.99"));
        product1.setCategory(electronics);
        productRepository.save(product1);
        
        Product product2 = new Product();
        product2.setName("Mouse");
        product2.setPrice(new BigDecimal("49.99"));
        product2.setCategory(electronics);
        productRepository.save(product2);
        
        // Filter
        ProductFilter filter = ProductFilter.builder()
                .categories(List.of("Electronics"))
                .minPrice(new BigDecimal("100"))
                .build();
        
        Pageable pageable = PageRequest.of(0, 10);
        PageResponse<ProductResponse> results = productService.getAllProducts(filter, pageable);
        
        // Assert
        assertThat(results.getContent()).hasSize(1);
        assertThat(results.getContent().get(0).getName()).isEqualTo("Laptop");
    }
}
```

### **5.3 Repository Tests**
1. ProductRepositoryTest:
```java
@DataJpaTest
@DisplayName("Product Repository Tests")
class ProductRepositoryTest {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    @DisplayName("Should find products by category using entity graph")
    void testFindByCategoryWithEntityGraph() {
        // Setup
        Category category = new Category();
        category.setName("Electronics");
        category = categoryRepository.save(category);
        
        Product product = new Product();
        product.setName("Laptop");
        product.setCategory(category);
        product = productRepository.save(product);
        
        // Test
        List<Product> products = productRepository.findAll(); // Uses @EntityGraph
        
        // Assert - category should be loaded (no lazy loading exception)
        assertThat(products).isNotEmpty();
        assertThat(products.get(0).getCategory()).isNotNull();
        assertThat(products.get(0).getCategory().getName()).isEqualTo("Electronics");
    }
    
    @Test
    @DisplayName("Should find products with specifications")
    void testFindWithSpecifications() {
        // Setup
        Category category = categoryRepository.save(new Category());
        category.setName("Electronics");
        
        Product product1 = new Product();
        product1.setName("Laptop");
        product1.setPrice(new BigDecimal("999.99"));
        product1.setCategory(category);
        product1.setInStock(true);
        productRepository.save(product1);
        
        Product product2 = new Product();
        product2.setName("Mouse");
        product2.setPrice(new BigDecimal("49.99"));
        product2.setCategory(category);
        product2.setInStock(false);
        productRepository.save(product2);
        
        // Test
        Specification<Product> spec = ProductSpecifications.isInStock(true)
                .and(ProductSpecifications.priceGreaterThan(new BigDecimal("100")));
        
        List<Product> products = productRepository.findAll(spec);
        
        // Assert
        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Laptop");
    }
}
```

---

## 📝 **Checklist Day 20**

### Buổi sáng:
- [ ] Exercise 1.1: Understanding N+1 Problem
- [ ] Exercise 1.2: @EntityGraph Basics
- [ ] Exercise 1.3: Entity Graph Types (FETCH vs LOAD)
- [ ] Exercise 1.4: Nested Entity Graphs
- [ ] Exercise 1.5: Dynamic Entity Graphs
- [ ] Exercise 2.1: FetchType.LAZY vs EAGER
- [ ] Exercise 2.2: When to Use LAZY vs EAGER
- [ ] Exercise 2.3: Fetch Join trong JPQL
- [ ] Exercise 2.4: Batch Fetching
- [ ] Exercise 3: Practice - Optimize Queries

### Buổi tối:
- [ ] Exercise 4.1: Create Database Indexes
- [ ] Exercise 4.2: Optimize Repository Queries với Entity Graphs
- [ ] Exercise 4.3: Query Optimization Tips
- [ ] Exercise 4.4: Enable Query Logging
- [ ] Exercise 5.1: Unit Tests với Mockito
- [ ] Exercise 5.2: Integration Tests
- [ ] Exercise 5.3: Repository Tests
- [ ] Test: Verify query performance improvements
- [ ] Test: Run all tests và check coverage

---

## 💡 **Tips**

1. Entity Graphs:
   - ✅ Always use @EntityGraph for relationships you need
   - ✅ Prefer named entity graphs for reusability
   - ✅ Use FETCH type to override lazy loading
   - ⚠️ Don't over-fetch - only load what you need

2. Fetch Strategies:
   - ✅ Default to LAZY for all relationships
   - ✅ Use EAGER only when always needed
   - ✅ Use JOIN FETCH in JPQL for better control
   - ✅ Use @BatchSize for collections

3. Performance Optimization:
   - ✅ Add indexes on frequently queried columns
   - ✅ Use pagination to limit data
   - ✅ Use projections for specific fields
   - ✅ Monitor query execution time

4. Testing:
   - ✅ Unit tests: Mock all dependencies
   - ✅ Integration tests: Test with real database
   - ✅ Test both success and error scenarios
   - ✅ Aim for >80% code coverage

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 20, bạn nên:
- ✅ Hiểu và fix N+1 problem với Entity Graphs
- ✅ Sử dụng fetch strategies đúng cách
- ✅ Optimize database queries với indexes
- ✅ Viết unit tests cho Product Service
- ✅ Viết integration tests
- ✅ Đạt >80% test coverage

---

## 🔗 **Resources**

- **Entity Graphs**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.entity-graph
- **Hibernate Performance**: https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#performance
- **JPA Fetch Strategies**: https://www.baeldung.com/jpa-entity-graph

Chúc bạn luyện tập tốt.