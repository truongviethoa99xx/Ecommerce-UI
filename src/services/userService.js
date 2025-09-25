import api from './api';

class UserService {
  // GET /users - Lấy danh sách tất cả người dùng (Admin only)
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET /users/:id - Lấy thông tin người dùng theo ID (Admin only)
  async getUser(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /users - Tạo người dùng mới (Admin only)
  async createUser(data) {
    try {
      const response = await api.post('/users', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /users/:id - Cập nhật thông tin người dùng (Admin only)
  async updateUser(id, data) {
    try {
      const response = await api.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE /users/:id - Xóa người dùng (Admin only)
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /users/:id/status - Bật/tắt trạng thái người dùng (Admin only)
  async toggleUserStatus(id, status) {
    try {
      const response = await api.patch(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /users/:id/role - Thay đổi vai trò người dùng (Admin only)
  async updateUserRole(id, role) {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();