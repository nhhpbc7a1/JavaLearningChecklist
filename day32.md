## 📅 Kế hoạch luyện tập Day 32

### **Buổi sáng (4h): Clean Code - Naming & Functions**

---

## 🎯 **Exercise 1: Clean Code - Naming** (2h)

**Mục tiêu:** Meaningful names, conventions

**Yêu cầu:**

### **1.1 Meaningful Names**
1. Bad names:
```java
// ❌ BAD
int d; // elapsed time in days
List<String> list;
String data;
```

2. Good names:
```java
// ✅ GOOD
int elapsedTimeInDays;
List<String> productNames;
String userEmail;
```

### **1.2 Naming Conventions**
1. Classes: PascalCase
```java
public class ProductService {}
public class OrderController {}
```

2. Methods: camelCase
```java
public void createOrder() {}
public ProductResponse getProductById(Long id) {}
```

3. Constants: UPPER_SNAKE_CASE
```java
public static final int MAX_RETRY_ATTEMPTS = 3;
public static final String DEFAULT_CURRENCY = "USD";
```

4. Variables: camelCase
```java
String productName;
BigDecimal totalAmount;
```

---

## 🎯 **Exercise 2: Clean Code - Functions** (2h)

**Mục tiêu:** Small functions, single purpose

**Yêu cầu:**

### **2.1 Small Functions**
1. Bad example:
```java
// ❌ BAD - Too long, does multiple things
public void processOrder(Order order) {
    // Validate order (50 lines)
    // Calculate total (30 lines)
    // Apply discount (40 lines)
    // Save to database (20 lines)
    // Send email (30 lines)
    // Update inventory (25 lines)
}
```

2. Good example:
```java
// ✅ GOOD - Small, focused functions
public void processOrder(Order order) {
    validateOrder(order);
    calculateTotal(order);
    applyDiscount(order);
    saveOrder(order);
    sendConfirmationEmail(order);
    updateInventory(order);
}

private void validateOrder(Order order) {
    // Validation logic
}

private void calculateTotal(Order order) {
    // Calculation logic
}
```

### **2.2 Single Purpose**
1. Functions should do one thing:
```java
// ✅ GOOD
public BigDecimal calculateTotal(List<OrderItem> items) {
    return items.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}
```

---

### **Buổi tối (4h): Refactoring Techniques**

---

## 🎯 **Exercise 3: Refactoring Techniques** (2h)

**Mục tiêu:** Extract method, extract class

**Yêu cầu:**

### **3.1 Extract Method**
1. Before:
```java
public void printOrder(Order order) {
    System.out.println("Order ID: " + order.getId());
    System.out.println("Customer: " + order.getCustomerName());
    System.out.println("Total: " + order.getTotal());
    // ... more printing
}
```

2. After:
```java
public void printOrder(Order order) {
    printOrderHeader(order);
    printOrderItems(order);
    printOrderTotal(order);
}

private void printOrderHeader(Order order) {
    System.out.println("Order ID: " + order.getId());
    System.out.println("Customer: " + order.getCustomerName());
}
```

### **3.2 Extract Class**
1. Before:
```java
public class OrderService {
    // Order management methods
    // Email sending methods
    // Invoice generation methods
    // Inventory update methods
}
```

2. After:
```java
public class OrderService {
    @Autowired
    private EmailService emailService;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InventoryService inventoryService;
    
    // Only order management methods
}
```

---

## 🎯 **Exercise 4: Practice - Refactor Messy Code** (2h)

**Mục tiêu:** Apply refactoring techniques

**Yêu cầu:**

1. Find messy code in your projects
2. Apply extract method
3. Apply extract class
4. Improve naming
5. Make functions smaller
6. Test refactored code

---

## 📝 **Checklist Day 32**

### Buổi sáng:
- [ ] Exercise 1.1: Meaningful Names
- [ ] Exercise 1.2: Naming Conventions
- [ ] Exercise 2.1: Small Functions
- [ ] Exercise 2.2: Single Purpose

### Buổi tối:
- [ ] Exercise 3.1: Extract Method
- [ ] Exercise 3.2: Extract Class
- [ ] Exercise 4: Practice - Refactor Messy Code

---

## 💡 **Tips**

1. Clean Code:
   - ✅ Use meaningful names
   - ✅ Keep functions small
   - ✅ One function, one purpose
   - ✅ Follow naming conventions

2. Refactoring:
   - ✅ Extract methods for readability
   - ✅ Extract classes for separation of concerns
   - ✅ Test after refactoring
   - ✅ Refactor incrementally

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 32, bạn nên:
- ✅ Use meaningful names
- ✅ Write small, focused functions
- ✅ Apply extract method
- ✅ Apply extract class
- ✅ Refactor existing code

---

## 🔗 **Resources**

- **Clean Code**: https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882
- **Refactoring**: https://refactoring.com/

Chúc bạn luyện tập tốt! 🚀
