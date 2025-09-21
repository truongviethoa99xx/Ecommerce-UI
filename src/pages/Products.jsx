import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  XMarkIcon,
  StarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [ratingFilter, setRatingFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in_stock', 'out_of_stock'

  useEffect(() => {
    fetchData();
  }, [searchParams, currentPage, itemsPerPage]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (ratingFilter) params.set('rating', ratingFilter);
    if (stockFilter !== 'all') params.set('stock', stockFilter);
    
    setSearchParams(params);
    if (currentPage !== 1) {
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [searchTerm, selectedCategory, sortBy, priceRange, ratingFilter, stockFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        categoryId: selectedCategory,
        sortBy: sortBy === 'newest' ? 'createdAt' : sortBy === 'price_desc' ? 'price' : sortBy,
        sortOrder: sortBy === 'price_desc' || sortBy === 'name_desc' ? 'DESC' : 'ASC',
        minPrice: priceRange.min,
        maxPrice: priceRange.max
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key] || params[key] === 'all') delete params[key];
      });

      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(params),
        productService.getCategories()
      ]);

      // Handle API response format - could be array or object with data/pagination
      if (productsData.data && productsData.pagination) {
        setProducts(productsData.data);
        setTotalProducts(productsData.pagination.total);
        setTotalPages(productsData.pagination.totalPages);
      } else {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotalProducts(Array.isArray(productsData) ? productsData.length : 0);
        setTotalPages(Math.ceil((Array.isArray(productsData) ? productsData.length : 0) / itemsPerPage));
      }
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Không thể tải dữ liệu sản phẩm');
      
      // Enhanced mock data for demonstration
      const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB',
          description: 'Điện thoại thông minh cao cấp từ Apple với camera chuyên nghiệp 48MP, chip A17 Pro',
          price: 30000000,
          originalPrice: 35000000,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
          stock: 10,
          category: { name: 'Điện thoại', id: 1 },
          rating: 4.8,
          reviewCount: 245,
          discount: 14,
          isNew: true,
          isBestSeller: true
        },
        {
          id: 2,
          name: 'MacBook Pro M3 14-inch',
          description: 'Laptop chuyên nghiệp cho designer và developer với chip M3 mạnh mẽ',
          price: 45000000,
          originalPrice: 50000000,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
          stock: 5,
          category: { name: 'Laptop', id: 2 },
          rating: 4.9,
          reviewCount: 189,
          discount: 10,
          isNew: false,
          isBestSeller: true
        },
        {
          id: 3,
          name: 'AirPods Pro 2nd Generation',
          description: 'Tai nghe không dây chống ồn với chip H2 và case sạc MagSafe',
          price: 6000000,
          originalPrice: 7000000,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
          stock: 15,
          category: { name: 'Phụ kiện', id: 3 },
          rating: 4.7,
          reviewCount: 156,
          discount: 14,
          isNew: false,
          isBestSeller: false
        },
        {
          id: 4,
          name: 'iPad Air M2 Wi-Fi 128GB',
          description: 'Máy tính bảng đa năng cho công việc và giải trí với chip M2',
          price: 18000000,
          originalPrice: 20000000,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
          stock: 8,
          category: { name: 'Tablet', id: 4 },
          rating: 4.6,
          reviewCount: 203,
          discount: 10,
          isNew: true,
          isBestSeller: false
        },
        {
          id: 5,
          name: 'Samsung Galaxy S24 Ultra',
          description: 'Flagship Android với camera tuyệt vời 200MP và S Pen tích hợp',
          price: 28000000,
          originalPrice: 32000000,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
          stock: 12,
          category: { name: 'Điện thoại', id: 1 },
          rating: 4.5,
          reviewCount: 167,
          discount: 13,
          isNew: true,
          isBestSeller: false
        },
        {
          id: 6,
          name: 'Dell XPS 13 Plus',
          description: 'Laptop mỏng nhẹ cao cấp cho doanh nhân với thiết kế premium',
          price: 35000000,
          originalPrice: 38000000,
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
          stock: 7,
          category: { name: 'Laptop', id: 2 },
          rating: 4.4,
          reviewCount: 89,
          discount: 8,
          isNew: false,
          isBestSeller: false
        }
      ];
      
      setProducts(mockProducts);
      setTotalProducts(mockProducts.length);
      setTotalPages(Math.ceil(mockProducts.length / itemsPerPage));
      setCategories([
        { id: 1, name: 'Điện thoại', slug: 'dien-thoai', count: 2 },
        { id: 2, name: 'Laptop', slug: 'laptop', count: 2 },
        { id: 3, name: 'Phụ kiện', slug: 'phu-kien', count: 1 },
        { id: 4, name: 'Tablet', slug: 'tablet', count: 1 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search will be triggered by useEffect
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setRatingFilter('');
    setStockFilter('all');
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSortLabel = (value) => {
    const labels = {
      'newest': 'Mới nhất',
      'name': 'Tên A-Z',
      'name_desc': 'Tên Z-A',
      'price': 'Giá thấp đến cao',
      'price_desc': 'Giá cao đến thấp',
      'rating': 'Đánh giá cao nhất',
      'popular': 'Phổ biến nhất'
    };
    return labels[value] || 'Mới nhất';
  };

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex gap-6">
        <div className="relative flex-shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
              {product.name}
            </h3>
            <div className="flex items-center space-x-2">
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Mới</span>
              )}
              {product.isBestSeller && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Bán chạy</span>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {product.rating} ({product.reviewCount} đánh giá)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  {product.originalPrice.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </span>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Sản phẩm
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Khám phá hàng nghìn sản phẩm chất lượng cao
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            </div>
          </form>

          {/* Filter Toggle Button (Mobile) */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Bộ lọc & Sắp xếp</span>
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-3 ${showFilters ? 'block' : 'hidden'} lg:block mb-8 lg:mb-0`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Bộ lọc</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Xóa tất cả
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        value=""
                        checked={selectedCategory === ''}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">Tất cả</span>
                    </div>
                    <span className="text-xs text-gray-500">{totalProducts}</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          value={category.id}
                          checked={selectedCategory === category.id.toString()}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{category.count || 0}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Khoảng giá</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Từ (VNĐ)"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến (VNĐ)"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Đánh giá</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="radio"
                        value={rating}
                        checked={ratingFilter === rating.toString()}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">trở lên</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tình trạng</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      value="all"
                      checked={stockFilter === 'all'}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Tất cả</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      value="in_stock"
                      checked={stockFilter === 'in_stock'}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Còn hàng</span>
                  </label>
                  <label className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      value="out_of_stock"
                      checked={stockFilter === 'out_of_stock'}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">Hết hàng</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md animate-pulse">
                    <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {totalProducts} sản phẩm
                      {searchTerm && <span className="text-gray-600"> cho "{searchTerm}"</span>}
                    </p>
                    {selectedCategory && (
                      <p className="text-sm text-gray-600">
                        trong danh mục: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Items per page */}
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={12}>12 / trang</option>
                      <option value={24}>24 / trang</option>
                      <option value={48}>48 / trang</option>
                    </select>

                    {/* Sort */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="popular">Phổ biến nhất</option>
                        <option value="price">Giá thấp đến cao</option>
                        <option value="price_desc">Giá cao đến thấp</option>
                        <option value="rating">Đánh giá cao nhất</option>
                        <option value="name">Tên A-Z</option>
                        <option value="name_desc">Tên Z-A</option>
                      </select>
                      <ChevronDownIcon className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="hidden sm:flex border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <Squares2X2Icon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <ListBulletIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products */}
                {products.length > 0 ? (
                  <>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6 mb-8">
                        {products.map((product) => (
                          <ProductListItem key={product.id} product={product} />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-gray-400 text-8xl mb-6">🔍</div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Không tìm thấy sản phẩm nào
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc để tìm được sản phẩm phù hợp
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                      Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalProducts)} của {totalProducts} sản phẩm
                    </p>
                    
                    <nav className="flex space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Trước
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let page;
                        if (totalPages <= 5) {
                          page = index + 1;
                        } else if (currentPage <= 3) {
                          page = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + index;
                        } else {
                          page = currentPage - 2 + index;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 py-2 text-gray-500">...</span>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Sau
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;