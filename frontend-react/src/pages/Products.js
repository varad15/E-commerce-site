import React, { useState } from 'react';
import Toast from '../components/Toast';
import './Products.css';

const Products = ({ isAuthenticated }) => {
    const [toast, setToast] = useState(null);
    const [cart, setCart] = useState([]);

    const products = [
        {
            id: 1,
            name: 'Wireless Headphones Pro',
            category: 'Audio',
            price: 299.99,
            description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
            icon: '🎧',
            rating: 4.5
        },
        {
            id: 2,
            name: 'Smart Watch Ultra',
            category: 'Wearables',
            price: 449.99,
            description: 'Advanced fitness tracking with heart rate monitor and GPS',
            icon: '⌚',
            rating: 4.8
        },
        {
            id: 3,
            name: 'Gaming Laptop X',
            category: 'Computers',
            price: 1299.99,
            description: 'High-performance gaming laptop with RTX 4070 graphics',
            icon: '💻',
            rating: 4.7
        },
        {
            id: 4,
            name: 'Drone Pro 4K',
            category: 'Photography',
            price: 799.99,
            description: 'Professional 4K camera drone with 30min flight time',
            icon: '🚁',
            rating: 4.6
        },
        {
            id: 5,
            name: 'Smart Speaker Mini',
            category: 'Home',
            price: 99.99,
            description: 'Voice-controlled smart speaker with Alexa integration',
            icon: '🔊',
            rating: 4.3
        },
        {
            id: 6,
            name: 'Tablet Pro 12"',
            category: 'Tablets',
            price: 899.99,
            description: 'Professional tablet with stylus and keyboard support',
            icon: '📱',
            rating: 4.9
        }
    ];

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const addToCart = (product) => {
        if (!isAuthenticated) {
            showToast('Please login to add items to cart', 'error');
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);
        let newCart;

        if (existingItem) {
            newCart = cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cart, { ...product, quantity: 1 }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        showToast('Item added to cart!', 'success');
    };

    return (
        <div className="products-container">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="products-header">
                <h1><i className="fas fa-shopping-bag"></i> Our Products</h1>
                <p>Discover the latest tech gadgets and electronics</p>
            </div>

            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-badge">{product.category}</div>
                        <div className="product-icon">{product.icon}</div>

                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>

                        <div className="product-rating">
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                                ></i>
                            ))}
                            <span className="rating-value">{product.rating}</span>
                        </div>

                        <div className="product-footer">
                            <div className="product-price">${product.price}</div>
                            <button
                                className="btn-add-cart"
                                onClick={() => addToCart(product)}
                            >
                                <i className="fas fa-cart-plus"></i>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;