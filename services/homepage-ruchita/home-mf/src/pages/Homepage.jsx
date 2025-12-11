import React, { useEffect, useState } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <Navbar />
      
      {/* ========== HERO BANNER ========== */}
      <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <HeroBanner />
      </div>
      
      {/* ========== FEATURED CATEGORIES ========== */}
      <section className={`py-12 px-4 transition-all duration-1000 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Shop by Category"
            subtitle="Discover our sustainable product collections"
            icon="🌿"
          />
          <CategoryCarousel featured={true} />
        </div>
      </section>
      
      {/* ========== FEATURED PRODUCTS ========== */}
      <section className={`py-12 px-4 bg-base-200 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Featured Products"
            subtitle="Handpicked eco-friendly favorites"
            icon="⭐"
          />
          <ProductCarousel 
            products={featuredProducts}
            loading={featuredLoading}
            viewAllLink="/products?featured=true"
          />
        </div>
      </section>
      
      {/* ========== PRODUCTS BY CATEGORY ========== */}
      <section className={`py-12 px-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            title="Explore by Category"
            subtitle="Curated collections for every need"
            icon="🛍️"
          />
          <ProductsByCategorySection limit={10} />
        </div>
      </section>
      
      {/* ========== SERVICE STRIPS ========== */}
      <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <ServiceStrips />
      </div>
      
      {/* ========== CTA SECTION ========== */}
      <CTASection />
      
      {/* ========== STATS SECTION ========== */}
      <StatsSection isVisible={isVisible} />
      
      {/* ========== TESTIMONIALS ========== */}
      <TestimonialsSection />
      
      <Footer />
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

// === SECTION HEADER ===
const SectionHeader = ({ title, subtitle, icon }) => (
  <div className="text-center mb-8 space-y-2">
    {icon && <div className="text-5xl animate-bounce">{icon}</div>}
    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      {title}
    </h2>
    {subtitle && (
      <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
  </div>
);

// === CTA SECTION ===
const CTASection = () => (
  <section className="relative bg-gradient-to-r from-primary via-secondary to-accent text-white py-20 px-4 overflow-hidden">
    {/* Animated Background Shapes */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div className="max-w-4xl mx-auto text-center relative z-10">
      {/* Icon */}
      <div className="inline-block mb-6">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-5xl font-bold mb-4 animate-fade-in">
        Join the Eco-Friendly Revolution
      </h2>
      
      {/* Subtitle */}
      <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
        Over <span className="font-bold text-2xl">10,000+</span> happy customers trust us for sustainable living
      </p>

      {/* Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <a 
          href="/products" 
          className="btn btn-lg bg-white text-primary hover:bg-base-100 border-none hover:scale-105 transition-transform shadow-xl group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 group-hover:animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          Browse All Products
        </a>
        
        <a 
          href="http://localhost:3000/register" 
          className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary hover:scale-105 transition-transform shadow-xl group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2 group-hover:animate-spin" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
            />
          </svg>
          Create Account
        </a>
      </div>

      {/* Trust Badges */}
      <div className="flex justify-center gap-6 mt-12 flex-wrap">
        <TrustBadge icon="🔒" text="Secure Checkout" />
        <TrustBadge icon="🚚" text="Fast Delivery" />
        <TrustBadge icon="♻️" text="Eco-Friendly" />
        <TrustBadge icon="⭐" text="4.8 Rating" />
      </div>
    </div>
  </section>
);

// === TRUST BADGE ===
const TrustBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all">
    <span className="text-2xl">{icon}</span>
    <span className="font-semibold text-sm">{text}</span>
  </div>
);

// === STATS SECTION ===
const StatsSection = ({ isVisible }) => (
  <section className={`py-16 px-4 bg-base-200 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
    <div className="max-w-7xl mx-auto">
      <SectionHeader 
        title="Our Impact"
        subtitle="Making a difference, one product at a time"
        icon="🌍"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-10 h-10 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          }
          value="100+"
          label="Eco Products"
          description="Certified organic & sustainable"
          color="text-primary"
          delay="delay-100"
        />
        
        <StatCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-10 h-10 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          }
          value="10+"
          label="Categories"
          description="From kitchen to bathroom"
          color="text-secondary"
          delay="delay-200"
        />
        
        <StatCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-10 h-10 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          }
          value="10K+"
          label="Happy Customers"
          description="5-star reviews"
          color="text-accent"
          delay="delay-300"
        />
        
        <StatCard 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-10 h-10 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
          }
          value="4.8★"
          label="Average Rating"
          description="Based on 2,500+ reviews"
          color="text-warning"
          delay="delay-500"
        />
      </div>
    </div>
  </section>
);

// === STAT CARD ===
const StatCard = ({ icon, value, label, description, color, delay }) => (
  <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${delay} animate-fade-in-up group`}>
    <div className="card-body items-center text-center">
      <div className={`${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className={`text-5xl font-bold ${color} group-hover:scale-110 transition-transform`}>
        {value}
      </h3>
      <p className="text-xl font-semibold">{label}</p>
      <p className="text-sm text-base-content/70">{description}</p>
      
      {/* Progress Bar Animation */}
      <div className="w-full bg-base-300 h-1 rounded-full overflow-hidden mt-4">
        <div className={`h-full ${color.replace('text', 'bg')} animate-progress`}></div>
      </div>
    </div>
  </div>
);

// === TESTIMONIALS SECTION ===
const TestimonialsSection = () => (
  <section className="py-16 px-4 bg-base-100">
    <div className="max-w-7xl mx-auto">
      <SectionHeader 
        title="What Our Customers Say"
        subtitle="Real stories from real people"
        icon="💬"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TestimonialCard 
          quote="Absolutely love the quality! These products are truly eco-friendly and make me feel good about my purchases."
          author="Priya Sharma"
          role="Eco Enthusiast"
          rating={5}
          delay="delay-100"
        />
        
        <TestimonialCard 
          quote="Fast delivery and excellent customer service. The bamboo toothbrushes are a game-changer for my family!"
          author="Rahul Verma"
          role="Happy Customer"
          rating={5}
          delay="delay-300"
        />
        
        <TestimonialCard 
          quote="Finally found a store that aligns with my values. Every product is thoughtfully curated and sustainable."
          author="Anjali Patel"
          role="Sustainability Advocate"
          rating={5}
          delay="delay-500"
        />
      </div>
    </div>
  </section>
);

// === TESTIMONIAL CARD ===
const TestimonialCard = ({ quote, author, role, rating, delay }) => (
  <div className={`card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${delay} animate-fade-in-up`}>
    <div className="card-body">
      {/* Quote Icon */}
      <div className="text-5xl text-primary opacity-20 mb-2">"</div>
      
      {/* Quote */}
      <p className="text-base-content/80 italic mb-4">{quote}</p>
      
      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <svg 
            key={i}
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-warning fill-current animate-pulse" 
            viewBox="0 0 20 20"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-12">
            <span className="text-xl">{author.charAt(0)}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-base-content/70">{role}</p>
        </div>
      </div>
    </div>
  </div>
);