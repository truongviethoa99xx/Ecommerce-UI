import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { 
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TruckIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Admin = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Mock admin data
      setStats({
        totalUsers: 1247,
        totalOrders: 892,
        totalRevenue: 2456000000,
        totalProducts: 156,
        pendingOrders: 23,
        shippedOrders: 67,
        deliveredOrders: 145,
        averageRating: 4.6,
        growthRate: 12.5
      });

      setUsers([
        {
          id: 1,
          name: 'Nguyễn Văn An',
          email: 'nguyenvanan@email.com',
          role: 'customer',
          status: 'active',
          joinDate: '2024-01-15',
          totalOrders: 5,
          totalSpent: 15600000
        },
        {
          id: 2,
          name: 'Trần Thị Mai',
          email: 'tranthimai@email.com',
          role: 'customer',
          status: 'active',
          joinDate: '2024-01-10',
          totalOrders: 3,
          totalSpent: 8900000
        },
        {
          id: 3,
          name: 'Lê Minh Đức',
          email: 'leminhduc@email.com',
          role: 'customer',
          status: 'inactive',
          joinDate: '2024-01-05',
          totalOrders: 1,
          totalSpent: 2400000
        }
      ]);

      setOrders([
        {
          id: 1,
          orderNumber: 'DH001',
          customer: 'Nguyễn Văn An',
          status: 'pending',
          total: 30000000,
          createdAt: '2024-01-15T10:30:00Z',
          items: 2
        },
        {
          id: 2,
          orderNumber: 'DH002',
          customer: 'Trần Thị Mai',
          status: 'shipped',
          total: 15600000,
          createdAt: '2024-01-12T14:20:00Z',
          items: 1
        },
        {
          id: 3,
          orderNumber: 'DH003',
          customer: 'Lê Minh Đức',
          status: 'delivered',
          total: 45000000,
          createdAt: '2024-01-10T09:15:00Z',
          items: 3
        }
      ]);

      setProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          category: 'Điện thoại',
          price: 30000000,
          stock: 15,
          status: 'active',
          sales: 89,
          rating: 4.8
        },
        {
          id: 2,
          name: 'MacBook Pro M3',
          category: 'Laptop',
          price: 45000000,
          stock: 8,
          status: 'active',
          sales: 34,
          rating: 4.9
        },
        {
          id: 3,
          name: 'AirPods Pro 2',
          category: 'Phụ kiện',
          price: 6000000,
          stock: 0,
          status: 'out_of_stock',
          sales: 156,
          rating: 4.7
        }
      ]);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      inactive: 'secondary',
      pending: 'warning',
      processing: 'default',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'destructive',
      out_of_stock: 'destructive'
    };
    return colors[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
      out_of_stock: 'Hết hàng'
    };
    return texts[status] || status;
  };

  // Tạm thời bỏ điều kiện kiểm tra quyền để test
  // if (!isAuthenticated || user?.role !== 'admin') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-12">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
  //         <h1 className="text-2xl font-bold text-gray-900 mb-4">
  //           Không có quyền truy cập
  //         </h1>
  //         <p className="text-gray-600 mb-8">
  //           Bạn không có quyền truy cập vào trang quản trị
  //         </p>
  //         <a href="/" className="btn-primary inline-block">
  //           Về trang chủ
  //         </a>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trang quản trị</h1>
          <p className="text-gray-600 mt-2">Quản lý hệ thống e-commerce</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Tổng quan', icon: ChartBarIcon },
                { id: 'users', label: 'Người dùng', icon: UserGroupIcon },
                { id: 'orders', label: 'Đơn hàng', icon: ShoppingBagIcon },
                { id: 'products', label: 'Sản phẩm', icon: CurrencyDollarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalUsers?.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{stats.growthRate}% so với tháng trước</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UserGroupIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalOrders?.toLocaleString()}</p>
                      <p className="text-sm text-blue-600">{stats.pendingOrders} đang chờ xử lý</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats.totalRevenue)}
                      </p>
                      <p className="text-sm text-green-600">Tháng này</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                      <p className="text-sm text-yellow-600">Đánh giá TB: {stats.averageRating}/5</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <StarIcon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Chờ xử lý</span>
                      </div>
                      <span className="font-semibold">{stats.pendingOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Đang giao</span>
                      </div>
                      <span className="font-semibold">{stats.shippedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Đã giao</span>
                      </div>
                      <span className="font-semibold">{stats.deliveredOrders}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">Đơn hàng #DH123 đã được giao thành công</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Người dùng mới đăng ký: nguyenvanan@email.com</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Sản phẩm iPhone 15 Pro sắp hết hàng</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm">Đánh giá mới 5 sao cho MacBook Pro M3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
              <div className="flex space-x-3">
                <Input placeholder="Tìm kiếm người dùng..." className="w-64" />
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Người dùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Đơn hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tổng chi tiêu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày tham gia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                              {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusColor(user.status)}>
                              {getStatusText(user.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {user.totalOrders}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPrice(user.totalSpent)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(user.joinDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
              <div className="flex space-x-3">
                <Input placeholder="Tìm kiếm đơn hàng..." className="w-64" />
                <Button variant="outline">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Mã đơn hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tổng tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày đặt
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            #{order.orderNumber}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPrice(order.total)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {order.items} sản phẩm
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <TruckIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
              <div className="flex space-x-3">
                <Input placeholder="Tìm kiếm sản phẩm..." className="w-64" />
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tồn kho
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Đã bán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Đánh giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{product.name}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span className={product.stock === 0 ? 'text-red-600 font-medium' : ''}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.sales}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{product.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusColor(product.status)}>
                              {getStatusText(product.status)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;