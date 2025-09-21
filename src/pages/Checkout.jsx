import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { orderService } from '../services/orderService';
import { toast } from 'react-toastify';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { items, total, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      district: user?.district || '',
      ward: user?.ward || '',
      note: ''
    }
  });

  const steps = [
    { id: 1, name: 'Thông tin giao hàng', icon: UserIcon },
    { id: 2, name: 'Phương thức thanh toán', icon: CreditCardIcon },
    { id: 3, name: 'Xác nhận đơn hàng', icon: CheckCircleIcon }
  ];

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
      icon: '💵',
      fee: 0
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản qua ATM/Internet Banking',
      icon: '🏦',
      fee: 0
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: '📱',
      fee: 0
    },
    {
      id: 'vnpay',
      name: 'VNPAY',
      description: 'Thanh toán qua cổng VNPAY',
      icon: '💳',
      fee: 0
    }
  ];

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      description: 'Giao hàng trong 3-5 ngày làm việc',
      price: 0,
      time: '3-5 ngày',
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Giao hàng nhanh',
      description: 'Giao hàng trong 1-2 ngày làm việc',
      price: 50000,
      time: '1-2 ngày',
      icon: '🚀'
    },
    {
      id: 'same-day',
      name: 'Giao trong ngày',
      description: 'Giao hàng trong ngày (chỉ áp dụng nội thành)',
      price: 100000,
      time: 'Trong ngày',
      icon: '⚡'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateShippingFee = () => {
    const shipping = shippingMethods.find(s => s.id === selectedShipping);
    return shipping?.price || 0;
  };

  const calculateTotal = () => {
    const shippingFee = calculateShippingFee();
    const tax = total * 0.1;
    return total + shippingFee + tax;
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['name', 'email', 'phone', 'address', 'city']);
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const orderData = {
        ...data,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: total,
        shippingFee: calculateShippingFee(),
        tax: total * 0.1,
        total: calculateTotal(),
        paymentMethod: selectedPayment,
        shippingMethod: selectedShipping
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // await orderService.createOrder(orderData);
      clearCart();
      toast.success('Đặt hàng thành công!');
      navigate('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Đặt hàng thất bại, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Vui lòng đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Bạn cần đăng nhập để tiếp tục thanh toán
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/register">Tạo tài khoản mới</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <TruckIcon className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">Giỏ hàng trống</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Không có sản phẩm nào để thanh toán
            </p>
            <Button asChild className="w-full">
              <Link to="/products">Khám phá sản phẩm</Link>
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
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Quay lại giỏ hàng
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircleSolidIcon className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon className="h-6 w-6 mr-2" />
                    Thông tin giao hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Họ và tên"
                      required
                      error={errors.name?.message}
                      leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
                      {...register('name', { required: 'Họ và tên là bắt buộc' })}
                    />
                    <Input
                      label="Số điện thoại"
                      required
                      type="tel"
                      error={errors.phone?.message}
                      leftIcon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                      {...register('phone', { 
                        required: 'Số điện thoại là bắt buộc',
                        pattern: {
                          value: /^[0-9]{10,11}$/,
                          message: 'Số điện thoại không hợp lệ'
                        }
                      })}
                    />
                  </div>
                  
                  <Input
                    label="Email"
                    required
                    type="email"
                    error={errors.email?.message}
                    leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                    {...register('email', { 
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email không hợp lệ'
                      }
                    })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Tỉnh/Thành phố"
                      required
                      error={errors.city?.message}
                      {...register('city', { required: 'Vui lòng chọn tỉnh/thành phố' })}
                    />
                    <Input
                      label="Quận/Huyện"
                      error={errors.district?.message}
                      {...register('district')}
                    />
                    <Input
                      label="Phường/Xã"
                      error={errors.ward?.message}
                      {...register('ward')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('address', { required: 'Địa chỉ là bắt buộc' })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Số nhà, tên đường..."
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      {...register('note')}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú về đơn hàng (tùy chọn)"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment & Shipping */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCardIcon className="h-6 w-6 mr-2" />
                      Phương thức thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedPayment === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPayment(method.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <input
                              type="radio"
                              checked={selectedPayment === method.id}
                              onChange={() => setSelectedPayment(method.id)}
                              className="mt-1 h-4 w-4 text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{method.icon}</span>
                                <h3 className="font-semibold text-gray-900">{method.name}</h3>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                              {method.fee > 0 && (
                                <Badge variant="secondary" className="mt-2">
                                  Phí: {formatPrice(method.fee)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TruckIcon className="h-6 w-6 mr-2" />
                      Phương thức vận chuyển
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedShipping === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedShipping(method.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                checked={selectedShipping === method.id}
                                onChange={() => setSelectedShipping(method.id)}
                                className="h-4 w-4 text-blue-600"
                              />
                              <div className="flex items-center space-x-2">
                                <span className="text-xl">{method.icon}</span>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {method.price === 0 ? 'Miễn phí' : formatPrice(method.price)}
                              </p>
                              <p className="text-sm text-blue-600">{method.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 mr-2" />
                    Xác nhận đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping Info Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Thông tin giao hàng</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Người nhận:</span> {getValues('name')}</p>
                      <p><span className="font-medium">Điện thoại:</span> {getValues('phone')}</p>
                      <p><span className="font-medium">Email:</span> {getValues('email')}</p>
                      <p><span className="font-medium">Địa chỉ:</span> {getValues('address')}, {getValues('ward')}, {getValues('district')}, {getValues('city')}</p>
                    </div>
                  </div>

                  {/* Payment & Shipping Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Thanh toán</h4>
                      <p className="text-sm">{paymentMethods.find(p => p.id === selectedPayment)?.name}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Vận chuyển</h4>
                      <p className="text-sm">{shippingMethods.find(s => s.id === selectedShipping)?.name}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="h-12 w-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  Tiếp tục
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={isSubmitting}
                  size="lg"
                  className="px-8"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items Summary */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex-1">{item.name} x{item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tạm tính</span>
                      <span className="font-medium">{formatPrice(total)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span className="font-medium">
                        {calculateShippingFee() === 0 ? 'Miễn phí' : formatPrice(calculateShippingFee())}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thuế VAT (10%)</span>
                      <span className="font-medium">{formatPrice(total * 0.1)}</span>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Tổng cộng</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <ShieldCheckIcon className="h-4 w-4" />
                    <span>Thanh toán an toàn & bảo mật</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <TruckIcon className="h-4 w-4" />
                    <span>Giao hàng toàn quốc</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;