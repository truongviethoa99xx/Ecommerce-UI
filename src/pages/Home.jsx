import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { toast } from 'react-toastify';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const benefits = [
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: 'Giao hàng nhanh',
      description: 'Giao hàng trong 24h nội thành',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: <CreditCardIcon className="h-8 w-8" />,
      title: 'Thanh toán an toàn',
      description: 'Đa dạng phương thức thanh toán',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Bảo hành chính hãng',
      description: 'Sản phẩm chính hãng, bảo hành tận nơi',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Thị Mai',
      comment: 'Sản phẩm chất lượng, giao hàng nhanh. Tôi rất hài lòng với dịch vụ!',
      rating: 5,
      avatar: '👩‍💼',
      location: 'Hà Nội'
    },
    {
      name: 'Trần Văn Nam',
      comment: 'Dịch vụ khách hàng tuyệt vời, giải quyết vấn đề nhanh chóng và chuyên nghiệp.',
      rating: 5,
      avatar: '👨‍💻',
      location: 'TP.HCM'
    },
    {
      name: 'Lê Thị Hoa',
      comment: 'Giá cả hợp lý, nhiều sản phẩm để lựa chọn. Sẽ tiếp tục ủng hộ!',
      rating: 4,
      avatar: '👩‍🎨',
      location: 'Đà Nẵng'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and categories in parallel
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts({ limit: 8 }),
          productService.getCategories()
        ]);

        setProducts(productsData.data || productsData);
        setFeaturedProducts(productsData.data?.slice(0, 4) || productsData.slice(0, 4));
        setCategories(categoriesData.data || categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu');
        
        // Mock data for demonstration
        const mockProducts = [
          {
            id: 1,
            name: 'iPhone 15 Pro Max',
            description: 'Điện thoại thông minh cao cấp từ Apple với camera chuyên nghiệp',
            price: 30000000,
            originalPrice: 35000000,
            image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
            stock: 10,
            category: { name: 'Điện thoại' },
            rating: 4.8,
            reviewCount: 245
          },
          {
            id: 2,
            name: 'MacBook Pro M3',
            description: 'Laptop chuyên nghiệp cho designer và developer',
            price: 45000000,
            originalPrice: 50000000,
            image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
            stock: 5,
            category: { name: 'Laptop' },
            rating: 4.9,
            reviewCount: 189
          },
          {
            id: 3,
            name: 'AirPods Pro 2',
            description: 'Tai nghe không dây chống ồn tuyệt vời',
            price: 6000000,
            originalPrice: 7000000,
            image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
            stock: 15,
            category: { name: 'Phụ kiện' },
            rating: 4.7,
            reviewCount: 156
          },
          {
            id: 4,
            name: 'iPad Air M2',
            description: 'Máy tính bảng đa năng cho công việc và giải trí',
            price: 18000000,
            originalPrice: 20000000,
            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            stock: 8,
            category: { name: 'Tablet' },
            rating: 4.6,
            reviewCount: 203
          }
        ];
        
        setProducts(mockProducts);
        setFeaturedProducts(mockProducts);
        setCategories([
          { id: 1, name: 'Điện thoại', slug: 'dien-thoai', icon: '📱', description: 'Smartphone cao cấp' },
          { id: 2, name: 'Laptop', slug: 'laptop', icon: '💻', description: 'Máy tính xách tay' },
          { id: 3, name: 'Phụ kiện', slug: 'phu-kien', icon: '🎧', description: 'Phụ kiện công nghệ' },
          { id: 4, name: 'Tablet', slug: 'tablet', icon: '📱', description: 'Máy tính bảng' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Mua sắm thông minh
                <span className="block text-yellow-300 text-3xl md:text-4xl lg:text-5xl mt-2">
                  Giá tốt nhất thị trường
                </span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
                Khám phá hàng nghìn sản phẩm chất lượng cao với giá cả cạnh tranh. 
                Trải nghiệm mua sắm trực tuyến tuyệt vời nhất tại Việt Nam!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center group shadow-lg"
                >
                  Mua sắm ngay
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/categories"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center"
                >
                  Xem danh mục
                </Link>
              </div>
            </div>
            
            {/* Hero Illustration */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center text-8xl backdrop-blur-sm">
                  🛍️
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  💝
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-xl animate-pulse">
                  ⭐
                </div>
                <div className="absolute top-1/2 -left-8 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-lg animate-ping">
                  🎉
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className={`bg-gradient-to-r ${benefit.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danh mục nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Khám phá các sản phẩm hot nhất theo từng danh mục
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug || category.id}`}
                className="group transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon || '📱'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description || 'Sản phẩm chất lượng'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-xl text-gray-600">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              Xem tất cả sản phẩm
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Những phản hồi tích cực từ khách hàng thân thiết
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <div className="flex text-yellow-400 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Đăng ký nhận tin khuyến mãi
            </h2>
            <p className="text-xl opacity-90">
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt ngay trong hộp thư của bạn
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200 whitespace-nowrap">
              Đăng ký ngay
            </button>
          </div>
          <p className="text-sm opacity-75 mt-4">
            * Chúng tôi cam kết không spam và bảo mật thông tin của bạn
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;