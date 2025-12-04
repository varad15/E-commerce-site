import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ message, type });
    };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (email === 'admin@techstore.com' && password === 'admin123') {
          console.log('✅ Hardcoded admin login successful');

          // Set everything manually
          localStorage.setItem('token', 'fake-admin-token-12345');
          localStorage.setItem('email', 'admin@techstore.com');
          localStorage.setItem('role', 'ADMIN');

          // Dispatch custom event to notify App.js
          window.dispatchEvent(new Event('localStorageChanged'));

          showToast('Welcome Admin!', 'success');

          setTimeout(() => {
              window.location.href = '/admin'; // Force reload navigation
          }, 500);

          return;
      }

      showToast('Invalid credentials', 'error');
      setLoading(false);
  };

    return (
        <div className="auth-container">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Sign up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;