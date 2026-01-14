## 📅 Kế hoạch luyện tập Day 31

### **Buổi sáng (4h): SOLID Principles - Single Responsibility & Open/Closed**

---

## 🎯 **Exercise 1: Single Responsibility Principle** (2h)

**Mục tiêu:** One class, one reason to change

**Yêu cầu:**

### **1.1 Violation Example**
1. Bad example:
```java
// ❌ BAD - Multiple responsibilities
public class OrderService {
    public void createOrder(Order order) {
        // Validate order
        // Save to database
        // Send email
        // Generate invoice
        // Update inventory
    }
}
```

### **1.2 Refactored Example**
1. Good example:
```java
// ✅ GOOD - Single responsibility
@Service
public class OrderService {
    @Autowired
    private OrderValidator orderValidator;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InventoryService inventoryService;
    
    public void createOrder(Order order) {
        orderValidator.validate(order);
        orderRepository.save(order);
        emailService.sendOrderConfirmation(order);
        invoiceService.generateInvoice(order);
        inventoryService.updateInventory(order);
    }
}

@Service
public class OrderValidator {
    public void validate(Order order) {
        // Validation logic
    }
}

@Service
public class EmailService {
    public void sendOrderConfirmation(Order order) {
        // Email logic
    }
}
```

---

## 🎯 **Exercise 2: Open/Closed Principle** (2h)

**Mục tiêu:** Open for extension, closed for modification

**Yêu cầu:**

### **2.1 Violation Example**
1. Bad example:
```java
// ❌ BAD - Need to modify for new types
public class DiscountCalculator {
    public BigDecimal calculateDiscount(Order order, String type) {
        if (type.equals("STANDARD")) {
            return order.getTotal().multiply(new BigDecimal("0.1"));
        } else if (type.equals("PREMIUM")) {
            return order.getTotal().multiply(new BigDecimal("0.2"));
        }
        // Need to modify for new types
    }
}
```

### **2.2 Refactored Example**
1. Good example:
```java
// ✅ GOOD - Open for extension
public interface DiscountStrategy {
    BigDecimal calculateDiscount(Order order);
}

@Component
public class StandardDiscountStrategy implements DiscountStrategy {
    @Override
    public BigDecimal calculateDiscount(Order order) {
        return order.getTotal().multiply(new BigDecimal("0.1"));
    }
}

@Component
public class PremiumDiscountStrategy implements DiscountStrategy {
    @Override
    public BigDecimal calculateDiscount(Order order) {
        return order.getTotal().multiply(new BigDecimal("0.2"));
    }
}

@Service
public class DiscountCalculator {
    private final Map<String, DiscountStrategy> strategies;
    
    public DiscountCalculator(List<DiscountStrategy> strategies) {
        this.strategies = strategies.stream()
                .collect(Collectors.toMap(
                    s -> s.getClass().getSimpleName().replace("Strategy", "").toLowerCase(),
                    Function.identity()
                ));
    }
    
    public BigDecimal calculateDiscount(Order order, String type) {
        DiscountStrategy strategy = strategies.get(type.toLowerCase());
        return strategy.calculateDiscount(order);
    }
}
```

---

### **Buổi tối (4h): SOLID - Liskov, Interface Segregation, Dependency Inversion**

---

## 🎯 **Exercise 3: Liskov Substitution Principle** (1h)

**Mục tiêu:** Subtypes must be substitutable for their base types

**Yêu cầu:**

### **3.1 Violation Example**
1. Bad example:
```java
// ❌ BAD
public class Rectangle {
    protected int width;
    protected int height;
    
    public void setWidth(int width) { this.width = width; }
    public void setHeight(int height) { this.height = height; }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        this.width = width;
        this.height = width; // Violates LSP
    }
}
```

### **3.2 Good Example**
1. Refactored:
```java
// ✅ GOOD
public interface Shape {
    int getArea();
}

public class Rectangle implements Shape {
    private int width;
    private int height;
    
    public int getArea() {
        return width * height;
    }
}

public class Square implements Shape {
    private int side;
    
    public int getArea() {
        return side * side;
    }
}
```

---

## 🎯 **Exercise 4: Interface Segregation Principle** (1h)

**Mục tiêu:** Clients should not depend on interfaces they don't use

**Yêu cầu:**

### **4.1 Violation Example**
1. Bad example:
```java
// ❌ BAD - Fat interface
public interface Worker {
    void work();
    void eat();
    void sleep();
}

public class Human implements Worker {
    // Implements all methods
}

public class Robot implements Worker {
    // Robot doesn't need eat() or sleep()
}
```

### **4.2 Good Example**
1. Refactored:
```java
// ✅ GOOD - Segregated interfaces
public interface Workable {
    void work();
}

public interface Eatable {
    void eat();
}

public interface Sleepable {
    void sleep();
}

public class Human implements Workable, Eatable, Sleepable {
    // Implements all
}

public class Robot implements Workable {
    // Only implements work()
}
```

---

## 🎯 **Exercise 5: Dependency Inversion Principle** (2h)

**Mục tiêu:** Depend on abstractions, not concretions

**Yêu cầu:**

### **5.1 Violation Example**
1. Bad example:
```java
// ❌ BAD - Depends on concrete class
public class OrderService {
    private MySQLOrderRepository repository = new MySQLOrderRepository();
    
    public void saveOrder(Order order) {
        repository.save(order);
    }
}
```

### **5.2 Good Example**
1. Refactored:
```java
// ✅ GOOD - Depends on abstraction
public interface OrderRepository {
    void save(Order order);
    Optional<Order> findById(Long id);
}

@Service
public class OrderService {
    private final OrderRepository repository;
    
    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }
    
    public void saveOrder(Order order) {
        repository.save(order);
    }
}
```

---

## 🎯 **Exercise 6: Practice - Refactor Code with SOLID** (Optional)

**Mục tiêu:** Apply SOLID to existing code

**Yêu cầu:**

1. Identify SOLID violations
2. Refactor code
3. Apply all SOLID principles
4. Test refactored code

---

## 📝 **Checklist Day 31**

### Buổi sáng:
- [ ] Exercise 1.1: Violation Example
- [ ] Exercise 1.2: Refactored Example
- [ ] Exercise 2.1: Violation Example
- [ ] Exercise 2.2: Refactored Example

### Buổi tối:
- [ ] Exercise 3: Liskov Substitution Principle
- [ ] Exercise 4: Interface Segregation Principle
- [ ] Exercise 5: Dependency Inversion Principle
- [ ] Exercise 6: Practice - Refactor Code with SOLID

---

## 💡 **Tips**

1. SOLID Principles:
   - ✅ Single Responsibility: One class, one reason to change
   - ✅ Open/Closed: Open for extension, closed for modification
   - ✅ Liskov Substitution: Subtypes must be substitutable
   - ✅ Interface Segregation: Small, focused interfaces
   - ✅ Dependency Inversion: Depend on abstractions

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 31, bạn nên:
- ✅ Hiểu và apply Single Responsibility Principle
- ✅ Hiểu và apply Open/Closed Principle
- ✅ Hiểu và apply Liskov Substitution Principle
- ✅ Hiểu và apply Interface Segregation Principle
- ✅ Hiểu và apply Dependency Inversion Principle

---

## 🔗 **Resources**

- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID
- **Clean Code**: https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882

Chúc bạn luyện tập tốt! 🚀
