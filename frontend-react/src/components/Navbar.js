import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, isAdmin, user, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <i className="fas fa-bolt"></i>
                    <span>TechStore</span>
                </Link>

                <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link to="/products" className="navbar-link" onClick={() => setMenuOpen(false)}>
                        <i className="fas fa-shopping-bag"></i> Products
                    </Link>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <Link to="/admin" className="navbar-link admin-btn" onClick={() => setMenuOpen(false)}>
                                    <i className="fas fa-shield-halved"></i> Admin Panel
                                </Link>
                            )}
                            <div className="navbar-user">
                                <i className="fas fa-user-circle"></i>
                                <span>{user?.name || user?.email?.split('@')[0]}</span>
                            </div>
                            <button onClick={handleLogout} className="navbar-logout">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="navbar-login" onClick={() => setMenuOpen(false)}>
                            <i className="fas fa-sign-in-alt"></i> Sign In
                        </Link>
                    )}
                </div>

                <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;