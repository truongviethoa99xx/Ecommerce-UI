import api from './api';

class CategoryService {
  // GET /categories - Lấy danh sách tất cả danh mục (Public)
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET /categories/:id - Lấy thông tin danh mục theo ID (Public)
  async getCategory(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /categories - Tạo danh mục mới (Admin only)
  async createCategory(data) {
    try {
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /categories/:id - Cập nhật danh mục (Admin only)
  async updateCategory(id, data) {
    try {
      const response = await api.patch(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE /categories/:id - Xóa danh mục (Admin only)
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;
