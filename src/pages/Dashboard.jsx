import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { 
  ShoppingBagIcon,
  HeartIcon,
  UserIcon,
  CreditCardIcon,
  TruckIcon,
  StarIcon,
  ChartBarIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    reviewsCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demo
      setStats({
        totalOrders: 12,
        totalSpent: 45600000,
        wishlistCount: 8,
        reviewsCount: 5
      });

      setRecentOrders([
        {
          id: 1,
          orderNumber: 'DH001',
          status: 'delivered',
          total: 30000000,
          createdAt: '2024-01-15',
          items: [{ name: 'iPhone 15 Pro Max', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100' }]
        },
        {
          id: 2,
          orderNumber: 'DH002',
          status: 'shipped',
          total: 15600000,
          createdAt: '2024-01-10',
          items: [{ name: 'AirPods Pro 2', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100' }]
        }
      ]);

      setNotifications([
        {
          id: 1,
          type: 'order',
          message: 'Đơn hàng #DH002 đang được giao đến bạn',
          time: '2 giờ trước',
          read: false
        },
        {
          id: 2,
          type: 'promotion',
          message: 'Giảm giá 20% cho tất cả sản phẩm Apple',
          time: '1 ngày trước',
          read: false
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'default',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'destructive'
    };
    return colors[status] || 'secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Vui lòng đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Bạn cần đăng nhập để truy cập dashboard
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Chào mừng trở lại, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tài khoản và theo dõi đơn hàng của bạn
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(stats.totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCardIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sản phẩm yêu thích</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.wishlistCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đánh giá đã viết</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.reviewsCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <StarIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Đơn hàng gần đây</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/orders">Xem tất cả</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Chưa có đơn hàng nào</p>
                    <Button asChild className="mt-4">
                      <Link to="/products">Mua sắm ngay</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={order.items[0]?.image}
                          alt={order.items[0]?.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                          <p className="text-sm text-gray-600 truncate">{order.items[0]?.name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Thao tác nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/profile">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Chỉnh sửa hồ sơ
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/orders">
                    <TruckIcon className="h-4 w-4 mr-2" />
                    Theo dõi đơn hàng
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/wishlist">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    Danh sách yêu thích
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/reviews">
                    <StarIcon className="h-4 w-4 mr-2" />
                    Đánh giá của tôi
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Shopping Cart Status */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Giỏ hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Bạn có {items.length} sản phẩm trong giỏ hàng
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/cart">Xem giỏ hàng</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Thông báo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">
                    Không có thông báo mới
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border ${
                          notification.read 
                            ? 'bg-gray-50 border-gray-200' 
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <p className="text-sm text-gray-900 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
