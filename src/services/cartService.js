import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addToCart(productId, quantity) {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  async updateCartItem(id, quantity) {
    const response = await api.patch(`/cart/${id}`, { quantity });
    return response.data;
  },

  async removeFromCart(id) {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  }
};
