import api from './api';

export const paymentService = {
  async getMyPayments() {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  async getPayment(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async createPayment(paymentData) {
    // API expects: orderId, amount, method, status
    const response = await api.post('/payments', {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      method: paymentData.method,
      status: paymentData.status || 'pending'
    });
    return response.data;
  }
};
