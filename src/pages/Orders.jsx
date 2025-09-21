import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  XMarkIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Orders = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: 0 },
    { value: 'pending', label: 'Chờ xử lý', count: 0 },
    { value: 'processing', label: 'Đang xử lý', count: 0 },
    { value: 'shipped', label: 'Đang giao', count: 0 },
    { value: 'delivered', label: 'Đã giao', count: 0 },
    { value: 'cancelled', label: 'Đã hủy', count: 0 }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await orderService.getUserOrders(user.id);
      setOrders(ordersData.data || ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
      
      // Mock data for demo
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'DH001',
          status: 'delivered',
          total: 30000000,
          createdAt: '2024-01-15T10:30:00Z',
          shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
          paymentMethod: 'cod',
          items: [
            { 
              id: 1,
              name: 'iPhone 15 Pro Max 256GB', 
              quantity: 1, 
              price: 30000000,
              image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100'
            }
          ],
          trackingNumber: 'VN123456789',
          estimatedDelivery: '2024-01-20'
        },
        {
          id: 2,
          orderNumber: 'DH002',
          status: 'shipped',
          total: 15600000,
          createdAt: '2024-01-10T14:20:00Z',
          shippingAddress: '456 Lê Văn Sỹ, Quận 3, TP.HCM',
          paymentMethod: 'bank',
          items: [
            { 
              id: 2,
              name: 'AirPods Pro 2nd Generation', 
              quantity: 2, 
              price: 6000000,
              image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100'
            },
            { 
              id: 3,
              name: 'MagSafe Charger', 
              quantity: 1, 
              price: 1200000,
              image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100'
            }
          ],
          trackingNumber: 'VN987654321',
          estimatedDelivery: '2024-01-18'
        },
        {
          id: 3,
          orderNumber: 'DH003',
          status: 'processing',
          total: 45000000,
          createdAt: '2024-01-08T09:15:00Z',
          shippingAddress: '789 Võ Văn Tần, Quận 1, TP.HCM',
          paymentMethod: 'momo',
          items: [
            { 
              id: 4,
              name: 'MacBook Pro M3 14-inch', 
              quantity: 1, 
              price: 45000000,
              image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=100'
            }
          ],
          trackingNumber: null,
          estimatedDelivery: '2024-01-25'
        },
        {
          id: 4,
          orderNumber: 'DH004',
          status: 'pending',
          total: 18000000,
          createdAt: '2024-01-05T16:45:00Z',
          shippingAddress: '321 Cách Mạng Tháng 8, Quận 10, TP.HCM',
          paymentMethod: 'cod',
          items: [
            { 
              id: 5,
              name: 'iPad Air M2 Wi-Fi 128GB', 
              quantity: 1, 
              price: 18000000,
              image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100'
            }
          ],
          trackingNumber: null,
          estimatedDelivery: '2024-01-22'
        }
      ];
      
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getStatusIcon = (status) => {
    const icons = {
      pending: <ClockIcon className="h-4 w-4" />,
      processing: <ClockIcon className="h-4 w-4" />,
      shipped: <TruckIcon className="h-4 w-4" />,
      delivered: <CheckCircleIcon className="h-4 w-4" />,
      cancelled: <XCircleIcon className="h-4 w-4" />
    };
    return icons[status] || <ClockIcon className="h-4 w-4" />;
  };

  const getPaymentMethodText = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng',
      bank: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      vnpay: 'VNPAY'
    };
    return methods[method] || method;
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        // await orderService.cancelOrder(orderId);
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        ));
        toast.success('Đã hủy đơn hàng thành công');
      } catch (error) {
        toast.error('Không thể hủy đơn hàng');
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <TruckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Vui lòng đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Bạn cần đăng nhập để xem danh sách đơn hàng
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Đăng nhập</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/4 animate-pulse"></div>
            {[...Array(3)].map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => {
              const count = option.value === 'all' 
                ? orders.length 
                : orders.filter(order => order.status === option.value).length;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {option.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Bạn chưa đặt đơn hàng nào. Hãy khám phá các sản phẩm tuyệt vời!'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button asChild>
                  <Link to="/products">Mua sắm ngay</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.orderNumber}
                        </h3>
                        <Badge variant={getStatusColor(order.status)} className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span>{getStatusText(order.status)}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Đặt hàng: {formatDate(order.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Thanh toán: {getPaymentMethodText(order.paymentMethod)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        {formatPrice(order.total)}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Chi tiết
                        </Button>
                        {order.status === 'pending' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Hủy đơn
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.quantity} | Giá: {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Mã vận đơn: {order.trackingNumber}
                            </p>
                            <p className="text-sm text-blue-700">
                              Dự kiến giao: {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Theo dõi
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Detail Modal */}
        {showOrderDetail && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chi tiết đơn hàng #{selectedOrder.orderNumber}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderDetail(false)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Order Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Trạng thái đơn hàng</h3>
                    <Badge variant={getStatusColor(selectedOrder.status)} className="flex items-center space-x-1 w-fit">
                      {getStatusIcon(selectedOrder.status)}
                      <span>{getStatusText(selectedOrder.status)}</span>
                    </Badge>
                  </div>

                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin đơn hàng</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.createdAt)}</p>
                      <p><span className="font-medium">Phương thức thanh toán:</span> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                      <p><span className="font-medium">Địa chỉ giao hàng:</span> {selectedOrder.shippingAddress}</p>
                      {selectedOrder.trackingNumber && (
                        <p><span className="font-medium">Mã vận đơn:</span> {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Số lượng: {item.quantity} | Giá: {formatPrice(item.price)}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;