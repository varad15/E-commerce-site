// src/components/CategoryCarousel.jsx
// Horizontal scrolling carousel for categories - CLICKABLE

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useApi';

export default function CategoryCarousel({ featured = false, title = "Shop by Category" }) {
  const navigate = useNavigate();
  const { categories, loading } = useCategories(featured);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64">
              <div className="skeleton h-40 w-full mb-2"></div>
              <div className="skeleton h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <a href="/products" className="link link-primary text-sm">
          View All Products →
        </a>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          ❮
        </button>

        {/* Categories Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
              className="flex-shrink-0 w-64 cursor-pointer group/card"
            >
              <div className="card bg-base-200 shadow-lg hover:shadow-2xl transition-all">
                <figure className="relative overflow-hidden h-40">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-300"
                  />
                  {category.featured && (
                    <div className="badge badge-secondary absolute top-2 right-2">
                      Featured
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold text-lg opacity-0 group-hover/card:opacity-100 transition-opacity">
                      View Category
                    </span>
                  </div>
                </figure>

                <div className="card-body p-4">
                  <h3 className="card-title text-base font-bold">
                    {category.name}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {category.description}
                  </p>
                  {category.productCount && (
                    <div className="badge badge-outline badge-sm mt-2">
                      {category.productCount} products
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          ❯
        </button>
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {categories.length > 4 && (
          <div className="text-xs text-base-content/50">
            Scroll to see more →
          </div>
        )}
      </div>
    </div>
  );
}