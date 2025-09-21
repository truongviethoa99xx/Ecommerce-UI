import axios from 'axios';

// Test API integration với các service đã tạo
const BASE_URL = 'http://localhost:3000';

// Tạo axios instance như trong api.js
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let adminToken = '';
let userToken = '';

const log = (message, type = 'info') => {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    info: '\x1b[36m',
    warning: '\x1b[33m'
  };
  const reset = '\x1b[0m';
  console.log(`${colors[type]}${message}${reset}`);
};

// Test authentication service
const testAuthService = async () => {
  log('🔐 Testing Frontend Auth Service Integration...', 'info');
  
  try {
    // Test admin login
    const adminLoginResponse = await api.post('/auth/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    if (adminLoginResponse.data.access_token) {
      adminToken = adminLoginResponse.data.access_token;
      log('✅ Admin login successful - Token received', 'success');
      
      // Set token in header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    }
    
    // Test user registration
    const registerResponse = await api.post('/auth/register', {
      name: 'Test User Frontend',
      email: `testfrontend${Date.now()}@example.com`,
      password: 'password123',
      phone: '+84987654321',
      address: '123 Test Street'
    });
    
    if (registerResponse.data.access_token) {
      userToken = registerResponse.data.access_token;
      log('✅ User registration successful - Token received', 'success');
    }
    
    // Test profile endpoint with user token
    const profileResponse = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    if (profileResponse.data) {
      log('✅ Profile endpoint working', 'success');
    }
    
  } catch (error) {
    log(`❌ Auth service error: ${error.response?.data?.message || error.message}`, 'error');
  }
};

// Test product service
const testProductService = async () => {
  log('🛍️ Testing Frontend Product Service Integration...', 'info');
  
  try {
    // Test get products
    const productsResponse = await api.get('/products');
    log(`✅ Get products: Found ${productsResponse.data.length || 0} products`, 'success');
    
    // Test get categories
    const categoriesResponse = await api.get('/categories');
    log(`✅ Get categories: Found ${categoriesResponse.data.length || 0} categories`, 'success');
    
    if (adminToken) {
      // Test create category (admin only)
      const categoryResponse = await api.post('/categories', {
        name: `Frontend Test Category ${Date.now()}`,
        description: 'Category created by frontend test'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (categoryResponse.data) {
        log('✅ Create category successful', 'success');
        const categoryId = categoryResponse.data.id;
        
        // Test create product (admin only)
        const productResponse = await api.post('/products', {
          name: `Frontend Test Product ${Date.now()}`,
          description: 'Product created by frontend test',
          price: 99.99,
          discount: 10,
          stock: 50,
          categoryId: categoryId,
          images: '["test-image.jpg"]'
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        if (productResponse.data) {
          log('✅ Create product successful', 'success');
          return productResponse.data.id;
        }
      }
    }
    
  } catch (error) {
    log(`❌ Product service error: ${error.response?.data?.message || error.message}`, 'error');
  }
  
  return null;
};

// Test cart service
const testCartService = async (productId) => {
  if (!userToken || !productId) {
    log('⚠️ Skipping cart test - no user token or product ID', 'warning');
    return;
  }
  
  log('🛒 Testing Frontend Cart Service Integration...', 'info');
  
  try {
    // Test get cart
    const cartResponse = await api.get('/cart', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    log('✅ Get cart successful', 'success');
    
    // Test add to cart
    const addToCartResponse = await api.post('/cart', {
      productId: productId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    if (addToCartResponse.data) {
      log('✅ Add to cart successful', 'success');
      const cartItemId = addToCartResponse.data.id;
      
      // Test update cart item
      const updateCartResponse = await api.patch(`/cart/${cartItemId}`, {
        quantity: 3
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      
      if (updateCartResponse.data) {
        log('✅ Update cart item successful', 'success');
      }
    }
    
  } catch (error) {
    log(`❌ Cart service error: ${error.response?.data?.message || error.message}`, 'error');
  }
};

// Test order service
const testOrderService = async () => {
  if (!userToken) {
    log('⚠️ Skipping order test - no user token', 'warning');
    return;
  }
  
  log('📦 Testing Frontend Order Service Integration...', 'info');
  
  try {
    // Test get my orders
    const myOrdersResponse = await api.get('/orders/my-orders', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    log('✅ Get my orders successful', 'success');
    
    // Test create order from cart
    const orderResponse = await api.post('/orders/from-cart', {
      shippingAddress: '456 Frontend Test Street',
      paymentMethod: 'credit_card',
      shippingMethod: 'standard'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    if (orderResponse.data) {
      log('✅ Create order from cart successful', 'success');
      return orderResponse.data.id;
    }
    
  } catch (error) {
    log(`❌ Order service error: ${error.response?.data?.message || error.message}`, 'error');
  }
  
  return null;
};

// Test admin services
const testAdminServices = async () => {
  if (!adminToken) {
    log('⚠️ Skipping admin tests - no admin token', 'warning');
    return;
  }
  
  log('👨‍💼 Testing Frontend Admin Services Integration...', 'info');
  
  try {
    // Test statistics
    const statsResponse = await api.get('/statistics/overview', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (statsResponse.data) {
      log('✅ Get statistics successful', 'success');
      log(`   - Total Users: ${statsResponse.data.totalUsers}`, 'info');
      log(`   - Total Products: ${statsResponse.data.totalProducts}`, 'info');
      log(`   - Total Orders: ${statsResponse.data.totalOrders}`, 'info');
    }
    
    // Test get all users
    const usersResponse = await api.get('/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log(`✅ Get all users: Found ${usersResponse.data.length} users`, 'success');
    
    // Test get all orders
    const ordersResponse = await api.get('/orders', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    log(`✅ Get all orders: Found ${ordersResponse.data.length} orders`, 'success');
    
  } catch (error) {
    log(`❌ Admin services error: ${error.response?.data?.message || error.message}`, 'error');
  }
};

// Main test runner
const runFrontendAPITests = async () => {
  log('🚀 Starting Frontend API Integration Tests...', 'info');
  log('================================================', 'info');
  
  try {
    await testAuthService();
    const productId = await testProductService();
    await testCartService(productId);
    const orderId = await testOrderService();
    await testAdminServices();
    
    log('================================================', 'info');
    log('🎉 Frontend API Integration Tests Completed!', 'success');
    
    // Summary
    log('\n📋 Integration Summary:', 'info');
    log(`Admin Token: ${adminToken ? '✅ Available' : '❌ Not available'}`, adminToken ? 'success' : 'error');
    log(`User Token: ${userToken ? '✅ Available' : '❌ Not available'}`, userToken ? 'success' : 'error');
    log(`Test Product ID: ${productId || 'N/A'}`, 'info');
    log(`Test Order ID: ${orderId || 'N/A'}`, 'info');
    
  } catch (error) {
    log(`❌ Test execution failed: ${error.message}`, 'error');
  }
};

// Run tests
runFrontendAPITests();
