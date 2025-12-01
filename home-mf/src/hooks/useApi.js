// src/hooks/useApi.js
// COMPLETE VERSION with SMART useProductsByCategory

import { useState, useEffect } from 'react';
import api from '../services/api';

// Hook for fetching products with filters
export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        if (filters.search && filters.search.trim()) {
          const response = await api.get(`/products/search?q=${encodeURIComponent(filters.search)}`);
          setProducts(response.data.results || []);
          setError(null);
          return;
        }

        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.featured) params.append('featured', 'true');
        
        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.products || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
};

// Hook for fetching single product by slug
export const useProduct = (slug) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/slug/${slug}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  return { product, loading, error };
};

// Hook for fetching featured products
export const useFeaturedProducts = (limit = 10) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/featured?limit=${limit}`);
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading, error };
};

// Hook for fetching categories
export const useCategories = (featured = false) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const url = featured ? '/categories?featured=true' : '/categories';
        const response = await api.get(url);
        setCategories(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [featured]);

  return { categories, loading, error };
};

// Hook for fetching single category
export const useCategory = (categoryId) => {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/categories/${categoryId}`);
        setCategory(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err.message);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  return { category, loading, error };
};

// Hook for fetching products by category ID
export const useCategoryProducts = (categoryId, limit, page = 1) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit);
        if (page) params.append('page', page);
        
        const response = await api.get(`/categories/${categoryId}/products?${params.toString()}`);
        setProducts(response.data.products || []);
        setCategory(response.data.category || null);
        setPagination(response.data.pagination || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, limit, page]);

  return { products, category, pagination, loading, error };
};

// SMART Hook for fetching products by category SLUG
// This is the KEY fix - it converts slug to ID automatically
export const useProductsByCategory = (categorySlug) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!categorySlug) {
      console.warn('⚠️ No category slug provided to useProductsByCategory');
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('═══════════════════════════════════════════');
        console.log('🔍 [STEP 1] Starting product fetch for category slug:', categorySlug);
        
        // Step 1: Get all categories
        console.log('📡 [STEP 2] Fetching all categories...');
        const categoriesResponse = await api.get('/categories');
        const categories = categoriesResponse.data || [];
        console.log('✅ [STEP 2] Received', categories.length, 'categories');
        
        // Step 2: Find category by slug
        console.log('🔎 [STEP 3] Looking for category with slug:', categorySlug);
        const foundCategory = categories.find(cat => cat.slug === categorySlug);
        
        if (!foundCategory) {
          console.error('❌ [STEP 3] Category NOT found with slug:', categorySlug);
          console.log('📋 Available category slugs:', categories.map(c => `"${c.slug}"`).join(', '));
          setError(`Category "${categorySlug}" not found`);
          setProducts([]);
          setLoading(false);
          return;
        }
        
        console.log('✅ [STEP 3] Found category!');
        console.log('   Name:', foundCategory.name);
        console.log('   ID:', foundCategory._id);
        console.log('   Slug:', foundCategory.slug);
        setCategory(foundCategory);
        
        // Step 3: Fetch products using category ID
        console.log('📡 [STEP 4] Fetching products for category ID:', foundCategory._id);
        const endpoint = `/categories/${foundCategory._id}/products`;
        console.log('   Endpoint:', endpoint);
        
        const productsResponse = await api.get(endpoint);
        console.log('✅ [STEP 4] Products response received');
        console.log('   Response keys:', Object.keys(productsResponse.data).join(', '));
        
        const productsList = productsResponse.data.products || productsResponse.data || [];
        console.log('📦 [STEP 5] Products extracted:', productsList.length, 'products');
        
        if (productsList.length === 0) {
          console.warn('⚠️ No products found in this category!');
          console.warn('💡 Possible reasons:');
          console.warn('   1. No products assigned to this category yet');
          console.warn('   2. Products exist but category field not set correctly');
          console.warn('   3. Backend endpoint not returning products properly');
          console.warn('');
          console.warn('🔧 To fix:');
          console.warn('   - Check database: Do products have this category ID?');
          console.warn('   - Test backend: GET', `http://localhost:3001/api${endpoint}`);
          console.warn('   - Run seed script to populate products');
        } else {
          console.log('✅ Sample product:');
          console.log('   Name:', productsList[0].name);
          console.log('   ID:', productsList[0]._id);
          console.log('   Has category field:', !!productsList[0].category);
        }
        
        setProducts(productsList);
        setError(null);
        console.log('✅ [STEP 6] Products set in state successfully');
        console.log('═══════════════════════════════════════════');
        
      } catch (err) {
        console.error('═══════════════════════════════════════════');
        console.error('❌ [ERROR] Failed to fetch products');
        console.error('   Category slug:', categorySlug);
        console.error('   Error type:', err.name);
        console.error('   Error message:', err.message);
        if (err.response) {
          console.error('   HTTP status:', err.response.status);
          console.error('   Response data:', err.response.data);
        }
        console.error('═══════════════════════════════════════════');
        
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  return { products, category, loading, error };
};

// Hook for cart operations (simplified for guest cart)
export const useCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.cart || { items: [] });
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/add', { productId, quantity });
      setCart(response.data.cart);
      return response.data.cart;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, { quantity });
      setCart(response.data.cart);
      return response.data.cart;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      setCart(response.data.cart);
      return response.data.cart;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to clear cart');
    }
  };

  return { cart, loading, fetchCart, addToCart, updateQuantity, removeItem, clearCart };
};
