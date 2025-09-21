import api from './api';

export const orderService = {
  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  async getAllOrders() {
    // Admin only
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData) {
    // API expects: status, paymentMethod, shippingMethod, shippingAddress, items
    const response = await api.post('/orders', {
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod,
      shippingMethod: orderData.shippingMethod || 'standard',
      shippingAddress: orderData.shippingAddress,
      items: orderData.items
    });
    return response.data;
  },

  async createOrderFromCart(shippingAddress, paymentMethod, shippingMethod = 'standard') {
    const response = await api.post('/orders/from-cart', {
      shippingAddress,
      paymentMethod,
      shippingMethod
    });
    return response.data;
  },

  async updateOrderStatus(id, status) {
    // Admin only
    const response = await api.patch(`/orders/${id}`, { status });
    return response.data;
  },

  async cancelOrder(id) {
    // Admin only
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
}; 