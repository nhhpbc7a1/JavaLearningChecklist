## 📅 Kế hoạch luyện tập Day 29

### **Buổi sáng (4h): Design Patterns - Repository, Service Layer, Factory**

---

## 🎯 **Exercise 1: Repository Pattern Deep Dive** (1.5h)

**Mục tiêu:** Implement repository pattern

**Yêu cầu:**

### **1.1 Custom Repository Interface**
1. Create base repository:
```java
public interface BaseRepository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
    boolean existsById(ID id);
}
```

2. Custom repository methods:
```java
public interface ProductRepositoryCustom {
    List<Product> findProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> searchProducts(String keyword);
    void updateStock(Long productId, Integer quantity);
}
```

3. Implement custom repository:
```java
@Repository
public class ProductRepositoryImpl implements ProductRepositoryCustom {
    
    @Autowired
    private EntityManager entityManager;
    
    @Override
    public List<Product> findProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> product = query.from(Product.class);
        
        query.select(product).where(
            cb.between(product.get("price"), minPrice, maxPrice)
        );
        
        return entityManager.createQuery(query).getResultList();
    }
    
    @Override
    public List<Product> searchProducts(String keyword) {
        String jpql = "SELECT p FROM Product p WHERE " +
                     "p.name LIKE :keyword OR p.description LIKE :keyword";
        return entityManager.createQuery(jpql, Product.class)
                .setParameter("keyword", "%" + keyword + "%")
                .getResultList();
    }
}
```

### **1.2 Repository Composition**
1. Combine interfaces:
```java
public interface ProductRepository extends 
    JpaRepository<Product, Long>, 
    ProductRepositoryCustom {
    // Additional methods
}
```

---

## 🎯 **Exercise 2: Service Layer Pattern** (1.5h)

**Mục tiêu:** Service interfaces, implementations

**Yêu cầu:**

### **2.1 Service Interface**
1. Create service interface:
```java
public interface ProductService {
    ProductResponse createProduct(CreateProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id, UpdateProductRequest request);
    void deleteProduct(Long id);
    List<ProductResponse> searchProducts(String keyword);
}
```

### **2.2 Service Implementation**
1. Implement service:
```java
@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public ProductResponse createProduct(CreateProductRequest request) {
        // Validation
        validateRequest(request);
        
        // Business logic
        Product product = toEntity(request);
        product = productRepository.save(product);
        
        // Return response
        return toResponse(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return toResponse(product);
    }
    
    private void validateRequest(CreateProductRequest request) {
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new ValidationException("Product name is required");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Product price must be positive");
        }
    }
}
```

### **2.3 Service Abstraction**
1. Use interface in controller:
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService productService;
    
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
    
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @RequestBody @Valid CreateProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

---

## 🎯 **Exercise 3: Factory Pattern** (1h)

**Mục tiêu:** Object creation patterns

**Yêu cầu:**

### **3.1 Simple Factory**
1. Create factory:
```java
public class PaymentProcessorFactory {
    
    public static PaymentProcessor createProcessor(String paymentMethod) {
        switch (paymentMethod.toUpperCase()) {
            case "CREDIT_CARD":
                return new CreditCardProcessor();
            case "PAYPAL":
                return new PayPalProcessor();
            case "BANK_TRANSFER":
                return new BankTransferProcessor();
            default:
                throw new IllegalArgumentException("Unknown payment method: " + paymentMethod);
        }
    }
}
```

### **3.2 Factory Method Pattern**
1. Abstract factory:
```java
public abstract class NotificationFactory {
    public abstract Notification createNotification(String type);
    
    public void sendNotification(String type, String message) {
        Notification notification = createNotification(type);
        notification.send(message);
    }
}

public class EmailNotificationFactory extends NotificationFactory {
    @Override
    public Notification createNotification(String type) {
        return new EmailNotification();
    }
}

public class SMSNotificationFactory extends NotificationFactory {
    @Override
    public Notification createNotification(String type) {
        return new SMSNotification();
    }
}
```

### **3.3 Spring Factory Bean**
1. Use @Bean for factory:
```java
@Configuration
public class ProcessorFactoryConfig {
    
    @Bean
    @Scope("prototype")
    public PaymentProcessor creditCardProcessor() {
        return new CreditCardProcessor();
    }
    
    @Bean
    @Scope("prototype")
    public PaymentProcessor payPalProcessor() {
        return new PayPalProcessor();
    }
    
    @Bean
    public PaymentProcessorFactory paymentProcessorFactory(
            List<PaymentProcessor> processors) {
        return new PaymentProcessorFactory(processors);
    }
}
```

---

### **Buổi tối (4h): Practice - Apply Patterns**

---

## 🎯 **Exercise 4: Practice - Apply Patterns to Code** (4h)

**Mục tiêu:** Refactor with design patterns

**Yêu cầu:**

1. Refactor Product Service:
   - Extract service interface
   - Implement custom repository methods
   - Use factory for DTO mapping

2. Refactor Payment Service:
   - Create PaymentProcessorFactory
   - Use factory method pattern

3. Apply patterns to existing code:
   - Identify opportunities for patterns
   - Refactor code to use patterns
   - Test refactored code

---

## 📝 **Checklist Day 29**

### Buổi sáng:
- [ ] Exercise 1.1: Custom Repository Interface
- [ ] Exercise 1.2: Repository Composition
- [ ] Exercise 2.1: Service Interface
- [ ] Exercise 2.2: Service Implementation
- [ ] Exercise 2.3: Service Abstraction
- [ ] Exercise 3.1: Simple Factory
- [ ] Exercise 3.2: Factory Method Pattern
- [ ] Exercise 3.3: Spring Factory Bean

### Buổi tối:
- [ ] Exercise 4: Practice - Apply Patterns to Code
- [ ] Refactor: Product Service
- [ ] Refactor: Payment Service
- [ ] Test: Verify refactored code works

---

## 💡 **Tips**

1. Repository Pattern:
   - ✅ Separate data access from business logic
   - ✅ Use custom repositories for complex queries
   - ✅ Keep repositories focused on data access

2. Service Layer:
   - ✅ Use interfaces for testability
   - ✅ Keep services focused on business logic
   - ✅ Use @Transactional appropriately

3. Factory Pattern:
   - ✅ Use for object creation complexity
   - ✅ Centralize creation logic
   - ✅ Make code more maintainable

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 29, bạn nên:
- ✅ Implement repository pattern
- ✅ Create service interfaces
- ✅ Use factory pattern
- ✅ Refactor code with patterns

---

## 🔗 **Resources**

- **Design Patterns**: https://refactoring.guru/design-patterns
- **Repository Pattern**: https://martinfowler.com/eaaCatalog/repository.html

Chúc bạn luyện tập tốt! 🚀
