// src/pages/Homepage.jsx
// Interactive homepage with working buttons and navigation

import React from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCarousel from '../components/ProductCarousel';
import ProductsByCategorySection from '../components/ProductsByCategorySection';
import ServiceStrips from '../components/ServiceStrips';
import Footer from '../components/Footer';
import { useFeaturedProducts } from '../hooks/useApi';

export default function Homepage() {
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(10);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      {/* Hero Banner with Shop Now button */}
      <HeroBanner />
      
      {/* Featured Categories - Horizontal scroll */}
      <section className="py-8 px-4">
        <CategoryCarousel featured={true} title="Shop by Category" />
      </section>
      
      {/* Featured Products - Horizontal scroll */}
      <section className="py-8 px-4 bg-base-200">
        <ProductCarousel 
          products={featuredProducts}
          title="Featured Products"
          loading={featuredLoading}
          viewAllLink="/products?featured=true"
        />
      </section>
      
      {/* Products by Category - Multiple carousels */}
      <section className="py-8 px-4">
        <ProductsByCategorySection limit={10} />
        <p className="text-center mt-6">product by category</p>
      </section>
      
      {/* Service Strips */}
      <ServiceStrips />
      
      {/* CTA Section */}
      <section className="bg-primary text-primary-content py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Join the Eco-Friendly Revolution</h2>
          <p className="text-xl mb-6 opacity-90">
            Over 10,000 happy customers trust us for sustainable living
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/products" className="btn btn-secondary btn-lg">
              Browse All Products
            </a>
            <a href="/register" className="btn btn-outline btn-lg">
              Create Account
            </a>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="stat-title">Eco Products</div>
              <div className="stat-value text-primary">100+</div>
              <div className="stat-desc">Certified organic & sustainable</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title">Categories</div>
              <div className="stat-value text-secondary">10+</div>
              <div className="stat-desc">From kitchen to bathroom</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="stat-title">Happy Customers</div>
              <div className="stat-value text-accent">10K+</div>
              <div className="stat-desc">5-star reviews</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-warning">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
              <div className="stat-title">Average Rating</div>
              <div className="stat-value text-warning">4.8★</div>
              <div className="stat-desc">Based on 2,500+ reviews</div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}