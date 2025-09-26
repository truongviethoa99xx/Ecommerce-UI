import api from './api';

export const statisticsService = {
  async getUsersGrowth() {
    const response = await api.get('/statistics/widgets/users-growth');
    return response.data;
  },

  async getPendingOrders() {
    const response = await api.get('/statistics/widgets/pending-orders');
    return response.data;
  },

  async getRevenueThisMonth() {
    const response = await api.get('/statistics/widgets/revenue-this-month');
    return response.data;
  },

  async getAverageProductRating() {
    const response = await api.get('/statistics/widgets/average-product-rating');
    return response.data;
  },

  async getRecentActivities() {
    const response = await api.get('/statistics/activities/recent');
    return response.data;
  },
};

export default statisticsService;

