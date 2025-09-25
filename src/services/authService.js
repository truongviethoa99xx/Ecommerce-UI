import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async adminLogin(email, password) {
    const response = await api.post('/auth/admin/login', { email, password });
    return response.data;
  },

  async register(userData) {
    // API expects: name, email, password, phone, address
    const response = await api.post('/auth/register', {
      name: userData.name || `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      address: userData.address || ''
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Logout is handled locally (remove token)
  logout() {
    localStorage.removeItem('auth-storage');
    // Don't reload page, let the app handle navigation
  }
}; 