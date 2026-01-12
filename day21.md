Đang kiểm tra nội dung Day 21 để lập kế hoạch luyện tập:


[2 tools called]


Kế hoạch luyện tập Day 21 - Redis Caching & Spring Cache:

## 📅 Kế hoạch luyện tập Day 21

### **Buổi sáng (4h): Redis Introduction & Spring Cache Abstraction**

---

## 🎯 **Exercise 1: Redis Introduction** (1h)

**Mục tiêu:** Hiểu Redis, use cases và setup

**Yêu cầu:**

### **1.1 What is Redis?**
1. Redis là gì:
   - In-memory data structure store
   - Used as database, cache, message broker
   - Supports strings, hashes, lists, sets, sorted sets, streams
   - Very fast (sub-millisecond latency)

2. Redis Use Cases:
   - ✅ Caching (most common)
   - ✅ Session storage
   - ✅ Real-time analytics
   - ✅ Message queue
   - ✅ Rate limiting
   - ✅ Leaderboards
   - ✅ Pub/Sub messaging

### **1.2 Redis Setup**
1. Install Redis (Windows):
```bash
# Option 1: Using WSL2 (Recommended)
wsl --install
# Then in WSL:
sudo apt update
sudo apt install redis-server
redis-server

# Option 2: Using Docker
docker run -d -p 6379:6379 --name redis redis:latest

# Option 3: Download Windows port
# https://github.com/microsoftarchive/redis/releases
```

2. Verify Redis:
```bash
# Connect to Redis CLI
redis-cli

# Test commands
PING  # Should return PONG
SET mykey "Hello Redis"
GET mykey  # Should return "Hello Redis"
```

3. Redis Data Types:
```bash
# Strings
SET name "John"
GET name

# Hashes
HSET user:1 name "John" age 30
HGET user:1 name
HGETALL user:1

# Lists
LPUSH mylist "item1"
LPUSH mylist "item2"
LRANGE mylist 0 -1

# Sets
SADD myset "member1"
SADD myset "member2"
SMEMBERS myset

# Sorted Sets
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"
ZRANGE leaderboard 0 -1 WITHSCORES

# Expiration
SET key "value" EX 60  # Expires in 60 seconds
TTL key  # Check remaining time
```

---

## 🎯 **Exercise 2: Spring Cache Abstraction** (2h)

**Mục tiêu:** Sử dụng @Cacheable, @CacheEvict, cache managers

**Yêu cầu:**

### **2.1 Spring Cache Dependencies**
1. Add dependencies:
```xml
<!-- pom.xml -->
<dependencies>
    <!-- Spring Cache -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>
    
    <!-- Redis for caching -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    
    <!-- Connection pool -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-pool2</artifactId>
    </dependency>
</dependencies>
```

2. Application configuration:
```yaml
# application.yml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 600000  # 10 minutes
      cache-null-values: false
      use-key-prefix: true
      key-prefix: "cache:"
  
  data:
    redis:
      host: localhost
      port: 6379
      password:  # Optional
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

3. Enable Caching:
```java
@SpringBootApplication
@EnableCaching  // Enable Spring Cache
public class ProductServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
}
```

### **2.2 @Cacheable Annotation**
1. Basic @Cacheable:
```java
@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Cache result by product ID
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        System.out.println("Fetching product from database: " + id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toResponse(product);
    }
    
    // Cache with condition
    @Cacheable(value = "products", key = "#id", condition = "#id > 0")
    public ProductResponse getProductByIdConditional(Long id) {
        return getProductById(id);
    }
    
    // Cache with unless (don't cache if condition is true)
    @Cacheable(value = "products", key = "#id", unless = "#result == null")
    public ProductResponse getProductByIdUnless(Long id) {
        return getProductById(id);
    }
    
    // Multiple cache names
    @Cacheable(value = {"products", "productDetails"}, key = "#id")
    public ProductResponse getProductWithDetails(Long id) {
        return getProductById(id);
    }
    
    // Custom key generator
    @Cacheable(value = "products", keyGenerator = "customKeyGenerator")
    public ProductResponse getProductCustomKey(Long id) {
        return getProductById(id);
    }
}
```

2. Custom Key Generator:
```java
@Configuration
public class CacheConfig {
    
    @Bean
    public KeyGenerator customKeyGenerator() {
        return (target, method, params) -> {
            StringBuilder key = new StringBuilder();
            key.append(target.getClass().getSimpleName());
            key.append(".");
            key.append(method.getName());
            key.append(":");
            for (Object param : params) {
                key.append(param.toString());
                key.append(",");
            }
            return key.toString();
        };
    }
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();
        
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(config)
                .transactionAware()
                .build();
    }
}
```

### **2.3 @CacheEvict Annotation**
1. Evict cache:
```java
@Service
public class ProductService {
    
    // Evict single cache entry
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    
    // Evict all entries in cache
    @CacheEvict(value = "products", allEntries = true)
    public void clearProductCache() {
        // This will clear all entries in "products" cache
    }
    
    // Evict before method execution
    @CacheEvict(value = "products", key = "#id", beforeInvocation = true)
    public void updateProduct(Long id, UpdateProductRequest request) {
        // Cache is evicted before method execution
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Update product...
    }
    
    // Evict multiple caches
    @CacheEvict(value = {"products", "productDetails"}, key = "#id")
    public void deleteProductMultiple(Long id) {
        productRepository.deleteById(id);
    }
}
```

### **2.4 @CachePut Annotation**
1. Update cache:
```java
@Service
public class ProductService {
    
    // Always execute method and update cache
    @CachePut(value = "products", key = "#result.id")
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Update product...
        productRepository.save(product);
        return toResponse(product);
    }
    
    // CachePut with condition
    @CachePut(value = "products", key = "#result.id", condition = "#result != null")
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = toEntity(request);
        product = productRepository.save(product);
        return toResponse(product);
    }
}
```

### **2.5 @Caching Annotation**
1. Multiple cache operations:
```java
@Service
public class ProductService {
    
    // Multiple cache operations
    @Caching(
        cacheable = {
            @Cacheable(value = "products", key = "#id"),
            @Cacheable(value = "productDetails", key = "#id")
        },
        evict = {
            @CacheEvict(value = "productList", allEntries = true)
        }
    )
    public ProductResponse getProductById(Long id) {
        return getProductById(id);
    }
    
    // Update multiple caches
    @Caching(
        evict = {
            @CacheEvict(value = "products", key = "#id"),
            @CacheEvict(value = "productDetails", key = "#id"),
            @CacheEvict(value = "productList", allEntries = true)
        },
        put = {
            @CachePut(value = "products", key = "#result.id")
        }
    )
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        // Update logic...
    }
}
```

### **2.6 Cache Configuration**
1. Multiple cache configurations:
```java
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Default configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()))
                .disableCachingNullValues();
        
        // Products cache - 30 minutes
        RedisCacheConfiguration productsConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(30))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        // User sessions - 1 hour
        RedisCacheConfiguration sessionsConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        cacheConfigurations.put("products", productsConfig);
        cacheConfigurations.put("productDetails", productsConfig);
        cacheConfigurations.put("sessions", sessionsConfig);
        
        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .transactionAware()
                .build();
    }
}
```

---

## 🎯 **Exercise 3: Practice - Add Caching to API** (1h)

**Mục tiêu:** Cache frequently accessed data

**Yêu cầu:**

1. Add caching to Product Service:
```java
@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Cache product by ID
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    // Cache product list (with pagination key)
    @Cacheable(value = "productList", key = "#page + '_' + #size + '_' + #sort")
    public PageResponse<ProductResponse> getAllProducts(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
        Page<Product> products = productRepository.findAll(pageable);
        return toPageResponse(products);
    }
    
    // Cache by category
    @Cacheable(value = "productsByCategory", key = "#categoryId")
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    // Evict cache on create
    @Caching(
        evict = {
            @CacheEvict(value = "productList", allEntries = true),
            @CacheEvict(value = "productsByCategory", key = "#result.categoryId")
        },
        put = {
            @CachePut(value = "products", key = "#result.id")
        }
    )
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = toEntity(request);
        product = productRepository.save(product);
        return toResponse(product);
    }
    
    // Evict cache on update
    @Caching(
        evict = {
            @CacheEvict(value = "products", key = "#id"),
            @CacheEvict(value = "productList", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true)
        },
        put = {
            @CachePut(value = "products", key = "#result.id")
        }
    )
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Update logic...
        product = productRepository.save(product);
        return toResponse(product);
    }
    
    // Evict cache on delete
    @Caching(
        evict = {
            @CacheEvict(value = "products", key = "#id"),
            @CacheEvict(value = "productList", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true)
        }
    )
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
```

2. Test caching:
```java
@SpringBootTest
class ProductServiceCacheTest {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Test
    void testCacheHit() {
        // First call - should hit database
        ProductResponse product1 = productService.getProductById(1L);
        
        // Second call - should hit cache (check logs)
        ProductResponse product2 = productService.getProductById(1L);
        
        assertThat(product1).isEqualTo(product2);
    }
    
    @Test
    void testCacheEvict() {
        // Cache product
        ProductResponse product = productService.getProductById(1L);
        
        // Update product (should evict cache)
        UpdateProductRequest request = new UpdateProductRequest();
        request.setName("Updated Name");
        productService.updateProduct(1L, request);
        
        // Get again - should hit database (cache was evicted)
        ProductResponse updated = productService.getProductById(1L);
        assertThat(updated.getName()).isEqualTo("Updated Name");
    }
}
```

---

### **Buổi tối (4h): Spring Data Redis & Project 2 Caching**

---

## 🎯 **Exercise 4: Spring Data Redis** (2h)

**Mục tiêu:** Sử dụng RedisTemplate và RedisRepository

**Yêu cầu:**

### **4.1 RedisTemplate**
1. RedisTemplate basics:
```java
@Service
public class RedisService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // String operations
    public void setString(String key, String value) {
        redisTemplate.opsForValue().set(key, value);
    }
    
    public void setStringWithTTL(String key, String value, long seconds) {
        redisTemplate.opsForValue().set(key, value, seconds, TimeUnit.SECONDS);
    }
    
    public String getString(String key) {
        return (String) redisTemplate.opsForValue().get(key);
    }
    
    public void deleteString(String key) {
        redisTemplate.delete(key);
    }
    
    // Hash operations
    public void setHash(String key, String field, Object value) {
        redisTemplate.opsForHash().put(key, field, value);
    }
    
    public Object getHash(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }
    
    public Map<Object, Object> getAllHash(String key) {
        return redisTemplate.opsForHash().entries(key);
    }
    
    public void deleteHash(String key, String field) {
        redisTemplate.opsForHash().delete(key, field);
    }
    
    // List operations
    public void pushToList(String key, Object value) {
        redisTemplate.opsForList().rightPush(key, value);
    }
    
    public Object popFromList(String key) {
        return redisTemplate.opsForList().leftPop(key);
    }
    
    public List<Object> getList(String key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end);
    }
    
    // Set operations
    public void addToSet(String key, Object value) {
        redisTemplate.opsForSet().add(key, value);
    }
    
    public Set<Object> getSet(String key) {
        return redisTemplate.opsForSet().members(key);
    }
    
    public boolean isMember(String key, Object value) {
        return redisTemplate.opsForSet().isMember(key, value);
    }
    
    // Sorted Set operations
    public void addToSortedSet(String key, Object value, double score) {
        redisTemplate.opsForZSet().add(key, value, score);
    }
    
    public Set<Object> getSortedSet(String key, long start, long end) {
        return redisTemplate.opsForZSet().range(key, start, end);
    }
    
    // Expiration
    public void setExpiration(String key, long seconds) {
        redisTemplate.expire(key, seconds, TimeUnit.SECONDS);
    }
    
    public Long getTTL(String key) {
        return redisTemplate.getExpire(key);
    }
    
    // Exists
    public Boolean exists(String key) {
        return redisTemplate.hasKey(key);
    }
}
```

2. RedisTemplate Configuration:
```java
@Configuration
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        
        // Key serializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        
        // Value serializer
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        
        template.afterPropertiesSet();
        return template;
    }
    
    @Bean
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
```

### **4.2 RedisRepository**
1. Create Redis Entity:
```java
@RedisHash("user-session")
public class UserSession {
    
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    @Indexed
    private String username;
    
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    
    // Getters and setters
}
```

2. Create Redis Repository:
```java
@Repository
public interface UserSessionRepository extends CrudRepository<UserSession, String> {
    
    // Find by userId
    List<UserSession> findByUserId(String userId);
    
    // Find by username
    List<UserSession> findByUsername(String username);
    
    // Find by token
    Optional<UserSession> findByToken(String token);
    
    // Delete by userId
    void deleteByUserId(String userId);
    
    // Delete expired sessions
    @Query("SELECT * FROM user-session WHERE expiresAt < :now")
    List<UserSession> findExpiredSessions(@Param("now") LocalDateTime now);
}
```

3. Use RedisRepository:
```java
@Service
public class SessionService {
    
    @Autowired
    private UserSessionRepository sessionRepository;
    
    public UserSession createSession(String userId, String username, String token) {
        UserSession session = new UserSession();
        session.setId(UUID.randomUUID().toString());
        session.setUserId(userId);
        session.setUsername(username);
        session.setToken(token);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(1));
        
        return sessionRepository.save(session);
    }
    
    public Optional<UserSession> getSessionByToken(String token) {
        return sessionRepository.findByToken(token);
    }
    
    public List<UserSession> getUserSessions(String userId) {
        return sessionRepository.findByUserId(userId);
    }
    
    public void deleteSession(String sessionId) {
        sessionRepository.deleteById(sessionId);
    }
    
    public void deleteUserSessions(String userId) {
        sessionRepository.deleteByUserId(userId);
    }
}
```

### **4.3 Redis Pub/Sub**
1. Redis Message Listener:
```java
@Component
public class RedisMessageListener implements MessageListener {
    
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String channel = new String(message.getChannel());
        String body = new String(message.getBody());
        
        System.out.println("Received message from channel: " + channel);
        System.out.println("Message body: " + body);
        
        // Process message
        processMessage(channel, body);
    }
    
    private void processMessage(String channel, String body) {
        // Your message processing logic
    }
}
```

2. Redis Pub/Sub Configuration:
```java
@Configuration
public class RedisPubSubConfig {
    
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            RedisMessageListener messageListener) {
        
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        
        // Subscribe to channel
        container.addMessageListener(messageListener, new ChannelTopic("product-updates"));
        container.addMessageListener(messageListener, new ChannelTopic("user-events"));
        
        return container;
    }
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
```

3. Publish messages:
```java
@Service
public class NotificationService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void publishProductUpdate(Long productId, String action) {
        Map<String, Object> message = new HashMap<>();
        message.put("productId", productId);
        message.put("action", action);
        message.put("timestamp", LocalDateTime.now());
        
        redisTemplate.convertAndSend("product-updates", message);
    }
    
    public void publishUserEvent(String userId, String event) {
        Map<String, Object> message = new HashMap<>();
        message.put("userId", userId);
        message.put("event", event);
        message.put("timestamp", LocalDateTime.now());
        
        redisTemplate.convertAndSend("user-events", message);
    }
}
```

---

## 🎯 **Exercise 5: Project 2 - Add Redis Caching** (2h)

**Mục tiêu:** Cache products và user sessions

**Yêu cầu:**

### **5.1 Cache Products**
1. Update Product Service với caching:
```java
@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String PRODUCT_CACHE_KEY = "product:";
    private static final String PRODUCT_LIST_CACHE_KEY = "product:list:";
    
    // Cache product by ID
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    // Cache product list with filters
    @Cacheable(value = "productList", key = "#filter.toString() + '_' + #pageable.toString()")
    public PageResponse<ProductResponse> searchProducts(ProductFilter filter, Pageable pageable) {
        Specification<Product> spec = buildSpecification(filter);
        Page<Product> products = productRepository.findAll(spec, pageable);
        return toPageResponse(products);
    }
    
    // Cache products by category
    @Cacheable(value = "productsByCategory", key = "#categoryId")
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    // Manual cache with RedisTemplate
    public ProductResponse getProductByIdManual(Long id) {
        String key = PRODUCT_CACHE_KEY + id;
        
        // Try to get from cache
        ProductResponse cached = (ProductResponse) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            return cached;
        }
        
        // Get from database
        ProductResponse product = productRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Store in cache
        redisTemplate.opsForValue().set(key, product, 30, TimeUnit.MINUTES);
        
        return product;
    }
    
    // Evict cache on update
    @Caching(
        evict = {
            @CacheEvict(value = "products", key = "#id"),
            @CacheEvict(value = "productList", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true)
        }
    )
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        // Update logic...
        product = productRepository.save(product);
        
        // Manual cache update
        String key = PRODUCT_CACHE_KEY + id;
        redisTemplate.opsForValue().set(key, toResponse(product), 30, TimeUnit.MINUTES);
        
        return toResponse(product);
    }
}
```

### **5.2 Cache User Sessions**
1. Implement session caching:
```java
@Service
public class SessionService {
    
    @Autowired
    private UserSessionRepository sessionRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String SESSION_CACHE_KEY = "session:";
    private static final String USER_SESSIONS_KEY = "user:sessions:";
    
    public UserSession createSession(String userId, String username, String token) {
        UserSession session = new UserSession();
        session.setId(UUID.randomUUID().toString());
        session.setUserId(userId);
        session.setUsername(username);
        session.setToken(token);
        session.setCreatedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusHours(1));
        
        session = sessionRepository.save(session);
        
        // Cache session
        String sessionKey = SESSION_CACHE_KEY + token;
        redisTemplate.opsForValue().set(sessionKey, session, 1, TimeUnit.HOURS);
        
        // Cache user sessions list
        String userSessionsKey = USER_SESSIONS_KEY + userId;
        redisTemplate.opsForSet().add(userSessionsKey, session.getId());
        redisTemplate.expire(userSessionsKey, 1, TimeUnit.HOURS);
        
        return session;
    }
    
    public Optional<UserSession> getSessionByToken(String token) {
        // Try cache first
        String sessionKey = SESSION_CACHE_KEY + token;
        UserSession cached = (UserSession) redisTemplate.opsForValue().get(sessionKey);
        if (cached != null) {
            return Optional.of(cached);
        }
        
        // Get from repository
        Optional<UserSession> session = sessionRepository.findByToken(token);
        
        // Cache if found
        session.ifPresent(s -> {
            redisTemplate.opsForValue().set(sessionKey, s, 1, TimeUnit.HOURS);
        });
        
        return session;
    }
    
    public List<UserSession> getUserSessions(String userId) {
        // Try cache first
        String userSessionsKey = USER_SESSIONS_KEY + userId;
        Set<Object> sessionIds = redisTemplate.opsForSet().members(userSessionsKey);
        
        if (sessionIds != null && !sessionIds.isEmpty()) {
            return sessionIds.stream()
                    .map(id -> sessionRepository.findById(id.toString()))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toList());
        }
        
        // Get from repository
        List<UserSession> sessions = sessionRepository.findByUserId(userId);
        
        // Cache session IDs
        if (!sessions.isEmpty()) {
            sessions.forEach(session -> {
                redisTemplate.opsForSet().add(userSessionsKey, session.getId());
            });
            redisTemplate.expire(userSessionsKey, 1, TimeUnit.HOURS);
        }
        
        return sessions;
    }
    
    public void deleteSession(String sessionId) {
        sessionRepository.deleteById(sessionId);
        
        // Remove from cache
        // Note: You might need to store token -> sessionId mapping
    }
}
```

### **5.3 Cache Statistics**
1. Add cache statistics endpoint:
```java
@RestController
@RequestMapping("/api/cache")
public class CacheController {
    
    @Autowired
    private CacheManager cacheManager;
    
    @GetMapping("/stats")
    public Map<String, Object> getCacheStats() {
        Map<String, Object> stats = new HashMap<>();
        
        if (cacheManager instanceof RedisCacheManager) {
            RedisCacheManager redisCacheManager = (RedisCacheManager) cacheManager;
            redisCacheManager.getCacheNames().forEach(cacheName -> {
                RedisCache cache = (RedisCache) redisCacheManager.getCache(cacheName);
                if (cache != null) {
                    // Get cache statistics
                    stats.put(cacheName, Map.of(
                        "name", cacheName,
                        "nativeCache", cache.getNativeCache().getClass().getSimpleName()
                    ));
                }
            });
        }
        
        return stats;
    }
    
    @PostMapping("/clear/{cacheName}")
    public ResponseEntity<Void> clearCache(@PathVariable String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/clear-all")
    public ResponseEntity<Void> clearAllCaches() {
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
            }
        });
        return ResponseEntity.ok().build();
    }
}
```

---

## 📝 **Checklist Day 21**

### Buổi sáng:
- [ ] Exercise 1.1: Understanding Redis
- [ ] Exercise 1.2: Redis Setup & Verification
- [ ] Exercise 1.3: Redis Data Types Practice
- [ ] Exercise 2.1: Spring Cache Dependencies & Configuration
- [ ] Exercise 2.2: @Cacheable Annotation
- [ ] Exercise 2.3: @CacheEvict Annotation
- [ ] Exercise 2.4: @CachePut Annotation
- [ ] Exercise 2.5: @Caching Annotation
- [ ] Exercise 2.6: Cache Configuration (Multiple caches)
- [ ] Exercise 3: Practice - Add Caching to API

### Buổi tối:
- [ ] Exercise 4.1: RedisTemplate Basics
- [ ] Exercise 4.2: RedisRepository
- [ ] Exercise 4.3: Redis Pub/Sub
- [ ] Exercise 5.1: Cache Products in Project 2
- [ ] Exercise 5.2: Cache User Sessions
- [ ] Exercise 5.3: Cache Statistics Endpoint
- [ ] Test: Verify caching works correctly
- [ ] Test: Check Redis data with redis-cli

---

## 💡 **Tips**

1. Caching Strategy:
   - ✅ Cache frequently accessed, rarely changed data
   - ✅ Set appropriate TTL based on data volatility
   - ✅ Use cache eviction on updates/deletes
   - ⚠️ Don't cache sensitive data without encryption

2. Redis Best Practices:
   - ✅ Use connection pooling
   - ✅ Set appropriate TTL for all keys
   - ✅ Monitor memory usage
   - ✅ Use Redis for session storage in distributed systems

3. Performance:
   - ✅ Use @Cacheable for read-heavy operations
   - ✅ Use @CacheEvict for write operations
   - ✅ Consider cache warming for critical data
   - ✅ Monitor cache hit rates

4. Testing:
   - ✅ Test cache hit/miss scenarios
   - ✅ Test cache eviction
   - ✅ Verify TTL expiration
   - ✅ Test with Redis CLI

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 21, bạn nên:
- ✅ Hiểu Redis và use cases
- ✅ Setup Redis và test basic commands
- ✅ Sử dụng Spring Cache annotations (@Cacheable, @CacheEvict, @CachePut)
- ✅ Configure multiple cache configurations
- ✅ Sử dụng RedisTemplate cho manual caching
- ✅ Sử dụng RedisRepository
- ✅ Implement caching cho Product Service
- ✅ Implement session caching

---

## 🔗 **Resources**

- **Spring Cache**: https://docs.spring.io/spring-framework/docs/current/reference/html/integration.html#cache
- **Spring Data Redis**: https://docs.spring.io/spring-data/redis/docs/current/reference/html/
- **Redis Commands**: https://redis.io/commands

Chúc bạn luyện tập tốt.