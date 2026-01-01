Đang kiểm tra nội dung Day 19 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 19 - Specifications Pattern, Advanced Pagination & Product Service Enhancement:

## 📅 Kế hoạch luyện tập Day 19

### **Buổi sáng (4h): Specifications Pattern & Advanced Pagination**

---

## 🎯 **Exercise 1: Specifications Pattern** (2h)

**Mục tiêu:** Sử dụng JpaSpecificationExecutor để tạo dynamic queries

**Yêu cầu:**

### **1.1 Specifications Pattern Basics**
1. Setup Repository với JpaSpecificationExecutor:
```java
package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    // JpaSpecificationExecutor provides:
    // - findAll(Specification<T> spec)
    // - findAll(Specification<T> spec, Pageable pageable)
    // - findAll(Specification<T> spec, Sort sort)
    // - count(Specification<T> spec)
    // - exists(Specification<T> spec)
}
```

2. Tạo Specifications class:
```java
package com.ecommerce.product.specification;

import com.ecommerce.product.entity.Product;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductSpecifications {
    
    // Basic specifications
    public static Specification<Product> hasCategory(String category) {
        return (root, query, cb) -> {
            if (category == null || category.isEmpty()) {
                return cb.conjunction(); // Always true
            }
            return cb.equal(root.get("category"), category);
        };
    }
    
    public static Specification<Product> hasName(String name) {
        return (root, query, cb) -> {
            if (name == null || name.isEmpty()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("name"), name);
        };
    }
    
    public static Specification<Product> isInStock(Boolean inStock) {
        return (root, query, cb) -> {
            if (inStock == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("inStock"), inStock);
        };
    }
    
    // Comparison specifications
    public static Specification<Product> priceGreaterThan(BigDecimal price) {
        return (root, query, cb) -> {
            if (price == null) {
                return cb.conjunction();
            }
            return cb.greaterThan(root.get("price"), price);
        };
    }
    
    public static Specification<Product> priceLessThan(BigDecimal price) {
        return (root, query, cb) -> {
            if (price == null) {
                return cb.conjunction();
            }
            return cb.lessThan(root.get("price"), price);
        };
    }
    
    public static Specification<Product> priceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            if (minPrice == null && maxPrice == null) {
                return cb.conjunction();
            }
            if (minPrice != null && maxPrice != null) {
                return cb.between(root.get("price"), minPrice, maxPrice);
            }
            if (minPrice != null) {
                return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
    
    // LIKE specifications
    public static Specification<Product> nameContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("name")), "%" + keyword.toLowerCase() + "%");
        };
    }
    
    public static Specification<Product> descriptionContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) {
                return cb.conjunction();
            }
            return cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%");
        };
    }
    
    public static Specification<Product> nameOrDescriptionContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isEmpty()) {
                return cb.conjunction();
            }
            String searchPattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), searchPattern),
                cb.like(cb.lower(root.get("description")), searchPattern)
            );
        };
    }
    
    // IN specifications
    public static Specification<Product> categoryIn(List<String> categories) {
        return (root, query, cb) -> {
            if (categories == null || categories.isEmpty()) {
                return cb.conjunction();
            }
            return root.get("category").in(categories);
        };
    }
    
    public static Specification<Product> idIn(List<Long> ids) {
        return (root, query, cb) -> {
            if (ids == null || ids.isEmpty()) {
                return cb.conjunction();
            }
            return root.get("id").in(ids);
        };
    }
    
    // Date specifications
    public static Specification<Product> createdAfter(LocalDateTime date) {
        return (root, query, cb) -> {
            if (date == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("createdAt"), date);
        };
    }
    
    public static Specification<Product> createdBefore(LocalDateTime date) {
        return (root, query, cb) -> {
            if (date == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), date);
        };
    }
    
    public static Specification<Product> createdBetween(LocalDateTime start, LocalDateTime end) {
        return (root, query, cb) -> {
            if (start == null && end == null) {
                return cb.conjunction();
            }
            if (start != null && end != null) {
                return cb.between(root.get("createdAt"), start, end);
            }
            if (start != null) {
                return cb.greaterThanOrEqualTo(root.get("createdAt"), start);
            }
            return cb.lessThanOrEqualTo(root.get("createdAt"), end);
        };
    }
    
    // Stock specifications
    public static Specification<Product> stockGreaterThan(Integer stock) {
        return (root, query, cb) -> {
            if (stock == null) {
                return cb.conjunction();
            }
            return cb.greaterThan(root.get("stock"), stock);
        };
    }
    
    public static Specification<Product> stockLessThan(Integer stock) {
        return (root, query, cb) -> {
            if (stock == null) {
                return cb.conjunction();
            }
            return cb.lessThan(root.get("stock"), stock);
        };
    }
}
```

### **1.2 Combining Specifications**
1. Combine multiple specifications:
```java
public class ProductSpecifications {
    
    // Combine specifications with AND
    public static Specification<Product> buildSpecification(ProductFilter filter) {
        Specification<Product> spec = Specification.where(null);
        
        if (filter.getCategory() != null && !filter.getCategory().isEmpty()) {
            spec = spec.and(hasCategory(filter.getCategory()));
        }
        
        if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
            spec = spec.and(nameOrDescriptionContains(filter.getSearch()));
        }
        
        if (filter.getMinPrice() != null) {
            spec = spec.and(priceGreaterThan(filter.getMinPrice()));
        }
        
        if (filter.getMaxPrice() != null) {
            spec = spec.and(priceLessThan(filter.getMaxPrice()));
        }
        
        if (filter.getInStock() != null) {
            spec = spec.and(isInStock(filter.getInStock()));
        }
        
        if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
            spec = spec.and(categoryIn(filter.getCategories()));
        }
        
        return spec;
    }
    
    // Complex combination with OR
    public static Specification<Product> findPopularOrNewProducts() {
        Specification<Product> popular = priceBetween(
            new BigDecimal("50"), 
            new BigDecimal("200")
        ).and(isInStock(true));
        
        Specification<Product> newProducts = createdAfter(
            LocalDateTime.now().minusDays(7)
        );
        
        return popular.or(newProducts);
    }
}
```

### **1.3 Using Specifications in Service**
1. Service implementation:
```java
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public PageResponse<ProductResponse> getAllProducts(ProductFilter filter, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        
        Page<Product> products = productRepository.findAll(spec, pageable);
        
        List<ProductResponse> content = products.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        
        return PageResponse.of(products).withContent(content);
    }
    
    public List<ProductResponse> searchProducts(ProductFilter filter) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        
        List<Product> products = productRepository.findAll(spec);
        
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public Long countProducts(ProductFilter filter) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        return productRepository.count(spec);
    }
}
```

### **1.4 Advanced Specifications**
1. Custom predicates với CriteriaBuilder:
```java
public class ProductSpecifications {
    
    // Custom specification with subquery
    public static Specification<Product> hasAveragePriceAbove(BigDecimal threshold) {
        return (root, query, cb) -> {
            Subquery<BigDecimal> subquery = query.subquery(BigDecimal.class);
            Root<Product> subRoot = subquery.from(Product.class);
            subquery.select(cb.avg(subRoot.get("price")))
                    .where(cb.equal(subRoot.get("category"), root.get("category")));
            
            return cb.greaterThan(subquery, threshold);
        };
    }
    
    // Specification with JOIN
    public static Specification<Product> hasCategoryWithName(String categoryName) {
        return (root, query, cb) -> {
            // If Product has Category relationship
            // Join<Product, Category> categoryJoin = root.join("category");
            // return cb.equal(categoryJoin.get("name"), categoryName);
            
            // For simple case (category is String)
            return cb.equal(root.get("category"), categoryName);
        };
    }
    
    // Specification with CASE WHEN
    public static Specification<Product> orderByPriceRange() {
        return (root, query, cb) -> {
            // This is more for ordering, but can be used in WHERE
            Expression<String> priceRange = cb.selectCase()
                .when(cb.lessThan(root.get("price"), new BigDecimal("100")), "LOW")
                .when(cb.between(root.get("price"), new BigDecimal("100"), new BigDecimal("500")), "MEDIUM")
                .otherwise("HIGH");
            
            query.orderBy(cb.asc(priceRange));
            return cb.conjunction();
        };
    }
}
```

---

## 🎯 **Exercise 2: Pagination & Sorting Advanced** (1h)

**Mục tiêu:** Custom pagination và sorting strategies

**Yêu cầu:**

### **2.1 Custom Pageable**
1. Tạo custom Pageable implementation:
```java
package com.ecommerce.product.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtil {
    
    public static Pageable createPageable(int page, int size, String sortBy, String sortDir) {
        // Validate and set defaults
        page = Math.max(0, page);
        size = Math.max(1, Math.min(size, 100)); // Max 100 items per page
        
        Sort sort = createSort(sortBy, sortDir);
        return PageRequest.of(page, size, sort);
    }
    
    public static Sort createSort(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.isEmpty()) {
            sortBy = "createdAt"; // Default sort field
        }
        
        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDir) ? 
            Sort.Direction.ASC : Sort.Direction.DESC;
        
        return Sort.by(direction, sortBy);
    }
    
    public static Sort createMultiSort(String[] sortBy, String[] sortDir) {
        Sort sort = Sort.unsorted();
        
        if (sortBy != null && sortBy.length > 0) {
            for (int i = 0; i < sortBy.length; i++) {
                Sort.Direction direction = (i < sortDir.length && "ASC".equalsIgnoreCase(sortDir[i])) ?
                    Sort.Direction.ASC : Sort.Direction.DESC;
                
                if (i == 0) {
                    sort = Sort.by(direction, sortBy[i]);
                } else {
                    sort = sort.and(Sort.by(direction, sortBy[i]));
                }
            }
        }
        
        return sort;
    }
}
```

### **2.2 Custom Sorting Strategies**
1. Multiple field sorting:
```java
@Service
public class ProductService {
    
    public PageResponse<ProductResponse> getAllProducts(
            ProductFilter filter,
            int page,
            int size,
            String[] sortBy,
            String[] sortDir) {
        
        Sort sort = PaginationUtil.createMultiSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        Page<Product> products = productRepository.findAll(spec, pageable);
        
        // ... convert to response
    }
}
```

2. Custom sort by computed field:
```java
public class ProductSpecifications {
    
    // Sort by price range (computed)
    public static Specification<Product> sortByPriceRange() {
        return (root, query, cb) -> {
            Expression<String> priceRange = cb.selectCase()
                .when(cb.lessThan(root.get("price"), new BigDecimal("100")), "1-LOW")
                .when(cb.between(root.get("price"), new BigDecimal("100"), new BigDecimal("500")), "2-MEDIUM")
                .otherwise("3-HIGH");
            
            query.orderBy(cb.asc(priceRange), cb.asc(root.get("name")));
            return cb.conjunction();
        };
    }
}
```

### **2.3 Pagination Metadata**
1. Enhanced PageResponse:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    private boolean hasNext;
    private boolean hasPrevious;
    private int numberOfElements;
    
    public static <T> PageResponse<T> of(Page<T> page) {
        return PageResponse.<T>builder()
            .content(page.getContent())
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .first(page.isFirst())
            .last(page.isLast())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .numberOfElements(page.getNumberOfElements())
            .build();
    }
    
    public PageResponse<T> withContent(List<T> newContent) {
        this.content = newContent;
        return this;
    }
}
```

---

## 🎯 **Exercise 3: Practice - Build Search with Specifications** (1h)

**Mục tiêu:** Xây dựng dynamic search với specifications

**Yêu cầu:**

1. Tạo ProductFilter với nhiều options:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilter {
    private String search;
    private List<String> categories;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean inStock;
    private Integer minStock;
    private Integer maxStock;
    private LocalDateTime createdAfter;
    private LocalDateTime createdBefore;
    private String[] sortBy;
    private String[] sortDir;
}
```

2. Build comprehensive specification:
```java
public static Specification<Product> buildAdvancedSpecification(ProductFilter filter) {
    Specification<Product> spec = Specification.where(null);
    
    // Search in name or description
    if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
        spec = spec.and(nameOrDescriptionContains(filter.getSearch()));
    }
    
    // Category filter
    if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
        spec = spec.and(categoryIn(filter.getCategories()));
    }
    
    // Price range
    if (filter.getMinPrice() != null || filter.getMaxPrice() != null) {
        spec = spec.and(priceBetween(filter.getMinPrice(), filter.getMaxPrice()));
    }
    
    // Stock status
    if (filter.getInStock() != null) {
        spec = spec.and(isInStock(filter.getInStock()));
    }
    
    // Stock quantity range
    if (filter.getMinStock() != null) {
        spec = spec.and(stockGreaterThan(filter.getMinStock()));
    }
    if (filter.getMaxStock() != null) {
        spec = spec.and(stockLessThan(filter.getMaxStock()));
    }
    
    // Date range
    if (filter.getCreatedAfter() != null || filter.getCreatedBefore() != null) {
        spec = spec.and(createdBetween(filter.getCreatedAfter(), filter.getCreatedBefore()));
    }
    
    return spec;
}
```

3. Test với different filter combinations

---

### **Buổi tối (4h): Project 2 - Advanced Product Queries & Categories**

---

## 🎯 **Exercise 4: Project 2 - Advanced Product Queries** (2h)

**Mục tiêu:** Implement advanced search, filter, pagination cho Product Service

**Yêu cầu:**

### **4.1 Enhanced Product Specifications**
1. Update ProductSpecifications với tất cả filters:
```java
public class ProductSpecifications {
    
    public static Specification<Product> buildSpecification(ProductFilter filter) {
        Specification<Product> spec = Specification.where(null);
        
        // Search
        if (filter.getSearch() != null && !filter.getSearch().isEmpty()) {
            spec = spec.and(nameOrDescriptionContains(filter.getSearch()));
        }
        
        // Categories
        if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
            spec = spec.and(categoryIn(filter.getCategories()));
        }
        
        // Price range
        spec = spec.and(priceBetween(filter.getMinPrice(), filter.getMaxPrice()));
        
        // Stock status
        if (filter.getInStock() != null) {
            spec = spec.and(isInStock(filter.getInStock()));
        }
        
        // Stock quantity
        if (filter.getMinStock() != null) {
            spec = spec.and(stockGreaterThan(filter.getMinStock()));
        }
        if (filter.getMaxStock() != null) {
            spec = spec.and(stockLessThan(filter.getMaxStock()));
        }
        
        // Date range
        spec = spec.and(createdBetween(filter.getCreatedAfter(), filter.getCreatedBefore()));
        
        return spec;
    }
}
```

### **4.2 Enhanced Product Service**
1. Update ProductService với advanced queries:
```java
@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    public PageResponse<ProductResponse> getAllProducts(ProductFilter filter, Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        Page<Product> products = productRepository.findAll(spec, pageable);
        
        List<ProductResponse> content = products.getContent().stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
        
        return PageResponse.of(products).withContent(content);
    }
    
    public List<ProductResponse> searchProducts(ProductFilter filter) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        List<Product> products = productRepository.findAll(spec);
        
        return products.stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getProductStatistics(ProductFilter filter) {
        Specification<Product> spec = ProductSpecifications.buildSpecification(filter);
        
        List<Product> products = productRepository.findAll(spec);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", products.size());
        stats.put("totalValue", products.stream()
                .map(p -> p.getPrice().multiply(new BigDecimal(p.getStock())))
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        stats.put("averagePrice", products.stream()
                .map(Product::getPrice)
                .collect(Collectors.averagingDouble(p -> p.doubleValue())));
        stats.put("categories", products.stream()
                .map(Product::getCategory)
                .distinct()
                .collect(Collectors.toList()));
        
        return stats;
    }
}
```

### **4.3 Enhanced Product Controller**
1. Update ProductController với advanced endpoints:
```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) Integer minStock,
            @RequestParam(required = false) Integer maxStock,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAfter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdBefore,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        ProductFilter filter = ProductFilter.builder()
                .search(search)
                .categories(categories)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .inStock(inStock)
                .minStock(minStock)
                .maxStock(maxStock)
                .createdAfter(createdAfter)
                .createdBefore(createdBefore)
                .build();
        
        Pageable pageable = PaginationUtil.createPageable(page, size, sortBy, sortDir);
        
        PageResponse<ProductResponse> response = productService.getAllProducts(filter, pageable);
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", response));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        ProductFilter filter = ProductFilter.builder()
                .search(search)
                .categories(categories)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .build();
        
        List<ProductResponse> response = productService.searchProducts(filter);
        return ResponseEntity.ok(ApiResponse.success("Products found", response));
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProductStatistics(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean inStock) {
        
        ProductFilter filter = ProductFilter.builder()
                .categories(category != null ? List.of(category) : null)
                .inStock(inStock)
                .build();
        
        Map<String, Object> stats = productService.getProductStatistics(filter);
        return ResponseEntity.ok(ApiResponse.success("Statistics retrieved", stats));
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Product Categories** (2h)

**Mục tiêu:** Implement Category management cho Product Service

**Yêu cầu:**

### **5.1 Category Entity**
1. Create Category Entity:
```java
package com.ecommerce.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String name;
    
    private String description;
    
    private String imageUrl;
    
    private Boolean active = true;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
```

2. Update Product Entity để có relationship với Category:
```java
@Entity
@Table(name = "products")
public class Product {
    // ... existing fields
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Remove String category field if exists
    // private String category; // Remove this
}
```

### **5.2 Category Repository**
1. Category Repository:
```java
package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
    Optional<Category> findByName(String name);
    Boolean existsByName(String name);
    List<Category> findByActiveTrue();
}
```

### **5.3 Category DTOs**
1. Category DTOs:
```java
package com.ecommerce.product.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    private String imageUrl;
}

@Data
public class UpdateCategoryRequest {
    private String name;
    private String description;
    private String imageUrl;
    private Boolean active;
}

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Boolean active;
    private Long productCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### **5.4 Category Service**
1. Category Service:
```java
package com.ecommerce.product.service;

import com.ecommerce.product.dto.*;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setActive(true);
        
        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }
    
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return toResponse(category);
    }
    
    public List<CategoryResponse> getAllCategories(Boolean activeOnly) {
        List<Category> categories;
        if (activeOnly != null && activeOnly) {
            categories = categoryRepository.findByActiveTrue();
        } else {
            categories = categoryRepository.findAll();
        }
        
        return categories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (request.getName() != null && !request.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(request.getName())) {
                throw new RuntimeException("Category name already exists");
            }
            category.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }
        
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }
        
        Category updated = categoryRepository.save(category);
        return toResponse(updated);
    }
    
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (!category.getProducts().isEmpty()) {
            throw new RuntimeException("Cannot delete category with existing products");
        }
        
        categoryRepository.delete(category);
    }
    
    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .active(category.getActive())
                .productCount((long) category.getProducts().size())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
```

### **5.5 Category Controller**
1. Category Controller:
```java
package com.ecommerce.product.controller;

import com.ecommerce.product.dto.*;
import com.ecommerce.product.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved", response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories(
            @RequestParam(required = false) Boolean activeOnly) {
        List<CategoryResponse> response = categoryService.getAllCategories(activeOnly);
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved", response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted", null));
    }
}
```

### **5.6 Update Product Service for Categories**
1. Update ProductService để sử dụng Category:
```java
@Service
public class ProductService {
    
    private final CategoryRepository categoryRepository;
    
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = productMapper.toEntity(request);
        
        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        
        product.setInStock(product.getStock() > 0);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }
}
```

---

## 📝 **Checklist Day 19**

### Buổi sáng:
- [ ] Exercise 1.1: Specifications Pattern Basics
- [ ] Exercise 1.2: Combining Specifications (AND, OR)
- [ ] Exercise 1.3: Using Specifications in Service
- [ ] Exercise 1.4: Advanced Specifications (subquery, JOIN)
- [ ] Exercise 2.1: Custom Pageable
- [ ] Exercise 2.2: Custom Sorting Strategies
- [ ] Exercise 2.3: Pagination Metadata
- [ ] Exercise 3: Practice - Build Search with Specifications

### Buổi tối:
- [ ] Exercise 4.1: Enhanced Product Specifications
- [ ] Exercise 4.2: Enhanced Product Service với advanced queries
- [ ] Exercise 4.3: Enhanced Product Controller
- [ ] Exercise 5.1: Category Entity với relationship
- [ ] Exercise 5.2: Category Repository
- [ ] Exercise 5.3: Category DTOs
- [ ] Exercise 5.4: Category Service
- [ ] Exercise 5.5: Category Controller
- [ ] Exercise 5.6: Update Product Service for Categories
- [ ] Test: Advanced product search & filter
- [ ] Test: Category CRUD operations
- [ ] Test: Products with categories

---

## 💡 **Tips**

1. Specifications Pattern:
   - ✅ Type-safe, reusable, composable
   - ✅ Better than string concatenation for dynamic queries
   - ✅ Works well with pagination and sorting
   - ✅ Can combine multiple specifications with AND/OR

2. Pagination Best Practices:
   - Set reasonable page size limits (max 100)
   - Always return total count
   - Support multiple sort fields
   - Use indexes on sorted columns

3. Category Management:
   - Use relationships instead of String category
   - Prevent deletion of categories with products
   - Support soft delete (active/inactive)
   - Count products per category

4. Performance:
   - Index foreign keys (category_id)
   - Use lazy loading for relationships
   - Consider caching for frequently accessed categories

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 19, bạn nên:
- ✅ Sử dụng Specifications Pattern cho dynamic queries
- ✅ Implement advanced pagination & sorting
- ✅ Build comprehensive search & filter functionality
- ✅ Implement Category management
- ✅ Link Products với Categories qua relationships
- ✅ Test advanced queries với different filters

---

## 🔗 **Resources**

- **JPA Specifications**: https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications
- **Criteria API**: https://docs.oracle.com/javaee/7/tutorial/persistence-criteria.htm
- **Pagination**: https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.query-methods.query-creation

Chúc bạn luyện tập tốt.