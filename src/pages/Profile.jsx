import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/auth';
import { toast } from 'react-toastify';
import { 
  UserIcon,
  PencilIcon,
  CameraIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      district: user?.district || '',
      ward: user?.ward || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || ''
    }
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleEditToggle = () => {
    if (isEditing) {
      reset(); // Reset form when canceling edit
    }
    setIsEditing(!isEditing);
  };

  const onSubmitProfile = async (data) => {
    try {
      setIsUpdating(true);
      // await updateProfile(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsUpdating(true);
      // await updatePassword(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Đổi mật khẩu thành công!');
      passwordForm.reset();
    } catch (error) {
      toast.error('Không thể đổi mật khẩu');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle avatar upload
      toast.success('Đang tải lên ảnh đại diện...');
    }
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
              Bạn cần đăng nhập để xem thông tin cá nhân
            </p>
            <Button asChild className="w-full">
              <a href="/login">Đăng nhập</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản và cài đặt bảo mật</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-gray-600">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <label className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user?.name || 'Người dùng'}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
                
                <div className="flex justify-center mb-4">
                  <Badge variant={user?.role === 'admin' ? 'destructive' : 'default'}>
                    {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                  </Badge>
                </div>

                {/* Navigation */}
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <UserIcon className="h-4 w-4 inline mr-2" />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ShieldCheckIcon className="h-4 w-4 inline mr-2" />
                    Bảo mật
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                    disabled={isUpdating}
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Thông tin cơ bản
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Họ và tên"
                          required
                          disabled={!isEditing}
                          error={errors.name?.message}
                          leftIcon={<UserIcon className="h-5 w-5 text-gray-400" />}
                          {...register('name', { required: 'Họ và tên là bắt buộc' })}
                        />
                        <Input
                          label="Email"
                          type="email"
                          required
                          disabled={!isEditing}
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
                        <Input
                          label="Số điện thoại"
                          type="tel"
                          disabled={!isEditing}
                          error={errors.phone?.message}
                          leftIcon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
                          {...register('phone', {
                            pattern: {
                              value: /^[0-9]{10,11}$/,
                              message: 'Số điện thoại không hợp lệ'
                            }
                          })}
                        />
                        <Input
                          label="Ngày sinh"
                          type="date"
                          disabled={!isEditing}
                          error={errors.dateOfBirth?.message}
                          {...register('dateOfBirth')}
                        />
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới tính
                          </label>
                          <select
                            disabled={!isEditing}
                            {...register('gender')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Địa chỉ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Input
                          label="Tỉnh/Thành phố"
                          disabled={!isEditing}
                          error={errors.city?.message}
                          leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                          {...register('city')}
                        />
                        <Input
                          label="Quận/Huyện"
                          disabled={!isEditing}
                          error={errors.district?.message}
                          {...register('district')}
                        />
                        <Input
                          label="Phường/Xã"
                          disabled={!isEditing}
                          error={errors.ward?.message}
                          {...register('ward')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ chi tiết
                        </label>
                        <textarea
                          disabled={!isEditing}
                          rows={3}
                          {...register('address')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="Số nhà, tên đường..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    {isEditing && (
                      <div className="flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEditToggle}
                          disabled={isUpdating}
                        >
                          Hủy
                        </Button>
                        <Button
                          type="submit"
                          loading={isUpdating}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                      <Input
                        label="Mật khẩu hiện tại"
                        type="password"
                        required
                        error={passwordForm.formState.errors.currentPassword?.message}
                        {...passwordForm.register('currentPassword', { 
                          required: 'Vui lòng nhập mật khẩu hiện tại' 
                        })}
                      />
                      <Input
                        label="Mật khẩu mới"
                        type="password"
                        required
                        error={passwordForm.formState.errors.newPassword?.message}
                        {...passwordForm.register('newPassword', { 
                          required: 'Vui lòng nhập mật khẩu mới',
                          minLength: {
                            value: 6,
                            message: 'Mật khẩu phải có ít nhất 6 ký tự'
                          }
                        })}
                      />
                      <Input
                        label="Xác nhận mật khẩu mới"
                        type="password"
                        required
                        error={passwordForm.formState.errors.confirmPassword?.message}
                        {...passwordForm.register('confirmPassword', { 
                          required: 'Vui lòng xác nhận mật khẩu mới' 
                        })}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          loading={isUpdating}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Security */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật tài khoản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Xác thực hai yếu tố</h4>
                        <p className="text-sm text-gray-600">Tăng cường bảo mật cho tài khoản</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Kích hoạt
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Phiên đăng nhập</h4>
                        <p className="text-sm text-gray-600">Quản lý các thiết bị đã đăng nhập</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Lịch sử hoạt động</h4>
                        <p className="text-sm text-gray-600">Xem lịch sử truy cập tài khoản</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Xem lịch sử
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;