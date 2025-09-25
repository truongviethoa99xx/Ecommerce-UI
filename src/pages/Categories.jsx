import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await productService.getCategories();
      setCategories(categoriesData.data || categoriesData);
    } catch (error) {
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug || category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 flex items-center justify-center">
                  <img src="https://cdn-icons-png.freepik.com/512/8058/8058572.png" alt="shopping" className='w-10 h-10' />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  {category.description || 'Khám phá sản phẩm trong danh mục này'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories; 