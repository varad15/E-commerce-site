// src/components/HeroBanner.jsx
// Hero banner with working Shop Now button

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroBanner() {
  const navigate = useNavigate();

  return (
    <div
      className="hero min-h-[420px] bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="hero-overlay bg-opacity-40"></div>

      <div className="text-neutral-content text-left px-10 max-w-lg">
        <h1 className="text-5xl font-bold mb-4">Shop Sustainably, Live Responsibly</h1>
        <p className="py-4 text-lg">
          Discover 100+ eco-friendly products for every aspect of your life. 
          From kitchen essentials to personal care, we've got you covered.
        </p>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary btn-lg"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => navigate('/products?featured=true')}
            className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary"
          >
            View Featured
          </button>
        </div>
      </div>
    </div>
  );
}