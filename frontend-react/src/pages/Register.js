import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      console.log('🔵 Submitting registration...');
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('🔵 Response:', data);

      if (response.ok) {
        console.log('✅ Registration successful!');
        sessionStorage.setItem('activationEmail', formData.email);
        setSuccess(true);
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Network error. Is backend running?');
      setLoading(false);
    }
  };

  // Show activation page directly after success
  if (success) {
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
              background: 'linear-gradient(to right, #10b981, #3b82f6)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '32px' }}>✅</span>
            </div>
            <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              Check Your Email!
            </h1>
            <p style={{ color: '#d1d5db', marginBottom: '20px' }}>
              We've sent a 6-digit activation code to:
            </p>
            <p style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '16px' }}>
              {formData.email}
            </p>
          </div>

          <ActivationForm email={formData.email} />
        </div>
      </div>
    );
  }

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
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
            Create Account
          </h1>
          <p style={{ color: '#d1d5db' }}>Join TechStore today</p>
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

        {loading && (
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#93c5fd', fontSize: '14px' }}>⏳ Creating your account...</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your first name"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

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
              disabled={loading}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              placeholder="At least 6 characters"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#d1d5db' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#c084fc', fontWeight: '600', textDecoration: 'underline' }}>
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Activation form component embedded in the same file
function ActivationForm({ email }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (code.length !== 6) {
      setError('Activation code must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/login';
      } else {
        setError(data.message || 'Invalid activation code');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          Activation Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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
  );
}

export default Register;
