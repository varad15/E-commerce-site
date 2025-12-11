// src/components/ProductsByCategorySection.jsx
// Display products organized by category with carousels - FIXED

import React, { useState, useEffect } from 'react';
import { useCategories } from '../hooks/useApi';
import api from '../services/api';
import ProductCarousel from './ProductCarousel';

const ProductsByCategorySection = ({ limit = 10, maxCategories = 5 }) => {
  const { categories, loading: categoriesLoading } = useCategories(true);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      if (!categories || categories.length === 0) return;

      try {
        setLoading(true);
        const productsData = {};

        // Fetch products for each category (limit to first 5 categories)
        const categoriesToShow = categories.slice(0, maxCategories);
        
        console.log('📦 Fetching products for categories:', categoriesToShow.map(c => c.name));
        
        for (const category of categoriesToShow) {
          try {
            // FIXED: Direct API call instead of api.categories.getProducts()
            const response = await api.get(`/categories/${category._id}/products?limit=${limit}`);
            
            console.log(`✅ ${category.name}:`, response.data.products?.length || 0, 'products');
            
            if (response.data.products && response.data.products.length > 0) {
              productsData[category._id] = {
                products: response.data.products,
                category: category
              };
            }
          } catch (error) {
            console.error(`❌ Error fetching products for category ${category.name}:`, error);
          }
        }

        console.log('📊 Total category sections with products:', Object.keys(productsData).length);
        setCategoryProducts(productsData);
      } catch (error) {
        console.error('❌ Error fetching products by category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [categories, limit, maxCategories]);

  if (categoriesLoading || loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="skeleton h-8 w-48 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="skeleton h-64"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If no categories have products, show message
  if (Object.keys(categoryProducts).length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base-content/70">No products available by category yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {Object.values(categoryProducts).map((data) => (
        data.products.length > 0 && (
          <ProductCarousel
            key={data.category._id}
            products={data.products}
            title={data.category.name}
            viewAllLink={`/category/${data.category.slug}`}
            loading={false}
          />
        )
      ))}
    </div>
  );
};

export default ProductsByCategorySection;