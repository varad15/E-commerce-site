// src/components/Navbar.jsx
// Interactive Navbar with real-time cart count from CartContext

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCartContext } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart, getCartCount, getCartTotal } = useCartContext();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate total items and subtotal in cart
  const cartItemCount = getCartCount();
  const cartSubtotal = getCartTotal();

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

  return (
    <div className="sticky top-0 z-50">
      <div className="navbar bg-base-100 shadow-md">
        {/* LEFT - Brand */}
        <div className="flex-1 p-2">
          <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
            🌿 EcoMart
          </Link>
        </div>

        {/* MIDDLE - Search Bar */}
        <div className="flex-1 hidden md:flex justify-center">
          <form onSubmit={handleSearch} className="form-control w-full max-w-md">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search eco-friendly products..."
                className="input input-bordered w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-square btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT - Icons */}
        <div className="flex-none flex items-center gap-2">
          {/* CART ICON */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle hover:bg-base-200"
              onClick={() => navigate('/cart')}
            >
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="badge badge-sm indicator-item badge-primary">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>

            {/* Cart Dropdown Preview */}
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-72 shadow-xl"
            >
              <div className="card-body">
                {cartItemCount === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-base-content/70">Your cart is empty</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="btn btn-sm btn-primary mt-2"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-lg font-bold">
                      {cartItemCount} {cartItemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <span className="text-primary font-semibold">
                      Subtotal: ₹{cartSubtotal.toFixed(2)}
                    </span>
                    
                    {/* Show cart items preview */}
                    <div className="max-h-48 overflow-y-auto space-y-2 my-2">
                      {cart.items.slice(0, 3).map((item) => (
                        <div key={item._id} className="flex items-center gap-2 text-sm">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-semibold truncate">{item.name}</div>
                            <div className="text-xs text-base-content/70">
                              {item.quantity} x ₹{item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                      {cart.items.length > 3 && (
                        <div className="text-xs text-center text-base-content/70">
                          +{cart.items.length - 3} more items
                        </div>
                      )}
                    </div>
                    
                    <div className="card-actions">
                      <button
                        onClick={() => navigate('/cart')}
                        className="btn btn-primary btn-block btn-sm"
                      >
                        View Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* USER PROFILE / LOGIN */}
          {user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    alt={user.name}
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`}
                  />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-xl"
              >
                <li className="menu-title">
                  <span>{user.name}</span>
                </li>
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    Orders
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    Cart
                    {cartItemCount > 0 && (
                      <span className="badge badge-sm badge-primary">{cartItemCount}</span>
                    )}
                  </Link>
                </li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-ghost btn-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary btn-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-base-100 px-4 py-2 border-t">
        <form onSubmit={handleSearch} className="form-control">
          <div className="input-group input-group-sm">
            <input
              type="text"
              placeholder="Search products..."
              className="input input-bordered input-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-square btn-primary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Navbar;