import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { 
  TrashIcon, 
  MinusIcon, 
  PlusIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  GiftIcon,
  HeartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [estimatedDelivery, setEstimatedDelivery] = useState('2-3 ngày');

  // Mock coupons for demo
  const availableCoupons = [
    { code: 'WELCOME10', discount: 10, type: 'percentage', minOrder: 500000, description: 'Giảm 10% cho đơn hàng đầu tiên' },
    { code: 'FREESHIP', discount: 50000, type: 'fixed', minOrder: 300000, description: 'Miễn phí vận chuyển' },
    { code: 'SAVE50K', discount: 50000, type: 'fixed', minOrder: 1000000, description: 'Giảm 50.000đ cho đơn từ 1 triệu' },
    { code: 'VIP20', discount: 20, type: 'percentage', minOrder: 2000000, description: 'Giảm 20% cho thành viên VIP' },
  ];

  const shippingOptions = [
    { id: 'standard', name: 'Giao hàng tiêu chuẩn', price: 30000, time: '2-3 ngày', description: 'Giao trong giờ hành chính' },
    { id: 'express', name: 'Giao hàng nhanh', price: 50000, time: '1-2 ngày', description: 'Giao hàng ưu tiên' },
    { id: 'same-day', name: 'Giao trong ngày', price: 80000, time: 'Trong ngày', description: 'Chỉ áp dụng nội thành' },
    { id: 'free', name: 'Miễn phí vận chuyển', price: 0, time: '3-5 ngày', description: 'Đơn hàng từ 500.000đ' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
    toast.success('Đã cập nhật số lượng');
  };

  const handleRemoveItem = (itemId, productName) => {
    removeItem(itemId);
    toast.success(`Đã xóa ${productName} khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      clearCart();
      setAppliedCoupon(null);
      toast.success('Đã xóa tất cả sản phẩm trong giỏ hàng');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setCouponLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const coupon = availableCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
      
      if (!coupon) {
        toast.error('Mã giảm giá không hợp lệ');
        setCouponLoading(false);
        return;
      }

      if (total < coupon.minOrder) {
        toast.error(`Đơn hàng tối thiểu ${formatPrice(coupon.minOrder)} để sử dụng mã này`);
        setCouponLoading(false);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode('');
      toast.success(`Đã áp dụng mã giảm giá ${coupon.code}`);
      setCouponLoading(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Đã xóa mã giảm giá');
  };

  const handleShippingChange = (shippingId) => {
    const shipping = shippingOptions.find(s => s.id === shippingId);
    setSelectedShipping(shippingId);
    setEstimatedDelivery(shipping.time);
    toast.success(`Đã chọn phương thức: ${shipping.name}`);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return total * (appliedCoupon.discount / 100);
    } else {
      return appliedCoupon.discount;
    }
  };

  const getShippingPrice = () => {
    const shipping = shippingOptions.find(s => s.id === selectedShipping);
    if (shipping?.id === 'free' && total >= 500000) return 0;
    return shipping?.price || 0;
  };

  const subtotal = total;
  const discount = calculateDiscount();
  const shippingPrice = getShippingPrice();
  const tax = (subtotal - discount) * 0.1;
  const finalTotal = subtotal - discount + shippingPrice + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto h-32 w-32 text-gray-300 mb-8">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <div className="space-y-4">
              <Button size="lg" onClick={() => navigate('/products')}>
                Khám phá sản phẩm
              </Button>
              <div className="flex justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Miễn phí vận chuyển
                </div>
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  Bảo hành chính hãng
                </div>
              </div>
            </div>
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
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="text-gray-600 mt-1">{items.length} sản phẩm</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleClearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Xóa tất cả
            </Button>
          </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cart Items List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sản phẩm đã chọn</span>
                  <Badge variant="secondary">{items.length} sản phẩm</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                          {item.sale && (
                            <Badge 
                              variant="destructive" 
                              className="absolute -top-2 -right-2 text-xs"
                            >
                              -{item.salePercent}%
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 mr-4">
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                <Link to={`/products/${item.id}`}>
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.description}
                              </p>
                              {item.category && (
                                <Badge variant="secondary" className="mt-2">
                                  {item.category.name}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="flex flex-col items-end space-y-1">
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(item.price)}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">Số lượng:</span>
                              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 text-sm font-semibold min-w-[50px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="h-8 w-8"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <span className="text-xl font-bold text-blue-600">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <HeartIcon className="h-5 w-5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveItem(item.id, item.name)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TagIcon className="h-5 w-5 mr-2" />
                  Mã giảm giá
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <TagIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-green-800">
                        -{appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}%` 
                          : formatPrice(appliedCoupon.discount)
                        }
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-800"
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleApplyCoupon}
                        loading={couponLoading}
                        disabled={!couponCode.trim()}
                      >
                        Áp dụng
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableCoupons.slice(0, 4).map((coupon) => (
                        <div
                          key={coupon.code}
                          className="p-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                          onClick={() => setCouponCode(coupon.code)}
                        >
                          <div className="flex items-center space-x-2">
                            <GiftIcon className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-sm">{coupon.code}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TruckIcon className="h-5 w-5 mr-2" />
                  Phương thức vận chuyển
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {shippingOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedShipping === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${option.id === 'free' && total < 500000 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (option.id === 'free' && total < 500000) return;
                        handleShippingChange(option.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            checked={selectedShipping === option.id}
                            onChange={() => handleShippingChange(option.id)}
                            disabled={option.id === 'free' && total < 500000}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                            <p className="text-sm text-blue-600">{option.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {option.price === 0 ? 'Miễn phí' : formatPrice(option.price)}
                          </p>
                          {option.id === 'free' && total < 500000 && (
                            <p className="text-xs text-gray-500">
                              Cần thêm {formatPrice(500000 - total)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính ({items.length} sản phẩm)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá ({appliedCoupon.code})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">
                      {shippingPrice === 0 ? 'Miễn phí' : formatPrice(shippingPrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Thuế VAT (10%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Tổng cộng</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-green-600 text-right mt-1">
                        Bạn đã tiết kiệm {formatPrice(discount)}!
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full"
                  >
                    Tiến hành thanh toán
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/products')}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </div>
                
                <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <TruckIcon className="h-4 w-4" />
                    <span>Dự kiến giao hàng: {estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Thanh toán an toàn 100%</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <GiftIcon className="h-4 w-4" />
                    <span>Đổi trả miễn phí trong 30 ngày</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;