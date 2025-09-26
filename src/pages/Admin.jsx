import {
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  FunnelIcon,
  PencilIcon,
  PlusIcon,
  ShoppingBagIcon,
  StarIcon,
  TrashIcon,
  TruckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Tooltip } from "../components/ui/Tooltip";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { userService } from "../services/userService";
import { useAuthStore } from "../store/auth";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem("admin-active-tab");
    return savedTab || "overview";
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // Product management states
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // User management states
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // Staff management states
  const [staff, setStaff] = useState([]);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showStaffDetail, setShowStaffDetail] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, user, navigate]);

  // Effect to refetch products when category filter changes
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchProducts();
    }
  }, [selectedCategoryFilter]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchUsers(), fetchStaff(), fetchProducts()]);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData.data || categoriesData || []);
    } catch (error) {
      console.log("🚀 ~ fetchCategories ~ error:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData.data || usersData || []);
    } catch (error) {
      console.log("🚀 ~ fetchUsers ~ error:", error);
    }
  };

  const fetchStaff = async () => {
    try {
      const staffData = await userService.getStaff();
      setStaff(staffData.data || staffData || []);
    } catch (error) {
      console.log("🚀 ~ fetchStaff ~ error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = {};
      if (selectedCategoryFilter !== "all") {
        params.categoryId = selectedCategoryFilter;
      }
      if (productSearchTerm) {
        params.search = productSearchTerm;
      }
      
      const productsData = await productService.getProducts(params);
      setProducts(productsData.data || productsData || []);
    } catch (error) {
      console.log("🚀 ~ fetchProducts ~ error:", error);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await categoryService.deleteCategory(id);
        await fetchCategories();
      } catch (error) {
        // Handle error silently
      }
    }
  };

  const handleSubmitCategory = async (data) => {
    try {
      setIsSubmittingCategory(true);

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, data);
      } else {
        await categoryService.createCategory(data);
      }

      await fetchCategories();
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      // Handle error silently
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  // Handle tab change and save to localStorage
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem("admin-active-tab", tabId);
  };

  // User CRUD Functions
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleViewUser = async (user) => {
    try {
      const userDetail = await userService.getUser(user.id);
      setSelectedUser(userDetail);
      setShowUserDetail(true);
    } catch (error) {
      // Fallback to basic user info
      setSelectedUser(user);
      setShowUserDetail(true);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await userService.deleteUser(id);
        await fetchUsers();
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        toast.error("Không thể xóa người dùng");
      }
    }
  };

  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await userService.toggleUserStatus(user.id, newStatus);
      await fetchUsers();
      toast.success(
        `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} người dùng!`
      );
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái người dùng");
    }
  };

  const handleUpdateUserRole = async (user, newRole) => {
    try {
      await userService.updateUserRole(user.id, newRole);
      await fetchUsers();
      toast.success("Cập nhật vai trò thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật vai trò");
    }
  };

  const handleSubmitUser = async (data) => {
    try {
      setIsSubmittingUser(true);

      if (editingUser) {
        await userService.updateUser(editingUser.id, data);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await userService.createUser(data);
        toast.success("Tạo người dùng mới thành công!");
      }

      await fetchUsers();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu người dùng";
      if (Array.isArray(errorMessage)) {
        toast.error(`Lỗi: ${errorMessage.join(", ")}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmittingUser(false);
    }
  };

  // Staff CRUD Functions
  const handleAddStaff = () => {
    setEditingStaff(null);
    setShowStaffModal(true);
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setShowStaffModal(true);
  };

  const handleViewStaff = async (staff) => {
    try {
      if (staff.id) {
        const staffDetail = await userService.getStaffById(staff.id);
        setSelectedStaff(staffDetail);
      } else {
        setSelectedStaff(staff);
      }
      setShowStaffDetail(true);
    } catch (error) {
      // Fallback to basic staff info
      console.error("Error fetching staff detail:", error);
      setSelectedStaff(staff);
      setShowStaffDetail(true);
    }
  };

  const handleToggleStaffStatus = async (staff) => {
    if (!staff.id) {
      toast.error("Không thể xác định nhân viên");
      return;
    }

    const newStatus = staff.status === "active" ? "inactive" : "active";
    try {
      await userService.updateStaffStatus(staff.id, newStatus);
      await fetchStaff();
      toast.success(
        `Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} nhân viên!`
      );
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái nhân viên");
    }
  };

  const handleResetStaffPassword = async (staff) => {
    if (!staff.id) {
      toast.error("Không thể xác định nhân viên");
      return;
    }

    if (
      window.confirm(
        'Bạn có chắc chắn muốn đặt lại mật khẩu về "abc123" cho nhân viên này?'
      )
    ) {
      try {
        await userService.resetStaffPassword(staff.id);
        await fetchStaff();
        toast.success("Đã đặt lại mật khẩu thành công!");
      } catch (error) {
        toast.error("Không thể đặt lại mật khẩu");
      }
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!id) {
      toast.error("Không thể xác định nhân viên");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await userService.deleteStaff(id);
        await fetchStaff();
        toast.success("Xóa nhân viên thành công!");
      } catch (error) {
        toast.error("Không thể xóa nhân viên");
      }
    }
  };

  const handleSubmitStaff = async (data) => {
    try {
      setIsSubmittingStaff(true);

      if (editingStaff && editingStaff.id) {
        await userService.updateStaff(editingStaff.id, data);
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        await userService.createStaff(data);
        toast.success("Tạo nhân viên mới thành công!");
      }

      await fetchStaff();
      setShowStaffModal(false);
      setEditingStaff(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu nhân viên";
      if (Array.isArray(errorMessage)) {
        toast.error(`Lỗi: ${errorMessage.join(", ")}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  // Product CRUD Functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleViewProduct = async (product) => {
    try {
      const productDetail = await productService.getProduct(product.id);
      setSelectedProduct(productDetail);
      setShowProductDetail(true);
    } catch (error) {
      // Fallback to basic product info
      setSelectedProduct(product);
      setShowProductDetail(true);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(id);
        await fetchProducts();
        toast.success("Xóa sản phẩm thành công!");
      } catch (error) {
        toast.error("Không thể xóa sản phẩm");
      }
    }
  };

  const handleSubmitProduct = async (data) => {
    try {
      setIsSubmittingProduct(true);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(data);
        toast.success("Tạo sản phẩm mới thành công!");
      }

      await fetchProducts();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể lưu sản phẩm";
      if (Array.isArray(errorMessage)) {
        toast.error(`Lỗi: ${errorMessage.join(", ")}`);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Handle product search and filter
  const handleProductSearch = () => {
    fetchProducts();
  };

  const handleCategoryFilterChange = (categoryId) => {
    setSelectedCategoryFilter(categoryId);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(
    (category) =>
      (category.name &&
        category.name
          .toLowerCase()
          .includes(categorySearchTerm.toLowerCase())) ||
      (category.description &&
        category.description
          .toLowerCase()
          .includes(categorySearchTerm.toLowerCase()))
  );

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
      (user.role &&
        user.role.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  // Filter staff based on search term
  const filteredStaff = staff.filter(
    (staff) =>
      (staff.name &&
        staff.name.toLowerCase().includes(staffSearchTerm.toLowerCase())) ||
      (staff.email &&
        staff.email.toLowerCase().includes(staffSearchTerm.toLowerCase())) ||
      (staff.role &&
        staff.role.toLowerCase().includes(staffSearchTerm.toLowerCase()))
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      inactive: "secondary",
      pending: "warning",
      processing: "default",
      shipped: "info",
      delivered: "success",
      cancelled: "destructive",
      out_of_stock: "destructive",
    };
    return colors[status] || "secondary";
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Hoạt động",
      inactive: "Không hoạt động",
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đang giao",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
      out_of_stock: "Hết hàng",
    };
    return texts[status] || status;
  };

  // Show loading while checking auth or fetching data
  if (!isAuthenticated || user?.role !== "admin" || loading) {
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
                { id: "overview", label: "Tổng quan", icon: ChartBarIcon },
                { id: "staff", label: "Nhân viên", icon: UserGroupIcon },
                { id: "users", label: "Người dùng", icon: UserGroupIcon },
                { id: "categories", label: "Danh mục", icon: StarIcon },
                { id: "products", label: "Sản phẩm", icon: CurrencyDollarIcon },
                { id: "orders", label: "Đơn hàng", icon: ShoppingBagIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Tổng người dùng
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalUsers?.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-600">
                        +{stats.growthRate}% so với tháng trước
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">
                        Tổng đơn hàng
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalOrders?.toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-600">
                        {stats.pendingOrders} đang chờ xử lý
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">
                        Doanh thu
                      </p>
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
                      <p className="text-sm font-medium text-gray-600">
                        Sản phẩm
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalProducts}
                      </p>
                      <p className="text-sm text-yellow-600">
                        Đánh giá TB: {stats.averageRating}/5
                      </p>
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
                      <span className="font-semibold">
                        {stats.pendingOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Đang giao</span>
                      </div>
                      <span className="font-semibold">
                        {stats.shippedOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Đã giao</span>
                      </div>
                      <span className="font-semibold">
                        {stats.deliveredOrders}
                      </span>
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
                      <p className="text-sm">
                        Đơn hàng #DH123 đã được giao thành công
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">
                        Người dùng mới đăng ký: nguyenvanan@email.com
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">
                        Sản phẩm iPhone 15 Pro sắp hết hàng
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm">
                        Đánh giá mới 5 sao cho MacBook Pro M3
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý người dùng
              </h2>
              <div className="flex space-x-3">
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  className="w-64"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
                <Tooltip content="Thêm người dùng mới" placement="bottom">
                <Button onClick={handleAddUser}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
                </Tooltip>
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                user.role === "admin"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {user.role === "admin" ? "Admin" : "Khách hàng"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {getStatusText(user.status)}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {user.totalOrders || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatPrice(user.totalSpent || 0)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(user.joinDate)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Tooltip content="Xem chi tiết" placement="top">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              </Tooltip>
                              <Tooltip content="Chỉnh sửa" placement="top">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              </Tooltip>
                              <Tooltip 
                                content={user.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"} 
                                placement="top"
                              >
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  user.status === "active"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.status === "active" ? (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                              </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {userSearchTerm
                      ? "Không tìm thấy người dùng"
                      : "Chưa có người dùng nào"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {userSearchTerm
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Bắt đầu bằng cách thêm người dùng đầu tiên"}
                  </p>
                  {!userSearchTerm && (
                    <Tooltip content="Thêm người dùng đầu tiên" placement="top">
                      <Button
                        onClick={handleAddUser}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm người dùng đầu tiên
                      </Button>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Staff Tab */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý nhân viên
              </h2>
              <div className="flex space-x-3">
                <Input
                  placeholder="Tìm kiếm nhân viên..."
                  className="w-64"
                  value={staffSearchTerm}
                  onChange={(e) => setStaffSearchTerm(e.target.value)}
                />
                <Tooltip content="Thêm nhân viên mới" placement="bottom">
                <Button onClick={handleAddStaff}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm nhân viên
                </Button>
                </Tooltip>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Nhân viên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Vai trò
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày tham gia
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Lần cập nhật cuối
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 flex items-center gap-2">
                            <img src={staff.avatar} alt={staff.name} className="w-10 h-10 rounded-full" style={{ border: "1px solid #dfdfdf" }} />
                            <div>
                              <p className="font-medium text-gray-900">
                                {staff.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {staff.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="destructive">
                              {staff.role === "admin" ? "Admin" : "Nhân viên"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStaffStatus(staff)}
                              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                staff.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-red-100 text-red-800 hover:bg-red-200"
                              }`}
                            >
                              {getStatusText(staff.status)}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {formatDate(staff.createdAt || staff.joinDate)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {staff.updatedAt
                              ? formatDate(staff.updatedAt)
                              : "Chưa cập nhật"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Tooltip content="Xem chi tiết" placement="top">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewStaff(staff)}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              </Tooltip>
                              <Tooltip content="Chỉnh sửa" placement="top">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditStaff(staff)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              </Tooltip>
                              <Tooltip content="Đặt lại mật khẩu" placement="top">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResetStaffPassword(staff)}
                                className="text-blue-600"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                                  />
                                </svg>
                              </Button>
                              </Tooltip>
                              <Tooltip 
                                content={staff.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"} 
                                placement="top"
                              >
                              <Button
                                variant="outline"
                                size="sm"
                                className={
                                  staff.status === "active"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }
                                onClick={() => handleToggleStaffStatus(staff)}
                              >
                                {staff.status === "active" ? (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                                </Button>
                              </Tooltip>
                              <Tooltip content="Xóa nhân viên" placement="top">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteStaff(staff.id)}
                                  className="text-red-600"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {filteredStaff.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {staffSearchTerm
                      ? "Không tìm thấy nhân viên"
                      : "Chưa có nhân viên nào"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {staffSearchTerm
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Bắt đầu bằng cách thêm nhân viên đầu tiên"}
                  </p>
                  {!staffSearchTerm && (
                    <Tooltip content="Thêm nhân viên đầu tiên" placement="top">
                      <Button
                        onClick={handleAddStaff}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm nhân viên đầu tiên
                      </Button>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý đơn hàng
              </h2>
              <div className="flex space-x-3">
                <Input placeholder="Tìm kiếm đơn hàng..." className="w-64" />
                <Tooltip content="Bộ lọc đơn hàng" placement="bottom">
                  <Button variant="outline">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </Button>
                </Tooltip>
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
                              <Tooltip content="Xem chi tiết đơn hàng" placement="top">
                                <Button variant="outline" size="sm">
                                  <EyeIcon className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                              <Tooltip content="Cập nhật trạng thái giao hàng" placement="top">
                                <Button variant="outline" size="sm">
                                  <TruckIcon className="h-4 w-4" />
                                </Button>
                              </Tooltip>
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

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý danh mục
              </h2>
              <Tooltip content="Thêm danh mục mới" placement="bottom">
              <Button
                onClick={handleAddCategory}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Thêm danh mục
              </Button>
              </Tooltip>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                placeholder="Tìm kiếm danh mục..."
                className="pl-10"
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
              />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Tooltip content="Chỉnh sửa" placement="top">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Xóa" placement="top">
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">
                      {category.description || "Không có mô tả"}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>ID: {category.id}</span>
                      <span>
                        Tạo:{" "}
                        {new Date(category.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {categorySearchTerm
                      ? "Không tìm thấy danh mục"
                      : "Chưa có danh mục nào"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {categorySearchTerm
                      ? "Thử tìm kiếm với từ khóa khác"
                      : "Bắt đầu bằng cách thêm danh mục đầu tiên"}
                  </p>
                  {!categorySearchTerm && (
                    <Tooltip content="Thêm danh mục đầu tiên" placement="top">
                      <Button
                        onClick={handleAddCategory}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm danh mục đầu tiên
                      </Button>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý sản phẩm
              </h2>
              <Tooltip content="Thêm sản phẩm mới" placement="bottom">
                <Button onClick={handleAddProduct}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </Tooltip>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="Tìm kiếm sản phẩm..." 
                  className="w-full"
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Tooltip content="Tìm kiếm sản phẩm" placement="bottom">
                  <Button onClick={handleProductSearch} variant="outline">
                    <FunnelIcon className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </Button>
                </Tooltip>
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
                      {products.map((product) => {
                        const category = categories.find(cat => cat.id === product.categoryId);
                        return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={Array.isArray(product.images) ? product.images[0] : product.images}
                                    alt={product.name}
                                    className="w-10 h-10 object-cover rounded-md"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                                <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                              <Badge variant="outline">
                                {category ? category.name : 'Không có danh mục'}
                              </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                              <div>
                                <span className="font-medium">{formatPrice(product.price)}</span>
                                {product.discount > 0 && (
                                  <div className="text-xs text-red-600">
                                    Giảm {product.discount}%
                                  </div>
                                )}
                              </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <span
                              className={
                                product.stock === 0
                                  ? "text-red-600 font-medium"
                                    : product.stock < 10
                                    ? "text-yellow-600 font-medium"
                                  : ""
                              }
                            >
                                {product.stock || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                              {product.sales || 0}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span>{product.rating || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                              <Badge variant={getStatusColor(product.status || 'active')}>
                                {getStatusText(product.status || 'active')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                                <Tooltip content="Xem chi tiết" placement="top">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleViewProduct(product)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Chỉnh sửa" placement="top">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                                <Tooltip content="Xóa sản phẩm" placement="top">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </Tooltip>
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {products.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {productSearchTerm || selectedCategoryFilter !== "all"
                      ? "Không tìm thấy sản phẩm"
                      : "Chưa có sản phẩm nào"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {productSearchTerm || selectedCategoryFilter !== "all"
                      ? "Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác"
                      : "Bắt đầu bằng cách thêm sản phẩm đầu tiên"}
                  </p>
                  {!productSearchTerm && selectedCategoryFilter === "all" && (
                    <Tooltip content="Thêm sản phẩm đầu tiên" placement="top">
                      <Button
                        onClick={handleAddProduct}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Thêm sản phẩm đầu tiên
                      </Button>
                    </Tooltip>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  name: formData.get("name"),
                  description: formData.get("description"),
                  price: parseFloat(formData.get("price")),
                  discount: parseFloat(formData.get("discount")) || 0,
                  stock: parseInt(formData.get("stock")),
                  categoryId: parseInt(formData.get("categoryId")),
                  images: formData.get("images") || "[]",
                };

                handleSubmitProduct(data);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên sản phẩm *
                  </label>
                  <Input
                    name="name"
                    defaultValue={editingProduct?.name || ""}
                    required
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Danh mục *
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId || ""}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả sản phẩm
                </label>
                <textarea
                  name="description"
                  defaultValue={editingProduct?.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giá bán *
                  </label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    defaultValue={editingProduct?.price || ""}
                    required
                    placeholder="Nhập giá bán"
                  />
                </div>

                <div>
                  <label
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Giảm giá (%)
                  </label>
                  <Input
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={editingProduct?.discount || 0}
                    placeholder="Nhập % giảm giá"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Số lượng tồn kho *
                  </label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={editingProduct?.stock || ""}
                    required
                    placeholder="Nhập số lượng"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hình ảnh (URL, phân cách bằng dấu phẩy)
                </label>
                <Input
                  name="images"
                  defaultValue={
                    editingProduct?.images 
                      ? Array.isArray(editingProduct.images) 
                        ? editingProduct.images.join(", ")
                        : editingProduct.images
                      : ""
                  }
                  placeholder="Nhập URL hình ảnh, phân cách bằng dấu phẩy"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingProduct
                    ? editingProduct
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : editingProduct
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết sản phẩm
              </h3>
              <button
                onClick={() => setShowProductDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h4>
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  <div className="space-y-4">
                    {Array.isArray(selectedProduct.images) ? (
                      selectedProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ))
                    ) : (
                      <img
                        src={selectedProduct.images}
                        alt={selectedProduct.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-gray-600">
                    {selectedProduct.description || "Không có mô tả"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Giá bán
                    </label>
                    <p className="text-xl font-semibold text-blue-600">
                      {formatPrice(selectedProduct.price)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Giảm giá
                    </label>
                    <p className="text-lg font-medium text-red-600">
                      {selectedProduct.discount || 0}%
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Tồn kho
                    </label>
                    <p className={`text-lg font-medium ${
                      selectedProduct.stock === 0 
                        ? "text-red-600" 
                        : selectedProduct.stock < 10 
                        ? "text-yellow-600" 
                        : "text-green-600"
                    }`}>
                      {selectedProduct.stock || 0}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Đã bán
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {selectedProduct.sales || 0}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Danh mục
                  </label>
                  <Badge variant="outline">
                    {categories.find(cat => cat.id === selectedProduct.categoryId)?.name || 'Không có danh mục'}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Đánh giá
                  </label>
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-medium">
                      {selectedProduct.rating || 0}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <Badge variant={getStatusColor(selectedProduct.status || 'active')}>
                    {getStatusText(selectedProduct.status || 'active')}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Ngày tạo
                    </label>
                    <p className="text-gray-900">
                      {formatDate(selectedProduct.createdAt)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Cập nhật cuối
                    </label>
                    <p className="text-gray-900">
                      {selectedProduct.updatedAt 
                        ? formatDate(selectedProduct.updatedAt)
                        : "Chưa cập nhật"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
              <button
                onClick={() => setShowProductDetail(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowProductDetail(false);
                  handleEditProduct(selectedProduct);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  name: formData.get("name"),
                  email: formData.get("email"),
                  password: formData.get("password"),
                  phone: formData.get("phone"),
                  address: formData.get("address"),
                };

                // Only include role and status when editing
                if (editingUser) {
                  data.role = formData.get("role");
                  data.status = formData.get("status");

                  // Remove password if editing and empty
                  if (!data.password) {
                    delete data.password;
                  }
                }
                // Note: API không chấp nhận role và status khi tạo user mới
                // Role và status sẽ được set mặc định bởi backend

                handleSubmitUser(data);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên *
                </label>
                <Input
                  name="name"
                  defaultValue={editingUser?.name || ""}
                  required
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingUser?.email || ""}
                  required
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu {!editingUser && "*"}
                </label>
                <Input
                  name="password"
                  type="password"
                  required={!editingUser}
                  placeholder={
                    editingUser
                      ? "Để trống nếu không đổi mật khẩu"
                      : "Nhập mật khẩu"
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <Input
                  name="phone"
                  defaultValue={editingUser?.phone || ""}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  defaultValue={editingUser?.address || ""}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Only show role and status when editing */}
              {editingUser && (
                <>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Vai trò *
                    </label>
                    <select
                      name="role"
                      defaultValue={editingUser?.role || "customer"}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Trạng thái *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingUser?.status || "active"}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                    </select>
                  </div>
                </>
              )}

              {/* Show info when creating new user */}
              {!editingUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    ℹ️ Người dùng mới sẽ được tạo. Vai trò và trạng thái sẽ được
                    set bởi hệ thống.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUser}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingUser
                    ? editingUser
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : editingUser
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết người dùng
              </h3>
              <button
                onClick={() => setShowUserDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Họ tên
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedUser.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900">
                    {selectedUser.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Vai trò
                  </label>
                  <Badge
                    variant={
                      selectedUser.role === "admin" ? "destructive" : "default"
                    }
                  >
                    {selectedUser.role === "admin" ? "Admin" : "Khách hàng"}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <Badge variant={getStatusColor(selectedUser.status)}>
                    {getStatusText(selectedUser.status)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Địa chỉ
                  </label>
                  <p className="text-gray-900">
                    {selectedUser.address || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ngày tham gia
                  </label>
                  <p className="text-gray-900">
                    {formatDate(
                      selectedUser.joinDate || selectedUser.createdAt
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tổng đơn hàng
                  </label>
                  <p className="text-lg font-semibold text-blue-600">
                    {selectedUser.totalOrders || 0}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Tổng chi tiêu
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatPrice(selectedUser.totalSpent || 0)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Lần cập nhật cuối
                  </label>
                  <p className="text-gray-900">
                    {selectedUser.updatedAt
                      ? formatDate(selectedUser.updatedAt)
                      : "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowUserDetail(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowUserDetail(false);
                  handleEditUser(selectedUser);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  name: formData.get("name"),
                  description: formData.get("description"),
                };
                handleSubmitCategory(data);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên danh mục *
                </label>
                <Input
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                  placeholder="Nhập tên danh mục"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả
                </label>
                <textarea
                  name="description"
                  defaultValue={editingCategory?.description || ""}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả danh mục (tùy chọn)"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCategory}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingCategory
                    ? editingCategory
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : editingCategory
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
              </h3>
              <button
                onClick={() => setShowStaffModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  name: formData.get("name"),
                  email: formData.get("email"),
                };

                handleSubmitStaff(data);
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên *
                </label>
                <Input
                  name="name"
                  defaultValue={editingStaff?.name || ""}
                  required
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingStaff?.email || ""}
                  required
                  placeholder="Nhập email"
                />
              </div>

              {/* Show info when creating new staff */}
              {!editingStaff && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-700">
                    ℹ️ Nhân viên mới sẽ được tạo với vai trò admin. Chỉ cần nhập tên, email, tên đăng nhập và mật khẩu.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingStaff
                    ? editingStaff
                      ? "Đang cập nhật..."
                      : "Đang tạo..."
                    : editingStaff
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      {showStaffDetail && selectedStaff && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết nhân viên
              </h3>
              <button
                onClick={() => setShowStaffDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Họ tên
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedStaff.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedStaff.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900">
                    {selectedStaff.phone || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Vai trò
                  </label>
                  <Badge variant="destructive">
                    {selectedStaff.role === "admin" ? "Admin" : "Nhân viên"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Địa chỉ
                  </label>
                  <p className="text-gray-900">
                    {selectedStaff.address || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ngày tham gia
                  </label>
                  <p className="text-gray-900">
                    {formatDate(
                      selectedStaff.createdAt || selectedStaff.joinDate
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Lần cập nhật cuối
                  </label>
                  <p className="text-gray-900">
                    {selectedStaff.updatedAt
                      ? formatDate(selectedStaff.updatedAt)
                      : "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Trạng thái
                  </label>
                  <Badge variant={getStatusColor(selectedStaff.status)}>
                    {getStatusText(selectedStaff.status)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowStaffDetail(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowStaffDetail(false);
                  handleEditStaff(selectedStaff);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
