import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import CheckoutPopup from "../components/CheckoutPopup";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart, getCartTotal } = useCartContext();

  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const BACKEND_URL = "http://localhost:8082/api";

  // Animate on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sync cart items
  useEffect(() => {
    if (cart?.items?.length) {
      setCartItems(cart.items);
    } else {
      setCartItems([]);
    }
  }, [cart]);

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg text-base-content/70">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // CALCULATIONS
  // ==========================================
  const items = cartItems || [];
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;
  const savings = items.reduce((sum, item) => {
    const comparePrice = item.compareAtPrice || item.price * 1.2;
    return sum + (comparePrice - item.price) * item.quantity;
  }, 0);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    setRemovingItem(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setRemovingItem(null);
    }, 300);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear all items from your cart?")) {
      clearCart();
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      if (window.confirm("Please sign in to complete your purchase. Go to login page?")) {
        navigate("/login", { state: { from: "/cart" } });
      }
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setShowModal(true);
  };

  // ==========================================
  // CHECKOUT LOGIC
  // ==========================================
  const handleCheckout = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      console.log("🛒 Starting checkout...");

      // Validate cart
      if (!cartItems || cartItems.length === 0) {
        alert("Cart is empty. Cannot proceed.");
        setProcessing(false);
        return;
      }

      // Update stock for each item
      for (const item of cartItems) {
        if (!item._id) {
          console.error("❌ Missing _id for product:", item);
          continue;
        }

        const updatedStockQuantity = (item.stockQuantity || 0) - item.quantity;

        if (updatedStockQuantity < 0) {
          console.warn(`⚠️ Product "${item.name}" would go negative. Skipping stock update.`);
          continue;
        }

        const productId = item.productId || item._id.split("-")[0];
        
        try {
          await axios.patch(`${BACKEND_URL}/products/${productId}/stock`, {
            stockQuantity: updatedStockQuantity,
          });
          console.log(`✅ Stock updated for ${item.name}`);
        } catch (stockError) {
          console.error(`❌ Stock update failed for ${item.name}:`, stockError.message);
          // Continue even if stock update fails
        }
      }

      // Send order confirmation email
      const emailPayload = {
        to: user?.email || "varad.jumbad22@vit.edu",
        customerName: user?.name || "Valued Customer",
        orderId: Date.now(),
        totalAmount: total,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("📧 Sending order email...");

      try {
        await axios.post(`${BACKEND_URL}/email/send-order-email`, emailPayload);
        console.log("✅ Order confirmation email sent!");
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError.message);
        // Don't stop checkout if email fails
      }

      // Clear cart
      clearCart();
      setCartItems([]);
      setShowModal(false);
      setProcessing(false);

      // Show success message
      alert("✅ Order placed successfully! Check your email for confirmation.");
      navigate("/products");

    } catch (error) {
      console.error("❌ Checkout failed:", error.message || error);

      // Better error message
      let errorMessage = "❌ Checkout failed. ";
      if (error.response) {
        errorMessage += error.response.data?.message || error.response.statusText || "Server error.";
      } else if (error.request) {
        errorMessage += "No response from server. Please check your connection.";
      } else {
        errorMessage += error.message || "Please try again.";
      }

      alert(errorMessage);
      setProcessing(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* ========== HEADER ========== */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-base-content/70 mt-2">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            )}
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-4"></div>
        </div>

        {/* ========== EMPTY CART ========== */}
        {items.length === 0 ? (
          <EmptyCartState navigate={navigate} isVisible={isVisible} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ========== CART ITEMS ========== */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <CartItem
                  key={item._id}
                  item={item}
                  index={index}
                  isVisible={isVisible}
                  isRemoving={removingItem === item._id}
                  handleUpdateQuantity={handleUpdateQuantity}
                  handleRemoveItem={handleRemoveItem}
                />
              ))}
            </div>

            {/* ========== ORDER SUMMARY ========== */}
            <OrderSummary
              isVisible={isVisible}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              savings={savings}
              itemCount={items.length}
              user={user}
              handleProceedToCheckout={handleProceedToCheckout}
              navigate={navigate}
            />
          </div>
        )}
      </div>

      {/* ========== CHECKOUT POPUP ========== */}
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={total}
        handleCheckout={handleCheckout}
        processing={processing}
      />

      <Footer />
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

// === EMPTY CART STATE ===
const EmptyCartState = ({ navigate, isVisible }) => (
  <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
    <div className="card bg-base-100 shadow-2xl border border-base-300">
      <div className="card-body items-center text-center py-16">
        {/* Animated Cart Icon */}
        <div className="mb-6 relative">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary" 
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
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-base-content/70 mb-8 max-w-md">
          Looks like you haven't added any eco-friendly products yet. Start shopping to fill your cart!
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/products")}
            className="btn btn-primary btn-lg hover:scale-105 transition-transform gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Products
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline btn-lg hover:scale-105 transition-transform"
          >
            Back to Home
          </button>
        </div>

        {/* Featured Categories */}
        <div className="mt-12 w-full max-w-2xl">
          <p className="text-sm text-base-content/60 mb-4">Popular Categories</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {['Kitchen', 'Bathroom', 'Personal Care', 'Home & Living'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/products?category=${cat.toLowerCase().replace(' ', '-')}`)}
                className="badge badge-lg badge-outline hover:badge-primary transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// === CART ITEM ===
const CartItem = ({ item, index, isVisible, isRemoving, handleUpdateQuantity, handleRemoveItem }) => (
  <div 
    className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
    } ${isRemoving ? 'opacity-0 scale-95' : ''}`}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div className="card-body p-4 md:p-6">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative group">
          <img
            src={item.image}
            alt={item.name}
            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
          />
          {item.featured && (
            <div className="absolute top-2 left-2 badge badge-primary badge-sm">Featured</div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg md:text-xl truncate">{item.name}</h3>
              <p className="text-sm text-base-content/70">{item.categoryName}</p>
              {item.stockQuantity < 10 && (
                <p className="text-xs text-warning mt-1">Only {item.stockQuantity} left in stock!</p>
              )}
            </div>
            <button
              onClick={() => handleRemoveItem(item._id)}
              className="btn btn-sm btn-ghost btn-circle hover:btn-error hover:scale-110 transition-all"
              aria-label="Remove item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quantity and Price */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-base-content/70">Quantity:</span>
              <div className="join">
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                  className="btn btn-sm join-item hover:btn-primary"
                  disabled={item.quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                  </svg>
                </button>
                <button className="btn btn-sm join-item no-animation font-bold min-w-[3rem]">
                  {item.quantity}
                </button>
                <button
                  onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                  className="btn btn-sm join-item hover:btn-primary"
                  disabled={item.quantity >= (item.stockQuantity || 999)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-xl md:text-2xl font-bold text-primary">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
              <div className="text-xs text-base-content/60">
                ₹{item.price.toFixed(2)} × {item.quantity}
              </div>
              {item.compareAtPrice && item.compareAtPrice > item.price && (
                <div className="text-xs text-success mt-1">
                  Save ₹{((item.compareAtPrice - item.price) * item.quantity).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// === ORDER SUMMARY ===
const OrderSummary = ({ 
  isVisible, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  savings,
  itemCount,
  user, 
  handleProceedToCheckout, 
  navigate 
}) => (
  <div className="lg:col-span-1">
    <div className={`card bg-base-100 shadow-2xl sticky top-4 border border-base-300 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="card-body">
        {/* Header */}
        <h2 className="card-title text-2xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Order Summary
        </h2>
        
        <div className="divider my-2"></div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <PriceRow label="Subtotal" value={subtotal} />
          <PriceRow 
            label="Shipping" 
            value={shipping} 
            isFree={shipping === 0}
            subtext={shipping === 0 ? "Free shipping on orders over ₹50" : null}
          />
          <PriceRow label="Tax (GST 18%)" value={tax} />
          
          {savings > 0 && (
            <div className="flex justify-between text-success">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Savings
              </span>
              <span className="font-semibold">-₹{savings.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="divider my-2"></div>

        {/* Total */}
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span className="text-primary text-2xl">₹{total.toFixed(2)}</span>
        </div>

        {/* Progress to Free Shipping */}
        {shipping > 0 && subtotal < 50 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Free shipping progress</span>
              <span>₹{(50 - subtotal).toFixed(2)} to go</span>
            </div>
            <progress 
              className="progress progress-primary w-full" 
              value={subtotal} 
              max="50"
            ></progress>
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleProceedToCheckout}
          className="btn btn-primary btn-block btn-lg hover:scale-105 transition-all gap-2 group"
        >
          {user ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Checkout
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In to Checkout
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/products")}
          className="btn btn-outline btn-block hover:scale-105 transition-all gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </button>

        {/* Trust Badges */}
        <div className="mt-6 space-y-2">
          <TrustBadge icon="🔒" text="Secure payment" />
          <TrustBadge icon="🚚" text="Free returns within 30 days" />
          <TrustBadge icon="📧" text="Order confirmation via email" />
        </div>
      </div>
    </div>
  </div>
);

// === PRICE ROW ===
const PriceRow = ({ label, value, isFree, subtext }) => (
  <div>
    <div className="flex justify-between">
      <span className="text-base-content/70">{label}</span>
      <span className="font-semibold">
        {isFree ? (
          <span className="text-success flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            FREE
          </span>
        ) : (
          `₹${value.toFixed(2)}`
        )}
      </span>
    </div>
    {subtext && <p className="text-xs text-success mt-1">{subtext}</p>}
  </div>
);

// === TRUST BADGE ===
const TrustBadge = ({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-base-content/70">
    <span className="text-lg">{icon}</span>
    <span>{text}</span>
  </div>
);