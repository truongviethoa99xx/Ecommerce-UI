import api from './api';

export const adminService = {
  // Statistics
  async getOverviewStats() {
    const response = await api.get('/statistics/overview');
    return response.data;
  },

  async getSalesStats() {
    const response = await api.get('/statistics/sales');
    return response.data;
  },

  async getProductStats() {
    const response = await api.get('/statistics/products');
    return response.data;
  },

  async getUserStats() {
    const response = await api.get('/statistics/users');
    return response.data;
  },

  // Payments
  async getAllPayments(params = {}) {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  async getPayment(id) {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  async updatePaymentStatus(id, status) {
    const response = await api.patch(`/payments/${id}`, { status });
    return response.data;
  },

  async deletePayment(id) {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Shipments
  async getAllShipments(params = {}) {
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  async getShipment(id) {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  async createShipment(shipmentData) {
    // API expects: orderId, carrier, trackingNumber, status
    const response = await api.post('/shipments', {
      orderId: shipmentData.orderId,
      carrier: shipmentData.carrier,
      trackingNumber: shipmentData.trackingNumber,
      status: shipmentData.status || 'pending'
    });
    return response.data;
  },

  async updateShipment(id, shipmentData) {
    const response = await api.patch(`/shipments/${id}`, shipmentData);
    return response.data;
  },

  async deleteShipment(id) {
    const response = await api.delete(`/shipments/${id}`);
    return response.data;
  },

  async trackShipment(trackingNumber) {
    const response = await api.get(`/shipments/track/${trackingNumber}`);
    return response.data;
  },

  // Contacts
  async getAllContacts() {
    const response = await api.get('/contacts');
    return response.data;
  },

  async getContact(id) {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  async updateContactStatus(id, status) {
    const response = await api.patch(`/contacts/${id}`, { status });
    return response.data;
  },

  async deleteContact(id) {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  }
};
