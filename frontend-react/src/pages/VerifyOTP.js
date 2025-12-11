import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import Toast from '../components/Toast';
import './Auth.css';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            showToast('Please enter the complete 6-digit code', 'error');
            return;
        }

        setLoading(true);

        try {
            await authService.activate(email, otpCode);
            showToast('Account activated successfully! Please login.', 'success');

            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error) {
            console.error('OTP verification error:', error);
            showToast('Invalid OTP. Please try again.', 'error');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="auth-card">
                <div className="auth-header">
                    <h1>Verify Your Email</h1>
                    <p>Enter the 6-digit code sent to</p>
                    <p className="email-highlight">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="otp-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="otp-input"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Verifying...
                            </>
                        ) : (
                            'Verify'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Didn't receive code? <button className="link-button">Resend</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;