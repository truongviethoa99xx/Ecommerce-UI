import api from './api';

export const wishlistService = {
  async getWishlist() {
    const response = await api.get('/wishlists');
    return response.data;
  },

  async addToWishlist(productId) {
    const response = await api.post('/wishlists', { productId });
    return response.data;
  },

  async removeFromWishlist(id) {
    const response = await api.delete(`/wishlists/${id}`);
    return response.data;
  },

  async clearWishlist() {
    const response = await api.delete('/wishlists');
    return response.data;
  },

  async checkInWishlist(productId) {
    const response = await api.get(`/wishlists/check/${productId}`);
    return response.data;
  }
};
