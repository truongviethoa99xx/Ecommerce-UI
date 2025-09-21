#!/usr/bin/env node

// Demo script để test API integration
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const log = (message, type = 'info') => {
  const colors = {
    success: '\x1b[32m',
    error: '\x1b[31m',
    info: '\x1b[36m',
    warning: '\x1b[33m',
    header: '\x1b[35m'
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
};

const demo = async () => {
  log('🎬 E-COMMERCE API INTEGRATION DEMO', 'header');
  log('====================================', 'header');
  
  try {
    // 1. Test Admin Login
    log('\n1️⃣ Admin Authentication Demo', 'info');
    const adminLogin = await api.post('/auth/admin/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    const adminToken = adminLogin.data.access_token;
    log('✅ Admin login successful', 'success');
    api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;

    // 2. Create Category
    log('\n2️⃣ Category Management Demo', 'info');
    const category = await api.post('/categories', {
      name: `Demo Category ${Date.now()}`,
      description: 'Category created by demo script'
    });
    log('✅ Category created successfully', 'success');
    const categoryId = category.data.id;

    // 3. Create Product
    log('\n3️⃣ Product Management Demo', 'info');
    const product = await api.post('/products', {
      name: `Demo Product ${Date.now()}`,
      description: 'High-quality demo product with amazing features',
      price: 299.99,
      discount: 10,
      stock: 50,
      categoryId: categoryId,
      images: '["demo-product.jpg", "demo-product-2.jpg"]'
    });
    log('✅ Product created successfully', 'success');
    const productId = product.data.id;

    // 4. Register User
    log('\n4️⃣ User Registration Demo', 'info');
    const userEmail = `demo${Date.now()}@example.com`;
    const userRegister = await api.post('/auth/register', {
      name: 'Demo User',
      email: userEmail,
      password: 'password123',
      phone: '+84987654321',
      address: '123 Demo Street, Demo City'
    });
    log('✅ User registered successfully', 'success');
    const userToken = userRegister.data.access_token;

    // Switch to user token for user operations
    api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

    // 5. Add to Cart
    log('\n5️⃣ Shopping Cart Demo', 'info');
    const cartAdd = await api.post('/cart', {
      productId: productId,
      quantity: 2
    });
    log('✅ Product added to cart', 'success');

    // 6. View Cart
    const cart = await api.get('/cart');
    log(`✅ Cart contains ${cart.data.length} items`, 'success');

    // 7. Create Order from Cart
    log('\n6️⃣ Order Creation Demo', 'info');
    const order = await api.post('/orders/from-cart', {
      shippingAddress: '456 Order Street, Order City',
      paymentMethod: 'credit_card',
      shippingMethod: 'standard'
    });
    log('✅ Order created from cart', 'success');
    const orderId = order.data.id;

    // 8. Add to Wishlist
    log('\n7️⃣ Wishlist Demo', 'info');
    const wishlist = await api.post('/wishlists', {
      productId: productId
    });
    log('✅ Product added to wishlist', 'success');

    // 9. Add Review
    log('\n8️⃣ Review System Demo', 'info');
    const review = await api.post('/reviews', {
      productId: productId,
      rating: 5,
      comment: 'Excellent product! Highly recommended for everyone.'
    });
    log('✅ Review added successfully', 'success');

    // 10. Create Contact
    log('\n9️⃣ Contact Form Demo', 'info');
    const contact = await api.post('/contacts', {
      name: 'Demo Customer',
      email: 'customer@example.com',
      phone: '+84987654322',
      subject: 'Product Inquiry',
      message: 'I would like to know more about your demo products.',
      type: 'inquiry'
    });
    log('✅ Contact form submitted', 'success');

    // Switch back to admin for admin operations
    api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;

    // 11. View Statistics
    log('\n🔟 Admin Dashboard Demo', 'info');
    const stats = await api.get('/statistics/overview');
    log('✅ Dashboard statistics loaded:', 'success');
    log(`   📊 Total Users: ${stats.data.totalUsers}`, 'info');
    log(`   📦 Total Products: ${stats.data.totalProducts}`, 'info');
    log(`   🛒 Total Orders: ${stats.data.totalOrders}`, 'info');
    log(`   💰 Total Revenue: $${stats.data.totalRevenue}`, 'info');

    // 12. Create Payment
    log('\n1️⃣1️⃣ Payment Processing Demo', 'info');
    const payment = await api.post('/payments', {
      orderId: orderId,
      amount: 599.98,
      method: 'credit_card',
      status: 'completed'
    });
    log('✅ Payment processed successfully', 'success');

    // 13. Create Shipment
    log('\n1️⃣2️⃣ Shipment Tracking Demo', 'info');
    const shipment = await api.post('/shipments', {
      orderId: orderId,
      carrier: 'Demo Express',
      trackingNumber: `DEMO${Date.now()}`,
      status: 'pending'
    });
    log('✅ Shipment created with tracking', 'success');

    // 14. Final Summary
    log('\n====================================', 'header');
    log('🎉 DEMO COMPLETED SUCCESSFULLY!', 'success');
    log('====================================', 'header');
    
    log('\n📋 Demo Summary:', 'info');
    log(`✅ Created Category: "${category.data.name}"`, 'success');
    log(`✅ Created Product: "${product.data.name}"`, 'success');
    log(`✅ Registered User: "${userEmail}"`, 'success');
    log(`✅ Created Order: #${orderId}`, 'success');
    log(`✅ Added Review: 5⭐ rating`, 'success');
    log(`✅ Processed Payment: $599.98`, 'success');
    log(`✅ Created Shipment: ${shipment.data.trackingNumber}`, 'success');
    
    log('\n🚀 All API integrations working perfectly!', 'success');
    log('🎯 Frontend is ready for development!', 'success');

  } catch (error) {
    log(`❌ Demo failed: ${error.response?.data?.message || error.message}`, 'error');
    if (error.response?.status) {
      log(`   Status Code: ${error.response.status}`, 'error');
    }
  }
};

// Run demo
demo();
