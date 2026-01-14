## 📅 Kế hoạch luyện tập Day 38

### **Buổi sáng (4h): Project 3 - Frontend Development**

---

## 🎯 **Exercise 1: Project 3 - Frontend Development** (4h)

**Mục tiêu:** Build UI components

**Yêu cầu:**

### **1.1 Create Components**
1. Product List:
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

2. Shopping Cart:
```javascript
function ShoppingCart() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart.map(item => (
        <CartItem 
          key={item.id} 
          item={item} 
          onRemove={removeFromCart}
        />
      ))}
    </div>
  );
}
```

3. Order Form:
```javascript
function OrderForm() {
  const [order, setOrder] = useState({
    items: [],
    shippingAddress: '',
    paymentMethod: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', order);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

### **Buổi tối (4h): Project 3 - Authentication Flow**

---

## 🎯 **Exercise 2: Project 3 - Authentication Flow** (4h)

**Mục tiêu:** JWT in frontend, protected routes

**Yêu cầu:**

### **2.1 Authentication Service**
1. Auth service:
```javascript
import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
```

### **2.2 Protected Routes**
1. Protected route component:
```javascript
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
}
```

### **2.3 API Interceptor**
1. Add token to requests:
```javascript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

## 📝 **Checklist Day 38**

### Buổi sáng:
- [ ] Exercise 1: Project 3 - Frontend Development
- [ ] Create: Product List component
- [ ] Create: Shopping Cart component
- [ ] Create: Order Form component

### Buổi tối:
- [ ] Exercise 2: Project 3 - Authentication Flow
- [ ] Create: Authentication service
- [ ] Create: Protected routes
- [ ] Setup: API interceptor

---

## 💡 **Tips**

1. Frontend:
   - ✅ Use React hooks
   - ✅ Handle loading states
   - ✅ Handle errors
   - ✅ Use context for state management

2. Authentication:
   - ✅ Store token securely
   - ✅ Handle token expiration
   - ✅ Protect routes
   - ✅ Add logout functionality

---

## 🎯 **Mục tiêu cuối ngày**

Sau Day 38, bạn nên:
- ✅ Build UI components
- ✅ Implement shopping cart
- ✅ Implement authentication
- ✅ Protect routes

---

## 🔗 **Resources**

- **React**: https://react.dev/
- **React Router**: https://reactrouter.com/

Chúc bạn luyện tập tốt! 🚀
