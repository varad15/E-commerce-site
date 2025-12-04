// src/pages/CategoryPage.jsx
// Category page showing all products in a specific category

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProductsByCategory, useCategories } from '../hooks/useApi';

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProductsByCategory(slug);
  const { categories } = useCategories();
  
  const [sortBy, setSortBy] = useState('featured');

  // Find current category
  const currentCategory = categories.find(cat => cat.slug === slug);

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [products, sortBy]);

  const handleProductClick = (productSlug) => {
    navigate(`/products/${productSlug}`);
  };

  const handleCategoryChange = (categorySlug) => {
    navigate(`/category/${categorySlug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>Error loading category: {error}</span>
          </div>
          <button onClick={() => navigate('/products')} className="btn btn-primary mt-4">
            View All Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li><a href="/" className="link link-hover">Home</a></li>
            <li><a href="/products" className="link link-hover">Products</a></li>
            <li className="font-semibold">{currentCategory?.name || 'Category'}</li>
          </ul>
        </div>

        {/* Category Header */}
        {loading ? (
          <div className="mb-8">
            <div className="skeleton h-12 w-64 mb-2"></div>
            <div className="skeleton h-6 w-96"></div>
          </div>
        ) : (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {currentCategory?.name || 'Category'}
            </h1>
            <p className="text-base-content/70 text-lg">
              {currentCategory?.description || 'Browse our eco-friendly products'}
            </p>
          </div>
        )}

        {/* Category Stats */}
        {!loading && (
          <div className="stats shadow mb-8 w-full lg:w-auto">
            <div className="stat">
              <div className="stat-title">Total Products</div>
              <div className="stat-value text-primary">{products.length}</div>
              <div className="stat-desc">In this category</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Price Range</div>
              <div className="stat-value text-secondary text-2xl">
                ₹{Math.min(...products.map(p => p.price)).toFixed(0)} - 
                ₹{Math.max(...products.map(p => p.price)).toFixed(0)}
              </div>
              <div className="stat-desc">Affordable options</div>
            </div>

            <div className="stat">
              <div className="stat-title">Average Rating</div>
              <div className="stat-value text-accent text-2xl">
                {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)} ⭐
              </div>
              <div className="stat-desc">Based on reviews</div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-lg sticky top-20">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Categories</h2>

                <ul className="menu p-0">
                  <li>
                    <a 
                      href="/products"
                      className={!slug ? 'active' : ''}
                    >
                      All Products
                    </a>
                  </li>
                  {categories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleCategoryChange(category.slug)}
                        className={category.slug === slug ? 'active' : ''}
                      >
                        {category.name}
                        {category.productCount && (
                          <span className="badge badge-sm">{category.productCount}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="divider my-2"></div>

                {/* Sort By */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Sort By</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card bg-base-200 shadow-lg">
                    <div className="skeleton h-56 w-full"></div>
                    <div className="card-body">
                      <div className="skeleton h-4 w-3/4 mb-2"></div>
                      <div className="skeleton h-4 w-1/2 mb-4"></div>
                      <div className="skeleton h-10 w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {!loading && sortedProducts.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-base-content/70">
                    Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product.slug)}
                      className="card bg-base-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <figure className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.featured && (
                          <div className="badge badge-secondary absolute top-2 right-2">
                            Featured
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div className="badge badge-error absolute top-2 left-2">
                            -{product.discount}%
                          </div>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="badge badge-error badge-lg">Out of Stock</span>
                          </div>
                        )}
                      </figure>

                      <div className="card-body p-4">
                        <h3 className="card-title text-base line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="rating rating-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <input
                                key={star}
                                type="radio"
                                className="mask mask-star-2 bg-orange-400"
                                checked={star === Math.round(product.rating)}
                                readOnly
                              />
                            ))}
                          </div>
                          <span className="text-xs text-base-content/70">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-primary">
                            ₹{product.price}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm line-through opacity-50">
                              ₹{product.compareAtPrice}
                            </span>
                          )}
                        </div>

                        {/* Stock Badge */}
                        {product.inStock ? (
                          <div className="badge badge-success badge-sm">In Stock</div>
                        ) : (
                          <div className="badge badge-error badge-sm">Out of Stock</div>
                        )}

                        {/* Quick View Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product.slug);
                          }}
                          className="btn btn-primary btn-sm w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Quick View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-base-content/70 mb-4">
                  This category doesn't have any products yet.
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="btn btn-primary"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Categories */}
        {!loading && categories.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Explore Other Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories
                .filter(cat => cat.slug !== slug)
                .slice(0, 4)
                .map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className="card bg-base-200 shadow hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <figure className="h-32">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="font-bold text-sm">{category.name}</h3>
                      <p className="text-xs text-base-content/70 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}