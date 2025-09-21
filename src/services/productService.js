import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(productData) {
    // API expects: name, description, price, discount, stock, categoryId, images
    const response = await api.post('/products', {
      name: productData.name,
      description: productData.description,
      price: productData.price,
      discount: productData.discount || 0,
      stock: productData.stock,
      categoryId: productData.categoryId,
      images: productData.images || '[]'
    });
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.patch(`/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategory(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData) {
    // API expects: name, description, parentId
    const response = await api.post('/categories', {
      name: categoryData.name,
      description: categoryData.description,
      parentId: categoryData.parentId || null
    });
    return response.data;
  },

  async updateCategory(id, categoryData) {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  async getProductsByCategory(categoryId, params = {}) {
    // Use the products endpoint with categoryId filter
    const response = await api.get('/products', { 
      params: { ...params, categoryId } 
    });
    return response.data;
  },

  async searchProducts(query, params = {}) {
    const response = await api.get('/products', { 
      params: { ...params, search: query } 
    });
    return response.data;
  }
}; 