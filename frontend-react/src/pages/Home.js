import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ isAuthenticated }) => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="gradient-text">TechStore</span>
                    </h1>
                    <p className="hero-subtitle">
                        Discover the latest tech gadgets and electronics at unbeatable prices
                    </p>
                    {!isAuthenticated && (
                        <div className="hero-buttons">
                            <Link to="/register" className="btn-hero primary">
                                <i className="fas fa-rocket"></i> Get Started
                            </Link>
                            <Link to="/products" className="btn-hero secondary">
                                <i className="fas fa-shopping-bag"></i> Browse Products
                            </Link>
                        </div>
                    )}
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-shipping-fast"></i>
                        </div>
                        <h3>Fast Delivery</h3>
                        <p>Get your products delivered within 24-48 hours nationwide</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3>Secure Payment</h3>
                        <p>100% secure transactions with encrypted checkout process</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <i className="fas fa-headset"></i>
                        </div>
                        <h3>24/7 Support</h3>
                        <p>Always here to help you with any questions or concerns</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;