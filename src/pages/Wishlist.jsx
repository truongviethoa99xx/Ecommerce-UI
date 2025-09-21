import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { toast } from 'react-toastify';
import { 
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const Wishlist = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterAndSortItems();
  }, [wishlistItems, searchTerm, sortBy]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      const mockWishlist = [
        {
          id: 1,
          product: {
            id: 1,
            name: 'iPhone 15 Pro Max 256GB',
            description: 'Điện thoại thông minh cao cấp từ Apple với camera chuyên nghiệp',
            price: 30000000,
            originalPrice: 35000000,
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            category: { name: 'Điện thoại' },
            rating: 4.8,
            reviewCount: 245,
            inStock: true,
            discount: 14
          },
          addedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          product: {
            id: 2,
            name: 'MacBook Pro M3 14-inch',
            description: 'Laptop chuyên nghiệp cho designer và developer',
            price: 45000000,
            originalPrice: 50000000,
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
            category: { name: 'Laptop' },
            rating: 4.9,
            reviewCount: 189,
            inStock: true,
            discount: 10
          },
          addedAt: '2024-01-12T14:20:00Z'
        },
        {
          id: 3,
          product: {
            id: 3,
            name: 'AirPods Pro 2nd Generation',
            description: 'Tai nghe không dây chống ồn tuyệt vời',
            price: 6000000,
            originalPrice: 7000000,
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
            category: { name: 'Phụ kiện' },
            rating: 4.7,
            reviewCount: 156,
            inStock: false,
            discount: 14
          },
          addedAt: '2024-01-10T09:15:00Z'
        },
        {
          id: 4,
          product: {
            id: 4,
            name: 'iPad Air M2 Wi-Fi 128GB',
            description: 'Máy tính bảng đa năng cho công việc và giải trí',
            price: 18000000,
            originalPrice: 20000000,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            category: { name: 'Tablet' },
            rating: 4.6,
            reviewCount: 203,
            inStock: true,
            discount: 10
          },
          addedAt: '2024-01-08T16:45:00Z'
        }
      ];
      
      setWishlistItems(mockWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortItems = () => {
    let filtered = wishlistItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'price-low':
          return a.product.price - b.product.price;
        case 'price-high':
          return b.product.price - a.product.price;
        case 'name':
          return a.product.name.localeCompare(b.product.name);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleRemoveFromWishlist = async (itemId, productName) => {
    try {
      setWishlistItems(items => items.filter(item => item.id !== itemId));
      toast.success(`Đã xóa ${productName} khỏi danh sách yêu thích`);
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      toast.error('Sản phẩm hiện đang hết hàng');
      return;
    }
    
    addItem(product, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const handleAddAllToCart = () => {
    const inStockItems = filteredItems.filter(item => item.product.inStock);
    if (inStockItems.length === 0) {
      toast.error('Không có sản phẩm nào còn hàng');
      return;
    }

    inStockItems.forEach(item => {
      addItem(item.product, 1);
    });
    
    toast.success(`Đã thêm ${inStockItems.length} sản phẩm vào giỏ hàng`);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong danh sách yêu thích?')) {
      setWishlistItems([]);
      toast.success('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích');
    }
  };

  const handleShareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Danh sách yêu thích của tôi',
          text: `Xem danh sách ${wishlistItems.length} sản phẩm yêu thích của tôi`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã copy link danh sách yêu thích!');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <HeartIcon className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Vui lòng đăng nhập</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Bạn cần đăng nhập để xem danh sách yêu thích
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="animate-pulse space-y-4">
                      <div className="h-48 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <HeartSolidIcon className="h-8 w-8 text-red-500 mr-3" />
                Danh sách yêu thích
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} sản phẩm trong danh sách yêu thích của bạn
              </p>
            </div>
            {wishlistItems.length > 0 && (
              <div className="flex space-x-3">
                <Button variant="outline" onClick={handleShareWishlist}>
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button variant="outline" onClick={handleClearWishlist}>
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Xóa tất cả
                </Button>
              </div>
            )}
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Danh sách yêu thích trống
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích. 
                Hãy khám phá và thêm những sản phẩm bạn yêu thích!
              </p>
              <Button asChild size="lg">
                <Link to="/products">Khám phá sản phẩm</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filters and Actions */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm kiếm sản phẩm yêu thích..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                  <Button onClick={handleAddAllToCart}>
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Thêm tất cả vào giỏ
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-600">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300 group">
                    <CardContent className="p-0">
                      <div className="relative">
                        <Link to={`/products/${item.product.id}`}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 space-y-1">
                          {item.product.discount && (
                            <Badge variant="destructive">
                              -{item.product.discount}%
                            </Badge>
                          )}
                          {!item.product.inStock && (
                            <Badge variant="secondary">
                              Hết hàng
                            </Badge>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id, item.product.name)}
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors group"
                        >
                          <HeartSolidIcon className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                        </button>
                      </div>

                      <div className="p-4">
                        <Link to={`/products/${item.product.id}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 mb-2 line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.product.description}
                        </p>

                        <Badge variant="secondary" className="mb-3">
                          {item.product.category.name}
                        </Badge>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(item.product.rating) ? 'fill-current' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {item.product.rating} ({item.product.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-blue-600">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                          <Button
                            onClick={() => handleAddToCart(item.product)}
                            disabled={!item.product.inStock}
                            className="w-full"
                            size="sm"
                          >
                            <ShoppingCartIcon className="h-4 w-4 mr-2" />
                            {item.product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                          </Button>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              asChild
                            >
                              <Link to={`/products/${item.product.id}`}>
                                Xem chi tiết
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFromWishlist(item.id, item.product.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Added Date */}
                        <p className="text-xs text-gray-500 mt-3">
                          Thêm vào: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
