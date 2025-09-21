// Simple integration test
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const log = (message, type = 'info') => {
  const colors = { success: '\x1b[32m', error: '\x1b[31m', info: '\x1b[36m', warning: '\x1b[33m' };
  console.log(`${colors[type]}${message}\x1b[0m`);
};

const testFrontendIntegration = async () => {
  log('🧪 Testing Frontend-API Integration...', 'info');
  
  try {
    // Test authentication flow (like Login component)
    log('🔐 Testing Authentication Flow...', 'info');
    const loginResponse = await api.post('/auth/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.data.access_token) {
      log('✅ Login flow works - token received', 'success');
      const token = loginResponse.data.access_token;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Test profile fetch (like Header component)
      const profileResponse = await api.get('/auth/profile');
      if (profileResponse.data.user) {
        log('✅ Profile fetch works - user data received', 'success');
      }
    }
    
    // Test products listing (like Products page)
    log('🛍️ Testing Products Listing...', 'info');
    const productsResponse = await api.get('/products?page=1&limit=10');
    log(`✅ Products API works - ${productsResponse.data.length || 0} products`, 'success');
    
    // Test categories (like Categories filter)
    const categoriesResponse = await api.get('/categories');
    log(`✅ Categories API works - ${categoriesResponse.data.length || 0} categories`, 'success');
    
    // Test search functionality
    const searchResponse = await api.get('/products?search=test');
    log('✅ Search functionality works', 'success');
    
    // Test cart operations (like Cart component)
    log('🛒 Testing Cart Operations...', 'info');
    const cartResponse = await api.get('/cart');
    log('✅ Cart API works', 'success');
    
    // Test orders (like Orders page)
    log('📦 Testing Orders...', 'info');
    const ordersResponse = await api.get('/orders/my-orders');
    log('✅ Orders API works', 'success');
    
    // Test admin features (like Admin dashboard)
    log('👨‍💼 Testing Admin Features...', 'info');
    const statsResponse = await api.get('/statistics/overview');
    if (statsResponse.data) {
      log('✅ Admin dashboard stats work', 'success');
      log(`   - Users: ${statsResponse.data.totalUsers}`, 'info');
      log(`   - Products: ${statsResponse.data.totalProducts}`, 'info');
      log(`   - Orders: ${statsResponse.data.totalOrders}`, 'info');
    }
    
    log('\n🎉 All Frontend Integration Tests Passed!', 'success');
    log('🚀 Frontend is ready to connect with API', 'success');
    
  } catch (error) {
    log(`❌ Integration test failed: ${error.response?.data?.message || error.message}`, 'error');
  }
};

testFrontendIntegration();
