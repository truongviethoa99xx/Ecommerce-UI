import api from './api';

export const userService = {
  async getAllUsers() {
    // Admin only
    const response = await api.get('/users');
    return response.data;
  },

  async getUser(id) {
    // Admin only
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(userData) {
    // Admin only - API expects: name, email, password, phone, address
    const response = await api.post('/users', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || ''
    });
    return response.data;
  },

  async updateUser(id, userData) {
    // Admin only
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  async deleteUser(id) {
    // Admin only
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
