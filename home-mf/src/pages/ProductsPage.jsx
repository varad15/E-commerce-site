// src/pages/ProductsPage.jsx
// All products page with filters and search

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProducts, useCategories } from '../hooks/useApi';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'featured',
    featured: searchParams.get('featured') === 'true',
  });

  const { products, loading, error } = useProducts(filters);
  const { categories } = useCategories();

  // Sync filters with URL query params whenever URL changes
  useEffect(() => {
    setFilters({
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'featured',
      featured: searchParams.get('featured') === 'true',
    });
  }, [searchParams]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleProductClick = (slug) => {
    navigate(`/products/${slug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>Error loading products: {error}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {filters.featured ? 'Featured Products' : 'All Products'}
          </h1>
          <p className="text-base-content/70">
            Discover our range of eco-friendly, sustainable products
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-lg sticky top-20">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Filters</h2>

                {/* Category Filter */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Category</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Price Range</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input input-bordered input-sm w-full"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input input-bordered input-sm w-full"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-semibold">Sort By</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Featured Only */}
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Featured only</span>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                    />
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      category: '',
                      search: '',
                      minPrice: '',
                      maxPrice: '',
                      sortBy: 'featured',
                      featured: false,
                    })
                  }
                  className="btn btn-ghost btn-sm w-full mt-4"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-base-content/70">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card bg-base-200 shadow-lg">
                    <div className="skeleton h-48 w-full"></div>
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
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.slug}
                    onClick={() => handleProductClick(product.slug)}
                    className="card bg-base-200 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
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
                    </figure>

                    <div className="card-body p-4">
                      <h3 className="card-title text-base line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-base-content/70 mb-2">{product.categoryName}</p>

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
                        <span className="text-xs text-base-content/70">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        {product.compareAtPrice && (
                          <span className="text-sm line-through opacity-50">₹{product.compareAtPrice}</span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.inStock ? (
                        <div className="badge badge-success badge-sm">In Stock</div>
                      ) : (
                        <div className="badge badge-error badge-sm">Out of Stock</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-16">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 mx-auto text-base-content/20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-base-content/70 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() =>
                    setFilters({
                      category: '',
                      search: '',
                      minPrice: '',
                      maxPrice: '',
                      sortBy: 'featured',
                      featured: false,
                    })
                  }
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
