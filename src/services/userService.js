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

  // Staff Management APIs
  
  // GET /auth/admin - Lấy danh sách admin (Admin only)
  async getStaff() {
    try {
      const response = await api.get('/auth/admin');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /auth/admin/:id/status - Cập nhật trạng thái admin
  async updateStaffStatus(id, status) {
    try {
      const response = await api.post(`/auth/admin/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /auth/admin/:id/reset-password - Đặt lại mật khẩu về abc123
  async resetStaffPassword(id) {
    try {
      const response = await api.post(`/auth/admin/${id}/reset-password`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // POST /auth/admin/register - Tạo admin mới
  async createStaff(data) {
    try {
      const response = await api.post('/auth/admin/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH /auth/admin/:id - Cập nhật thông tin admin
  async updateStaff(id, data) {
    try {
      const response = await api.post(`/auth/admin/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET /auth/admin/:id - Lấy thông tin admin theo ID
  async getStaffById(id) {
    try {
      const response = await api.get(`/auth/admin/${id}`);
      console.log("🚀 ~ UserService ~ getStaffById ~ response:", response)
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE /auth/admin/:id - Xóa admin
  async deleteStaff(id) {
    try {
      const response = await api.delete(`/auth/admin/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const userService = new UserService();