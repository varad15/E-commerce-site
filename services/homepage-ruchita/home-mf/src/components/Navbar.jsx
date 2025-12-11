import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';

const Navbar = () => {
  // ==========================================
  // HOOKS & STATE
  // ==========================================
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart, getCartCount, getCartTotal } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Cart calculations
  const cartItemCount = getCartCount();
  const cartSubtotal = getCartTotal();

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    window.location.href = 'http://localhost:3000/login';
  };

  const handleSignupClick = () => {
    window.location.href = 'http://localhost:3000/register';
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="sticky top-0 z-50">
      {/* ========== MAIN NAVBAR ========== */}
      <div className="navbar bg-base-100 shadow-md">

        {/* === LEFT: BRAND === */}
        <div className="flex-1 p-2">
          <Link
            to="/"
            className="btn btn-ghost text-xl font-bold text-primary hover:scale-105 transition-transform"
          >
            🌿 EcoMart
          </Link>
        </div>

        {/* === CENTER: SEARCH BAR (Desktop) === */}
        <div className="flex-1 hidden md:flex justify-center">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </div>

        {/* === RIGHT: ACTIONS === */}
        <div className="flex-none flex items-center gap-2">

          {/* Cart Icon with Dropdown */}
          <CartDropdown
            cartItemCount={cartItemCount}
            cartSubtotal={cartSubtotal}
            cart={cart}
            navigate={navigate}
          />

          {/* User Profile or Login/Signup */}
          {user ? (
            <UserMenu
              user={user}
              cartItemCount={cartItemCount}
              handleLogout={handleLogout}
            />
          ) : (
            <AuthButtons
              handleLoginClick={handleLoginClick}
              handleSignupClick={handleSignupClick}
            />
          )}
        </div>
      </div>

      {/* ========== MOBILE SEARCH BAR ========== */}
      <div className="md:hidden bg-base-100 px-4 py-2 border-t">
        <MobileSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

// === SEARCH BAR (Desktop) ===
const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <form onSubmit={handleSearch} className="form-control w-full max-w-md">
    <div className="input-group">
      <input
        type="text"
        placeholder="Search eco-friendly products..."
        className="input input-bordered w-full focus:outline-primary"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-square btn-primary hover:btn-primary-focus"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </form>
);

// === MOBILE SEARCH BAR ===
const MobileSearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <form onSubmit={handleSearch} className="form-control">
    <div className="input-group input-group-sm">
      <input
        type="text"
        placeholder="Search products..."
        className="input input-bordered input-sm w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        type="submit"
        className="btn btn-square btn-primary btn-sm"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </form>
);

// === CART DROPDOWN ===
const CartDropdown = ({ cartItemCount, cartSubtotal, cart, navigate }) => (
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      onClick={() => navigate('/cart')}
      aria-label={`Cart with ${cartItemCount} items`}
    >
      <div className="indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
        {cartItemCount > 0 && (
          <span className="badge badge-sm indicator-item badge-primary animate-pulse">
            {cartItemCount}
          </span>
        )}
      </div>
    </div>

    {/* Cart Preview Dropdown */}
    <div
      tabIndex={0}
      className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-72 shadow-xl border border-base-300"
    >
      <div className="card-body">
        {cartItemCount === 0 ? (
          <EmptyCartPreview navigate={navigate} />
        ) : (
          <CartPreview
            cartItemCount={cartItemCount}
            cartSubtotal={cartSubtotal}
            cart={cart}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  </div>
);

// === EMPTY CART PREVIEW ===
const EmptyCartPreview = ({ navigate }) => (
  <div className="text-center py-4">
    <div className="text-4xl mb-2">🛒</div>
    <p className="text-base-content/70 mb-3">Your cart is empty</p>
    <button
      onClick={() => navigate('/products')}
      className="btn btn-sm btn-primary"
    >
      Start Shopping
    </button>
  </div>
);

// === CART PREVIEW (WITH ITEMS) ===
const CartPreview = ({ cartItemCount, cartSubtotal, cart, navigate }) => (
  <>
    <div className="flex justify-between items-center mb-2">
      <span className="text-lg font-bold">
        {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
      </span>
      <span className="text-primary font-semibold">
        ₹{cartSubtotal.toFixed(2)}
      </span>
    </div>

    {/* Cart Items Preview */}
    <div className="max-h-48 overflow-y-auto space-y-2 my-2">
      {cart.items.slice(0, 3).map((item) => (
        <CartItemPreview key={item._id} item={item} />
      ))}
      {cart.items.length > 3 && (
        <div className="text-xs text-center text-base-content/70 py-1">
          +{cart.items.length - 3} more {cart.items.length - 3 === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>

    {/* View Cart Button */}
    <div className="card-actions mt-2">
      <button
        onClick={() => navigate('/cart')}
        className="btn btn-primary btn-block btn-sm"
      >
        View Cart & Checkout
      </button>
    </div>
  </>
);

// === SINGLE CART ITEM PREVIEW ===
const CartItemPreview = ({ item }) => (
  <div className="flex items-center gap-2 text-sm hover:bg-base-200 p-2 rounded transition-colors">
    <img
      src={item.image}
      alt={item.name}
      className="w-10 h-10 object-cover rounded"
      loading="lazy"
    />
    <div className="flex-1 min-w-0">
      <div className="font-semibold truncate">{item.name}</div>
      <div className="text-xs text-base-content/70">
        {item.quantity} × ₹{item.price.toFixed(2)}
      </div>
    </div>
    <div className="font-semibold text-sm">
      ₹{(item.quantity * item.price).toFixed(2)}
    </div>
  </div>
);

// === USER MENU (When Logged In) ===
const UserMenu = ({ user, cartItemCount, handleLogout }) => (
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform"
      aria-label="User menu"
    >
      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
        <img
          alt={user.name}
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff&bold=true`
          }
        />
      </div>
    </div>

    {/* User Dropdown Menu */}
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl border border-base-300"
    >
      {/* User Info Header */}
      <li className="menu-title">
        <span className="flex items-center gap-2">
          <span className="truncate">{user.name}</span>
          {user.role === 'ADMIN' && (
            <span className="badge badge-xs badge-primary">Admin</span>
          )}
        </span>
      </li>

      {/* Menu Items */}
      <li>
        <Link to="/profile" className="justify-between hover:bg-primary hover:text-primary-content">
          Profile
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Link>
      </li>

      <li>
        <Link to="/orders" className="justify-between hover:bg-primary hover:text-primary-content">
          My Orders
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </Link>
      </li>

      <li>
        <Link to="/cart" className="justify-between hover:bg-primary hover:text-primary-content">
          Shopping Cart
          {cartItemCount > 0 && (
            <span className="badge badge-sm badge-primary">{cartItemCount}</span>
          )}
        </Link>
      </li>

      <div className="divider my-1"></div>

      <li>
        <button
          onClick={handleLogout}
          className="text-error hover:bg-error hover:text-error-content"
        >
          Logout
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </li>
    </ul>
  </div>
);

// === AUTH BUTTONS (Login/Signup) ===
const AuthButtons = ({ handleLoginClick, handleSignupClick }) => (
  <div className="flex gap-2">
    <button
      onClick={handleLoginClick}
      className="btn btn-ghost btn-sm hover:btn-primary hover:text-primary-content transition-all"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
      </svg>
      Login
    </button>
    <button
      onClick={handleSignupClick}
      className="btn btn-primary btn-sm hover:scale-105 transition-transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
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
      Sign Up
    </button>
  </div>
);

export default Navbar;