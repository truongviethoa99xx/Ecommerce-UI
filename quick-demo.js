import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

const log = (msg, type = 'info') => {
  const colors = { success: '\x1b[32m', error: '\x1b[31m', info: '\x1b[36m' };
  console.log(`${colors[type]}${msg}\x1b[0m`);
};

const quickDemo = async () => {
  log('🚀 Quick API Integration Demo');
  
  try {
    // Admin login
    const admin = await api.post('/auth/admin/login', {
      username: 'admin', password: 'admin123'
    });
    api.defaults.headers.common['Authorization'] = `Bearer ${admin.data.access_token}`;
    log('✅ Admin authenticated');

    // Get statistics
    const stats = await api.get('/statistics/overview');
    log(`✅ Stats: ${stats.data.totalUsers} users, ${stats.data.totalProducts} products`);

    // Get products
    const products = await api.get('/products');
    log(`✅ Found ${products.data.length} products`);

    // Get categories  
    const categories = await api.get('/categories');
    log(`✅ Found ${categories.data.length} categories`);

    // User registration
    const user = await api.post('/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '+84987654321',
      address: '123 Test St'
    });
    log('✅ User registered successfully');

    log('\n🎉 All core API integrations working!');
    log('🎯 Frontend ready for development!');

  } catch (error) {
    log(`❌ Error: ${error.response?.data?.message || error.message}`, 'error');
  }
};

quickDemo();
