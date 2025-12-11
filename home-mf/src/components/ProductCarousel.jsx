// src/components/ProductCarousel.jsx
// Beautiful product carousel - GUEST CART ENABLED (No auth required)

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCarousel = ({ products, title, loading, viewAllLink }) => {
  const navigate = useNavigate();

  const handleAddToCart = async (product) => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('guestCart') || '{"items":[]}');
    
    // Check if product already in cart
    const existingItem = cart.items.find(item => item.productId === product._id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    // Save to localStorage
    localStorage.setItem('guestCart', JSON.stringify(cart));
    
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert(`✅ ${product.name} added to cart!`);
  };

  const handleProductClick = (slug) => {
    navigate(`/products/${slug}`);
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-xl">
                <div className="skeleton h-48 w-full"></div>
                <div className="card-body">
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className="btn btn-ghost btn-sm">
              View All →
            </a>
          )}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll Container */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-[180px] md:w-[220px] snap-start"
              >
                <div className="card bg-base-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                  {/* Product Image */}
                  <figure 
                    className="px-3 pt-3 relative cursor-pointer"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="rounded-lg h-40 md:h-48 w-full object-cover"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-5 right-5 flex flex-col gap-1">
                      {product.discount > 0 && (
                        <div className="badge badge-secondary badge-sm">
                          -{product.discount}%
                        </div>
                      )}
                      {product.featured && (
                        <div className="badge badge-accent badge-sm">
                          Featured
                        </div>
                      )}
                    </div>

                    {!product.inStock && (
                      <div className="absolute top-5 left-5">
                        <div className="badge badge-error badge-sm">
                          Out of Stock
                        </div>
                      </div>
                    )}
                  </figure>

                  <div className="card-body p-3">
                    {/* Product Name */}
                    <h3 
                      className="text-sm font-semibold line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-primary"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-xs ${i < Math.round(product.rating) ? 'text-warning' : 'text-base-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-base-content/60">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">
                        ₹{product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs line-through text-base-content/50">
                          ₹{product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Stock Warning */}
                    {product.inStock && product.stockQuantity < 10 && (
                      <div className="text-xs text-warning mt-1">
                        Only {product.stockQuantity} left!
                      </div>
                    )}

                    {/* Actions */}
                    <div className="card-actions mt-3 gap-1">
                      <button
                        onClick={() => handleProductClick(product.slug)}
                        className="btn btn-ghost btn-xs flex-1"
                      >
                        View
                      </button>
                      <button
                        className={`btn btn-primary btn-xs flex-1 ${!product.inStock ? 'btn-disabled' : ''}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add' : 'Out'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicators (Desktop) */}
          <div className="hidden md:flex justify-center gap-2 mt-4">
            {[...Array(Math.ceil(products.length / 5))].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-base-content/20"
              ></div>
            ))}
          </div>
        </div>

        {/* Mobile: Show Total Count */}
        <div className="md:hidden text-center mt-4 text-sm text-base-content/60">
          Showing {products.length} products
        </div>
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarousel;
