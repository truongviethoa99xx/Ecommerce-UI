import api from './api';

export const reviewService = {
  async getReviews(params = {}) {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  async getMyReviews() {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  async getReview(id) {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  async createReview(reviewData) {
    // API expects: productId, rating, comment
    const response = await api.post('/reviews', {
      productId: reviewData.productId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    return response.data;
  },

  async updateReview(id, reviewData) {
    const response = await api.patch(`/reviews/${id}`, reviewData);
    return response.data;
  },

  async deleteReview(id) {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  }
};
