import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast ${type} show`}>
            <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose}>
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
};

export default Toast;