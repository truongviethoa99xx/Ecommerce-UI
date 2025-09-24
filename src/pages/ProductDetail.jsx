import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { 
  StarIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showImageModal, setShowImageModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProduct(id);
      setProduct(productData);
    } catch (error) {
      // Handle error silently
      toast.error('Không thể tải thông tin sản phẩm');
      
      // Enhanced mock data for demonstration
      const mockProduct = {
        id: parseInt(id),
        name: 'iPhone 15 Pro Max 256GB',
        description: 'iPhone 15 Pro Max là điện thoại thông minh cao cấp mới nhất từ Apple với chip A17 Pro, camera 48MP và màn hình Super Retina XDR 6.7 inch.',
        longDescription: `
          iPhone 15 Pro Max mang đến hiệu năng vượt trội với chip A17 Pro được sản xuất trên tiến trình 3nm tiên tiến nhất, 
          cho phép xử lý mọi tác vụ từ gaming đến chỉnh sửa video một cách mượt mà. 
          
          Camera chính 48MP với hệ thống ống kính telephoto 5x giúp bạn chụp ảnh chuyên nghiệp ở mọi khoảng cách. 
          Tính năng Action Button mới cho phép tùy chỉnh nhanh chóng các chức năng yêu thích.
          
          Thiết kế titanium cao cấp vừa bền bỉ vừa nhẹ nhàng, tạo cảm giác premium trong tay. 
          Màn hình ProMotion 120Hz mang lại trải nghiệm mượt mà và sống động.
        `,
        price: 35000000,
        salePrice: 30000000,
        sale: true,
        salePercent: 14,
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
          'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
          'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800',
          'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800'
        ],
        stock: 15,
        category: { name: 'Điện thoại', id: 1 },
        rating: 4.8,
        reviewCount: 245,
        brand: 'Apple',
        sku: 'IP15PM-256-NTU',
        warranty: '12 tháng',
        origin: 'Chính hãng Apple Việt Nam',
        specifications: {
          'Màn hình': '6.7" Super Retina XDR OLED, 2796 x 1290 pixels',
          'Chip xử lý': 'Apple A17 Pro (3nm)',
          'Bộ nhớ trong': '256GB',
          'RAM': '8GB',
          'Camera sau': 'Chính 48MP, Ultra Wide 12MP, Telephoto 12MP (5x zoom)',
          'Camera trước': '12MP TrueDepth',
          'Pin': '4441mAh, sạc nhanh 27W',
          'Hệ điều hành': 'iOS 17',
          'Kết nối': '5G, WiFi 6E, Bluetooth 5.3, USB-C',
          'Màu sắc': 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium',
          'Kích thước': '159.9 x 76.7 x 8.25 mm',
          'Trọng lượng': '221g'
        },
        features: [
          'Chip A17 Pro 3nm mạnh mẽ nhất từ trước đến nay',
          'Camera 48MP với zoom quang học 5x',
          'Thiết kế titanium cao cấp, nhẹ hơn 19g so với thế hệ trước',
          'Action Button tùy chỉnh thay thế nút im lặng',
          'Cổng USB-C với tốc độ truyền dữ liệu cao',
          'Màn hình ProMotion 120Hz với Always-On Display',
          'Chống nước IP68 ở độ sâu 6m trong 30 phút',
          'Hỗ trợ sạc không dây MagSafe 15W'
        ],
        variants: [
          { name: '128GB', price: 28000000, salePrice: 25000000 },
          { name: '256GB', price: 35000000, salePrice: 30000000, selected: true },
          { name: '512GB', price: 42000000, salePrice: 38000000 },
          { name: '1TB', price: 49000000, salePrice: 45000000 }
        ],
        colors: [
          { name: 'Natural Titanium', code: '#8B7355', selected: true },
          { name: 'Blue Titanium', code: '#5F7A95' },
          { name: 'White Titanium', code: '#F2F2F7' },
          { name: 'Black Titanium', code: '#2C2C2E' }
        ]
      };
      setProduct(mockProduct);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      // Mock related products
      const mockRelatedProducts = [
        {
          id: 2,
          name: 'iPhone 15 Pro 128GB',
          price: 25000000,
          salePrice: 22000000,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          rating: 4.7,
          reviewCount: 189
        },
        {
          id: 3,
          name: 'AirPods Pro 2nd Gen',
          price: 7000000,
          salePrice: 6000000,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
          rating: 4.6,
          reviewCount: 156
        },
        {
          id: 4,
          name: 'MagSafe Charger',
          price: 1200000,
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400',
          rating: 4.4,
          reviewCount: 89
        },
        {
          id: 5,
          name: 'iPhone 15 Case',
          price: 800000,
          image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400',
          rating: 4.3,
          reviewCount: 67
        }
      ];
      setRelatedProducts(mockRelatedProducts);
    } catch (error) {
      // Handle error silently
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      // Mock reviews data
      const mockReviews = [
        {
          id: 1,
          userName: 'Nguyễn Văn An',
          avatar: '👨‍💼',
          rating: 5,
          date: '2024-01-15',
          title: 'Sản phẩm tuyệt vời!',
          content: 'iPhone 15 Pro Max thực sự ấn tượng. Camera chụp ảnh rất đẹp, màn hình sắc nét và hiệu năng mượt mà. Đáng đồng tiền bát gạo!',
          helpful: 23,
          images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200']
        },
        {
          id: 2,
          userName: 'Trần Thị Mai',
          avatar: '👩‍🎨',
          rating: 4,
          date: '2024-01-10',
          title: 'Chất lượng tốt nhưng giá hơi cao',
          content: 'Sản phẩm chất lượng, thiết kế đẹp. Tuy nhiên giá thành khá cao so với mặt bằng chung. Nhưng xét về chất lượng thì vẫn đáng tiền.',
          helpful: 15
        },
        {
          id: 3,
          userName: 'Lê Minh Đức',
          avatar: '👨‍💻',
          rating: 5,
          date: '2024-01-08',
          title: 'Nâng cấp xứng đáng',
          content: 'Nâng cấp từ iPhone 12 Pro và cảm thấy sự khác biệt rõ rệt. Pin trâu hơn, camera tốt hơn, thiết kế titanium rất premium.',
          helpful: 31
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      // Handle error silently
    } finally {
      setReviewsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Handle error silently
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã copy link sản phẩm!');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const ImageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={() => setShowImageModal(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img
          src={images[selectedImage]}
          alt={product.name}
          className="max-w-full max-h-full object-contain"
        />
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <button
            onClick={prevImage}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <button
            onClick={nextImage}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="h-96 bg-gray-300 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded w-2/3"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 mb-8">Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li><Link to="/" className="text-blue-600 hover:text-blue-800">Trang chủ</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link to="/products" className="text-blue-600 hover:text-blue-800">Sản phẩm</Link></li>
            <li className="text-gray-500">/</li>
            <li><Link to={`/categories/${product.category?.id}`} className="text-blue-600 hover:text-blue-800">{product.category?.name}</Link></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 truncate">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="relative mb-4 group">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              />
              
              {/* Sale Badge */}
              {product.sale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.salePercent}%
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <MagnifyingGlassPlusIcon className="w-5 h-5" />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  >
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImage === index ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-16 lg:h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {renderStars(Math.floor(product.rating))}
                <span className="ml-2 text-lg font-medium text-gray-900">{product.rating}</span>
                <span className="ml-2 text-gray-600">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
              <span className="mx-4 text-gray-300">|</span>
              <span className="text-gray-600">SKU: {product.sku}</span>
            </div>

            {/* Price */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              {product.sale ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl lg:text-4xl font-bold text-red-600">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Tiết kiệm {formatPrice(product.price - product.salePrice)}
                    </span>
                  </div>
                  <span className="text-xl text-gray-500 line-through block">
                    {formatPrice(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    Còn {product.stock} sản phẩm
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Hết hàng</span>
                </div>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Màu sắc:</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full border-2 ${
                        color.selected ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Storage Options */}
            {product.variants && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dung lượng:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                        variant.selected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm">
                        {variant.salePrice ? (
                          <>
                            <span className="text-red-600 font-semibold">
                              {formatPrice(variant.salePrice)}
                            </span>
                            <span className="text-gray-500 line-through ml-2">
                              {formatPrice(variant.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold">{formatPrice(variant.price)}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Số lượng:
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-6 py-3 font-medium text-lg min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Tối đa {product.stock} sản phẩm
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4 mb-8">
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center text-lg"
                >
                  <ShoppingCartIcon className="h-6 w-6 mr-2" />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ShareIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full bg-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-lg"
              >
                Mua ngay
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Bảo hành {product.warranty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-700">Đổi trả 30 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Mô tả sản phẩm' },
                { id: 'specifications', label: 'Thông số kỹ thuật' },
                { id: 'reviews', label: `Đánh giá (${product.reviewCount})` },
                { id: 'shipping', label: 'Vận chuyển & Đổi trả' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Mô tả chi tiết</h3>
                  <div className="prose prose-lg text-gray-600 leading-relaxed">
                    {product.longDescription?.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph.trim()}</p>
                    ))}
                  </div>
                </div>
                
                {product.features && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Tính năng nổi bật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Thông số kỹ thuật</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(product.specifications || {}).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50 w-1/3">
                            {key}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Đánh giá từ khách hàng ({product.reviewCount})
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Viết đánh giá
                  </button>
                </div>

                {/* Review Summary */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {renderStars(Math.floor(product.rating))}
                      </div>
                      <div className="text-sm text-gray-600">{product.reviewCount} đánh giá</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center space-x-2 mb-1">
                          <span className="text-sm w-8">{star} ⭐</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {star === 5 ? 172 : star === 4 ? 49 : star === 3 ? 12 : star === 2 ? 7 : 5}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{review.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          {review.title && (
                            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                          )}
                          <p className="text-gray-700 mb-3">{review.content}</p>
                          {review.images && (
                            <div className="flex space-x-2 mb-3">
                              {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="Review" className="w-16 h-16 object-cover rounded-lg" />
                              ))}
                            </div>
                          )}
                          <div className="flex items-center space-x-4 text-sm">
                            <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v1a2 2 0 00-2 2v7a2 2 0 002 2h1l5 1z" />
                              </svg>
                              <span>Hữu ích ({review.helpful})</span>
                            </button>
                            <button className="text-gray-500 hover:text-gray-700">Trả lời</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                    Xem thêm đánh giá
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Chính sách vận chuyển</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <TruckIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">Miễn phí vận chuyển</h4>
                        <p className="text-gray-600">Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển toàn quốc</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-medium text-gray-900">Giao hàng nhanh</h4>
                        <p className="text-gray-600">Giao hàng trong 2-3 ngày tại nội thành, 3-5 ngày tại các tỉnh thành khác</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Chính sách đổi trả</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <ArrowPathIcon className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">Đổi trả trong 30 ngày</h4>
                        <p className="text-gray-600">Hỗ trợ đổi trả miễn phí trong 30 ngày đầu tiên</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">Bảo hành chính hãng</h4>
                        <p className="text-gray-600">Sản phẩm được bảo hành chính hãng {product.warranty} tại tất cả các trung tâm bảo hành</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && <ImageModal />}
    </div>
  );
};

export default ProductDetail;