Đang kiểm tra nội dung Day 18 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 18 - Advanced JPA: Query Methods, JPQL, Native Queries & Product Service:

## 📅 Kế hoạch luyện tập Day 18

### **Buổi sáng (4h): Spring Data JPA Query Methods & JPQL**

---

## 🎯 **Exercise 1: Spring Data JPA Query Methods** (1.5h)

**Mục tiêu:** Sử dụng Spring Data JPA query methods (findBy, countBy, custom methods)

**Yêu cầu:**

### **1.1 Query Method Naming Conventions**
1. Tạo Repository với query methods:
```java
package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find by single field
    Optional<Product> findByName(String name);
    List<Product> findByCategory(String category);
    List<Product> findByPrice(BigDecimal price);
    
    // Find by multiple fields (AND)
    List<Product> findByNameAndCategory(String name, String category);
    List<Product> findByPriceAndInStock(BigDecimal price, Boolean inStock);
    
    // Find by multiple fields (OR)
    List<Product> findByNameOrCategory(String name, String category);
    
    // Find with comparison operators
    List<Product> findByPriceGreaterThan(BigDecimal price);
    List<Product> findByPriceLessThan(BigDecimal price);
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findByPriceGreaterThanEqual(BigDecimal price);
    
    // Find with LIKE
    List<Product> findByNameContaining(String name);
    List<Product> findByNameLike(String pattern);
    List<Product> findByNameStartingWith(String prefix);
    List<Product> findByNameEndingWith(String suffix);
    
    // Find with IN
    List<Product> findByCategoryIn(List<String> categories);
    List<Product> findByIdIn(List<Long> ids);
    
    // Find with NULL check
    List<Product> findByDescriptionIsNull();
    List<Product> findByDescriptionIsNotNull();
    
    // Find with boolean
    List<Product> findByInStockTrue();
    List<Product> findByInStockFalse();
    
    // Count methods
    Long countByCategory(String category);
    Long countByInStock(Boolean inStock);
    Long countByPriceGreaterThan(BigDecimal price);
    
    // Exists methods
    Boolean existsByName(String name);
    Boolean existsByCategoryAndInStock(String category, Boolean inStock);
    
    // Delete methods
    void deleteByCategory(String category);
    void deleteByInStockFalse();
    
    // Find with ordering
    List<Product> findByCategoryOrderByPriceAsc(String category);
    List<Product> findByCategoryOrderByPriceDesc(String category);
    List<Product> findByCategoryOrderByNameAscPriceDesc(String category);
    
    // Find with limit (Top/First)
    Product findFirstByCategoryOrderByPriceAsc(String category);
    Product findTopByCategoryOrderByPriceDesc(String category);
    List<Product> findTop5ByCategoryOrderByPriceAsc(String category);
    List<Product> findFirst10ByInStockTrueOrderByCreatedAtDesc();
    
    // Find with distinct
    List<String> findDistinctCategory();
    List<Product> findDistinctByCategory(String category);
    
    // Find with ignore case
    List<Product> findByNameIgnoreCase(String name);
    List<Product> findByNameContainingIgnoreCase(String name);
}
```

### **1.2 Complex Query Methods**
1. Nested properties:
```java
// Assuming Product has a relationship with Category entity
List<Product> findByCategoryName(String categoryName);
List<Product> findByCategoryNameAndPriceGreaterThan(String categoryName, BigDecimal price);
List<Product> findByCategoryNameIn(List<String> categoryNames);

// Assuming Product has a relationship with User (seller)
List<Product> findBySellerId(Long sellerId);
List<Product> findBySellerUsername(String username);
List<Product> findBySellerIdAndInStockTrue(Long sellerId);
```

### **1.3 Practice Examples**
1. Tạo Product Entity để test:
```java
package com.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String description;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    private String category;
    
    private Integer stock;
    
    @Column(nullable = false)
    private Boolean inStock = true;
    
    private String imageUrl;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

2. Test query methods:
```java
@SpringBootTest
class ProductRepositoryTest {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void testFindByCategory() {
        List<Product> products = productRepository.findByCategory("Electronics");
        assertThat(products).isNotEmpty();
    }
    
    @Test
    void testFindByPriceBetween() {
        List<Product> products = productRepository.findByPriceBetween(
            new BigDecimal("100"), 
            new BigDecimal("500")
        );
        assertThat(products).isNotEmpty();
    }
    
    @Test
    void testFindTop5ByCategoryOrderByPriceAsc() {
        List<Product> products = productRepository.findTop5ByCategoryOrderByPriceAsc("Electronics");
        assertThat(products).hasSizeLessThanOrEqualTo(5);
    }
}
```

---

## 🎯 **Exercise 2: Custom Queries - JPQL** (1.5h)

**Mục tiêu:** Viết custom queries với JPQL và named queries

**Yêu cầu:**

### **2.1 JPQL Basics**
1. JPQL với @Query:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Simple JPQL query
    @Query("SELECT p FROM Product p WHERE p.category = ?1")
    List<Product> findByCategoryJPQL(String category);
    
    // JPQL with named parameters
    @Query("SELECT p FROM Product p WHERE p.price > :minPrice AND p.price < :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") BigDecimal min, 
                                    @Param("maxPrice") BigDecimal max);
    
    // JPQL with multiple conditions
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.inStock = true")
    List<Product> findAvailableByCategory(@Param("category") String category);
    
    // JPQL with LIKE
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    // JPQL with ordering
    @Query("SELECT p FROM Product p WHERE p.category = :category ORDER BY p.price ASC")
    List<Product> findByCategoryOrderByPrice(@Param("category") String category);
    
    // JPQL with LIMIT (using Pageable)
    @Query("SELECT p FROM Product p WHERE p.inStock = true ORDER BY p.createdAt DESC")
    List<Product> findLatestAvailableProducts(Pageable pageable);
    
    // JPQL with COUNT
    @Query("SELECT COUNT(p) FROM Product p WHERE p.category = :category")
    Long countByCategoryJPQL(@Param("category") String category);
    
    // JPQL with aggregate functions
    @Query("SELECT AVG(p.price) FROM Product p WHERE p.category = :category")
    BigDecimal findAveragePriceByCategory(@Param("category") String category);
    
    @Query("SELECT MAX(p.price) FROM Product p WHERE p.category = :category")
    BigDecimal findMaxPriceByCategory(@Param("category") String category);
    
    @Query("SELECT MIN(p.price) FROM Product p WHERE p.category = :category")
    BigDecimal findMinPriceByCategory(@Param("category") String category);
    
    // JPQL with GROUP BY
    @Query("SELECT p.category, COUNT(p) FROM Product p GROUP BY p.category")
    List<Object[]> countProductsByCategory();
    
    @Query("SELECT p.category, AVG(p.price) FROM Product p GROUP BY p.category")
    List<Object[]> findAveragePriceByCategoryGrouped();
    
    // JPQL with HAVING
    @Query("SELECT p.category, COUNT(p) FROM Product p GROUP BY p.category HAVING COUNT(p) > :minCount")
    List<Object[]> findCategoriesWithMinProducts(@Param("minCount") Long minCount);
    
    // JPQL with IN
    @Query("SELECT p FROM Product p WHERE p.category IN :categories")
    List<Product> findByCategories(@Param("categories") List<String> categories);
    
    // JPQL with subquery
    @Query("SELECT p FROM Product p WHERE p.price = (SELECT MAX(p2.price) FROM Product p2)")
    List<Product> findMostExpensiveProducts();
    
    // JPQL with JOIN (if Product has relationships)
    // @Query("SELECT p FROM Product p JOIN p.category c WHERE c.name = :categoryName")
    // List<Product> findByCategoryName(@Param("categoryName") String categoryName);
}
```

### **2.2 Named Queries**
1. Define named queries in Entity:
```java
@Entity
@Table(name = "products")
@NamedQueries({
    @NamedQuery(
        name = "Product.findByCategoryAndPriceRange",
        query = "SELECT p FROM Product p WHERE p.category = :category AND p.price BETWEEN :minPrice AND :maxPrice"
    ),
    @NamedQuery(
        name = "Product.findAvailableProducts",
        query = "SELECT p FROM Product p WHERE p.inStock = true ORDER BY p.price ASC"
    ),
    @NamedQuery(
        name = "Product.searchProducts",
        query = "SELECT p FROM Product p WHERE p.name LIKE CONCAT('%', :keyword, '%') OR p.description LIKE CONCAT('%', :keyword, '%')"
    )
})
public class Product {
    // ... entity fields
}
```

2. Use named queries in Repository:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Use named query
    List<Product> findByCategoryAndPriceRange(@Param("category") String category,
                                              @Param("minPrice") BigDecimal minPrice,
                                              @Param("maxPrice") BigDecimal maxPrice);
    
    List<Product> findAvailableProducts();
    
    List<Product> searchProducts(@Param("keyword") String keyword);
}
```

### **2.3 DTO Projections**
1. Create DTO for projection:
```java
package com.ecommerce.product.dto;

public interface ProductSummary {
    Long getId();
    String getName();
    BigDecimal getPrice();
    String getCategory();
}

// Or using class
@Data
@AllArgsConstructor
public class ProductSummaryDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String category;
}
```

2. Use projection in query:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Interface projection
    @Query("SELECT p.id as id, p.name as name, p.price as price, p.category as category FROM Product p WHERE p.category = :category")
    List<ProductSummary> findProductSummariesByCategory(@Param("category") String category);
    
    // Constructor projection
    @Query("SELECT new com.ecommerce.product.dto.ProductSummaryDTO(p.id, p.name, p.price, p.category) FROM Product p WHERE p.category = :category")
    List<ProductSummaryDTO> findProductDTOsByCategory(@Param("category") String category);
}
```

### **2.4 Modifying Queries**
1. Update queries:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Update query
    @Modifying
    @Query("UPDATE Product p SET p.price = :newPrice WHERE p.id = :id")
    void updatePrice(@Param("id") Long id, @Param("newPrice") BigDecimal newPrice);
    
    @Modifying
    @Query("UPDATE Product p SET p.stock = p.stock - :quantity WHERE p.id = :id AND p.stock >= :quantity")
    int decreaseStock(@Param("id") Long id, @Param("quantity") Integer quantity);
    
    @Modifying
    @Query("UPDATE Product p SET p.inStock = false WHERE p.stock = 0")
    void markOutOfStock();
    
    // Delete query
    @Modifying
    @Query("DELETE FROM Product p WHERE p.category = :category AND p.inStock = false")
    void deleteOutOfStockByCategory(@Param("category") String category);
}
```

2. Important: Add @Transactional in Service:
```java
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public void updateProductPrice(Long id, BigDecimal newPrice) {
        productRepository.updatePrice(id, newPrice);
    }
}
```

---

## 🎯 **Exercise 3: Practice - Write Custom Queries** (1h)

**Mục tiêu:** Viết complex queries với JPQL

**Yêu cầu:**

1. Viết các queries sau:
   - Tìm products có price trong top 10% đắt nhất
   - Tìm products được tạo trong tháng hiện tại
   - Tìm categories có nhiều hơn 5 products
   - Tìm products có tên chứa keyword và sắp xếp theo relevance
   - Update stock cho tất cả products trong một category

---

### **Buổi tối (4h): Native Queries & Product Service**

---

## 🎯 **Exercise 4: Native Queries** (1h)

**Mục tiêu:** Sử dụng native SQL queries

**Yêu cầu:**

### **4.1 Native Query Basics**
1. Native queries với @Query:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Simple native query
    @Query(value = "SELECT * FROM products WHERE category = ?1", nativeQuery = true)
    List<Product> findByCategoryNative(String category);
    
    // Native query with named parameters
    @Query(value = "SELECT * FROM products WHERE price BETWEEN :minPrice AND :maxPrice", nativeQuery = true)
    List<Product> findByPriceRangeNative(@Param("minPrice") BigDecimal min, 
                                         @Param("maxPrice") BigDecimal max);
    
    // Native query with LIKE
    @Query(value = "SELECT * FROM products WHERE name LIKE %:keyword% OR description LIKE %:keyword%", nativeQuery = true)
    List<Product> searchProductsNative(@Param("keyword") String keyword);
    
    // Native query with COUNT
    @Query(value = "SELECT COUNT(*) FROM products WHERE category = :category", nativeQuery = true)
    Long countByCategoryNative(@Param("category") String category);
    
    // Native query with aggregate
    @Query(value = "SELECT AVG(price) FROM products WHERE category = :category", nativeQuery = true)
    BigDecimal findAveragePriceNative(@Param("category") String category);
    
    // Native query with GROUP BY
    @Query(value = "SELECT category, COUNT(*) as count FROM products GROUP BY category", nativeQuery = true)
    List<Object[]> countProductsByCategoryNative();
    
    // Native query with complex conditions
    @Query(value = """
        SELECT * FROM products 
        WHERE category = :category 
        AND in_stock = true 
        AND price <= :maxPrice 
        ORDER BY price ASC 
        LIMIT :limit
        """, nativeQuery = true)
    List<Product> findAffordableProducts(@Param("category") String category,
                                        @Param("maxPrice") BigDecimal maxPrice,
                                        @Param("limit") Integer limit);
    
    // Native query with JOIN
    // Assuming products table has seller_id foreign key
    @Query(value = """
        SELECT p.* FROM products p 
        INNER JOIN users u ON p.seller_id = u.id 
        WHERE u.username = :username
        """, nativeQuery = true)
    List<Product> findBySellerUsernameNative(@Param("username") String username);
    
    // Native modifying query
    @Modifying
    @Query(value = "UPDATE products SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity", nativeQuery = true)
    int decreaseStockNative(@Param("id") Long id, @Param("quantity") Integer quantity);
    
    // Native delete query
    @Modifying
    @Query(value = "DELETE FROM products WHERE category = :category AND in_stock = false", nativeQuery = true)
    void deleteOutOfStockByCategoryNative(@Param("category") String category);
}
```

### **4.2 Native Query with Pagination**
1. Native query với Pageable:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Native query with pagination
    @Query(value = "SELECT * FROM products WHERE category = :category ORDER BY price ASC",
           countQuery = "SELECT COUNT(*) FROM products WHERE category = :category",
           nativeQuery = true)
    Page<Product> findByCategoryNativePaged(@Param("category") String category, Pageable pageable);
    
    // Native query with sorting
    @Query(value = "SELECT * FROM products WHERE in_stock = true ORDER BY :sortBy :sortDir",
           nativeQuery = true)
    List<Product> findAvailableProductsSorted(@Param("sortBy") String sortBy, 
                                              @Param("sortDir") String sortDir);
    // Note: Dynamic sorting in native queries is tricky, consider using Specifications instead
}
```

### **4.3 When to Use Native Queries**
- ✅ Complex queries that are difficult in JPQL
- ✅ Database-specific features (window functions, CTEs)
- ✅ Performance-critical queries
- ⚠️ Trade-off: Less portable, harder to maintain

---

## 🎯 **Exercise 5: Project 2 - Product Service** (3h)

**Mục tiêu:** Implement Product Service với CRUD, search, inventory management

**Yêu cầu:**

### **5.1 Product Service Setup**
1. Product Service `pom.xml` (tương tự User Service):
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
</dependencies>
```

2. `application.yml`:
```yaml
server:
  port: 8082

spring:
  application:
    name: product-service
  datasource:
    url: jdbc:postgresql://localhost:5432/product_db
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### **5.2 Product Entity & Repository**
1. Product Entity (đã có ở Exercise 1.3)
2. Product Repository với custom queries:
```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    // Query methods
    List<Product> findByCategory(String category);
    List<Product> findByInStockTrue();
    List<Product> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // JPQL queries
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.inStock = true")
    List<Product> findAvailableByCategory(@Param("category") String category);
    
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    
    // Native query for complex search
    @Query(value = """
        SELECT * FROM products 
        WHERE (name ILIKE %:keyword% OR description ILIKE %:keyword%)
        AND (:category IS NULL OR category = :category)
        AND (:minPrice IS NULL OR price >= :minPrice)
        AND (:maxPrice IS NULL OR price <= :maxPrice)
        AND (:inStock IS NULL OR in_stock = :inStock)
        ORDER BY 
            CASE WHEN :sortBy = 'price' AND :sortDir = 'ASC' THEN price END ASC,
            CASE WHEN :sortBy = 'price' AND :sortDir = 'DESC' THEN price END DESC,
            CASE WHEN :sortBy = 'name' AND :sortDir = 'ASC' THEN name END ASC,
            CASE WHEN :sortBy = 'name' AND :sortDir = 'DESC' THEN name END DESC
        LIMIT :limit OFFSET :offset
        """, nativeQuery = true)
    List<Product> searchProductsAdvanced(@Param("keyword") String keyword,
                                         @Param("category") String category,
                                         @Param("minPrice") BigDecimal minPrice,
                                         @Param("maxPrice") BigDecimal maxPrice,
                                         @Param("inStock") Boolean inStock,
                                         @Param("sortBy") String sortBy,
                                         @Param("sortDir") String sortDir,
                                         @Param("limit") Integer limit,
                                         @Param("offset") Integer offset);
}
```

### **5.3 DTOs**
1. Product DTOs:
```java
@Data
public class CreateProductRequest {
    @NotBlank
    private String name;
    
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;
    
    private String category;
    
    @Min(0)
    private Integer stock;
    
    private String imageUrl;
}

@Data
public class UpdateProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Integer stock;
    private String imageUrl;
}

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private Integer stock;
    private Boolean inStock;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class ProductFilter {
    private String search;
    private String category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStock;
    private String sortBy = "createdAt";
    private String sortDir = "DESC";
}
```

### **5.4 Service Layer**
1. Product Service:
```java
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = productMapper.toEntity(request);
        product.setInStock(product.getStock() > 0);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper.toResponse(product);
    }
    
    public PageResponse<ProductResponse> getAllProducts(ProductFilter filter, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        Page<Product> products = productRepository.findAll(spec, pageable);
        
        List<ProductResponse> content = products.getContent().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        
        return PageResponse.of(products).withContent(content);
    }
    
    public List<ProductResponse> searchProducts(String keyword) {
        List<Product> products = productRepository.searchProducts(keyword);
        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        productMapper.updateEntity(request, product);
        if (request.getStock() != null) {
            product.setInStock(request.getStock() > 0);
        }
        
        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }
    
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        productRepository.delete(product);
    }
    
    // Inventory management
    public ProductResponse updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new RuntimeException("Insufficient stock");
        }
        
        product.setStock(newStock);
        product.setInStock(newStock > 0);
        
        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }
    
    public ProductResponse decreaseStock(Long id, Integer quantity) {
        return updateStock(id, -quantity);
    }
    
    public ProductResponse increaseStock(Long id, Integer quantity) {
        return updateStock(id, quantity);
    }
}
```

### **5.5 Controller**
1. Product Controller:
```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        ProductFilter filter = ProductFilter.builder()
                .search(search)
                .category(category)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .inStock(inStock)
                .sortBy(sortBy)
                .sortDir(sortDir)
                .build();
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? 
                Sort.by(sortBy).ascending() : 
                Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<ProductResponse> response = productService.getAllProducts(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", response));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(@RequestParam String keyword) {
        List<ProductResponse> response = productService.searchProducts(keyword);
        return ResponseEntity.ok(ApiResponse.success("Products found", response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProductRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted", null));
    }
    
    // Inventory endpoints
    @PutMapping("/{id}/stock/increase")
    public ResponseEntity<ApiResponse<ProductResponse>> increaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        ProductResponse response = productService.increaseStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock increased", response));
    }
    
    @PutMapping("/{id}/stock/decrease")
    public ResponseEntity<ApiResponse<ProductResponse>> decreaseStock(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        ProductResponse response = productService.decreaseStock(id, quantity);
        return ResponseEntity.ok(ApiResponse.success("Stock decreased", response));
    }
}
```

---

## 📝 **Checklist Day 18**

### Buổi sáng:
- [ ] Exercise 1.1: Query Method Naming Conventions
- [ ] Exercise 1.2: Complex Query Methods (nested properties)
- [ ] Exercise 1.3: Practice Examples với Product Entity
- [ ] Exercise 2.1: JPQL Basics (@Query annotation)
- [ ] Exercise 2.2: Named Queries
- [ ] Exercise 2.3: DTO Projections
- [ ] Exercise 2.4: Modifying Queries (@Modifying)
- [ ] Exercise 3: Practice - Write Complex Queries

### Buổi tối:
- [ ] Exercise 4.1: Native Query Basics
- [ ] Exercise 4.2: Native Query with Pagination
- [ ] Exercise 4.3: Understand when to use Native Queries
- [ ] Exercise 5.1: Product Service Setup
- [ ] Exercise 5.2: Product Entity & Repository với custom queries
- [ ] Exercise 5.3: Product DTOs
- [ ] Exercise 5.4: Product Service Implementation
- [ ] Exercise 5.5: Product Controller
- [ ] Test: Product CRUD operations
- [ ] Test: Product search & filter
- [ ] Test: Inventory management

---

## 💡 **Tips**

1. Query Methods:
   - Spring Data JPA tự động generate queries từ method names
   - Follow naming conventions để tránh errors
   - Use `findBy`, `countBy`, `existsBy`, `deleteBy` prefixes

2. JPQL vs Native:
   - JPQL: Portable, type-safe, easier to maintain
   - Native: More powerful, database-specific, better performance for complex queries
   - Prefer JPQL unless you need native features

3. @Modifying Queries:
   - Always use `@Modifying` for UPDATE/DELETE queries
   - Add `@Transactional` in Service layer
   - Return type can be `void` or `int` (number of affected rows)

4. Performance:
   - Use pagination for large datasets
   - Index database columns used in WHERE clauses
   - Consider using Specifications for dynamic queries

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 18, bạn nên:
- ✅ Sử dụng Spring Data JPA query methods
- ✅ Viết custom JPQL queries
- ✅ Sử dụng named queries
- ✅ Viết native SQL queries khi cần
- ✅ Implement Product Service với CRUD
- ✅ Implement search & filter functionality
- ✅ Implement inventory management

---

## 🔗 **Resources**

- **Spring Data JPA**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods
- **JPQL Reference**: https://docs.oracle.com/javaee/7/tutorial/persistence-querylanguage.htm
- **Query Methods**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation

Chúc bạn luyện tập tốt.