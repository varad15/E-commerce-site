// src/pages/ProductDetail.jsx
// Product details page with guest cart support

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProduct } from '../hooks/useApi';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { product, loading, error } = useProduct(slug);
  const { addToCart } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    
    try {
      // Add to cart using context
      addToCart(product, quantity);
      
      // Show success message
      const toast = document.createElement('div');
      toast.className = 'toast toast-top toast-end';
      toast.innerHTML = `
        <div class="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>${quantity} x ${product.name} added to cart!</span>
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      // Reset quantity
      setQuantity(1);
    } catch (err) {
      alert('❌ Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      // Show alert to sign in
      if (window.confirm('Please sign in to complete your purchase. Would you like to go to the login page?')) {
        // Save intended destination
        navigate('/login', { state: { from: `/products/${slug}`, buyNow: true } });
      }
      return;
    }
    
    // Add to cart first
    addToCart(product, quantity);
    // Navigate to checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="alert alert-error">
            <span>Product not found</span>
          </div>
          <button onClick={() => navigate('/products')} className="btn btn-primary mt-4">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const currentImage = images[selectedImage] || product.image;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-4">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href={`/category/${product.category?.slug}`}>{product.categoryName}</a></li>
            <li>{product.name}</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="card bg-base-200 shadow-xl mb-4">
              <figure className="px-4 pt-4">
                <img 
                  src={currentImage} 
                  alt={product.name}
                  className="rounded-xl object-cover w-full h-96"
                />
              </figure>
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="rating rating-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    className="mask mask-star-2 bg-orange-400"
                    checked={star === Math.round(product.rating || 4)}
                    readOnly
                  />
                ))}
              </div>
              <span className="text-sm">
                {product.rating || 4} ({product.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.featured && (
                <div className="badge badge-secondary">Featured</div>
              )}
              {product.discount > 0 && (
                <div className="badge badge-error">-{product.discount}%</div>
              )}
              {!product.inStock && (
                <div className="badge badge-ghost">Out of Stock</div>
              )}
              {product.tags?.map((tag, idx) => (
                <div key={idx} className="badge badge-outline">{tag}</div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl line-through opacity-50">
                    ₹{product.compareAtPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>In Stock ({product.stockQuantity} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Out of Stock</span>
                </div>
              )}
              {product.inStock && product.stockQuantity < 20 && (
                <div className="text-warning text-sm mt-1">
                  Only {product.stockQuantity} left!
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">Quantity</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-sm btn-circle"
                  disabled={!product.inStock}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, parseInt(e.target.value) || 1)))}
                  className="input input-bordered w-20 text-center"
                  disabled={!product.inStock}
                  min="1"
                  max={product.stockQuantity}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="btn btn-sm btn-circle"
                  disabled={!product.inStock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || addingToCart}
                className="btn btn-primary flex-1"
              >
                {addingToCart ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="btn btn-secondary flex-1"
              >
                Buy Now
              </button>
            </div>

            {/* Info: No auth required for cart */}
            {!user && (
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">No login required to add items. Sign in at checkout to complete purchase.</span>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-base-content/70">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="card bg-base-200 p-4">
                <h2 className="text-xl font-bold mb-2">Specifications</h2>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-semibold capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-base-content/70">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}