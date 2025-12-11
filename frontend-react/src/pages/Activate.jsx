import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Activate() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email ||
                         sessionStorage.getItem('activationEmail') ||
                         '';

  // Clear sessionStorage after reading
  useEffect(() => {
    if (sessionStorage.getItem('activationEmail')) {
      sessionStorage.removeItem('activationEmail');
    }
  }, []);

  const [formData, setFormData] = useState({
    email: emailFromState,
    code: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.code.length !== 6) {
      setError('Activation code must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      console.log('🔵 Activating account...');
      const response = await fetch('http://localhost:8080/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('🔵 Activation response:', data);

      if (response.ok) {
        console.log('✅ Account activated, navigating to login...');
        // Navigate without alert
        navigate('/login', { replace: true });
      } else {
        setError(data.error || 'Activation failed. Please check your code.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Activation error:', err);
      setError('Network error. Please check if the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #1e293b, #6b21a8, #1e293b)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(to right, #a855f7, #ec4899)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '32px' }}>✉️</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Activate Your Account
          </h1>
          <p style={{ color: '#d1d5db' }}>Check your email for the 6-digit code</p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ color: '#fecaca', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              readOnly={!!emailFromState}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                cursor: emailFromState ? 'not-allowed' : 'text'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Activation Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="000000"
              maxLength="6"
              pattern="[0-9]{6}"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '24px',
                fontFamily: 'monospace',
                textAlign: 'center',
                letterSpacing: '8px',
                outline: 'none'
              }}
            />
            <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              color: 'white',
              fontWeight: '600',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontSize: '16px'
            }}
          >
            {loading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#d1d5db', fontSize: '14px' }}>
            Already activated?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                color: '#c084fc',
                fontWeight: '600',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Activate;