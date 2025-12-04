import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    // Function to check authentication
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');

        console.log('🔍 Checking auth:', { token: !!token, email, role });

        if (token && email) {
            const adminStatus = role === 'ADMIN' || role === 'ROLE_ADMIN';

            setUser({
                email: email,
                name: email.split('@')[0],
                role: role || 'USER'
            });
            setIsAuthenticated(true);
            setIsAdmin(adminStatus);

            console.log('✅ User authenticated:', { email, role, isAdmin: adminStatus });
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            console.log('❌ User not authenticated');
        }
    };

    // Check auth on initial load
    useEffect(() => {
        checkAuth();
    }, []);

    // Check auth on every route change
    useEffect(() => {
        checkAuth();
    }, [location]);

    // Listen for storage changes (from other tabs or manual changes)
    useEffect(() => {
        window.addEventListener('storage', checkAuth);

        // Custom event for same-tab storage changes
        window.addEventListener('localStorageChanged', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('localStorageChanged', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        console.log('🔵 Logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('refreshToken');

        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);

        // Trigger custom event
        window.dispatchEvent(new Event('localStorageChanged'));
    };

    console.log('📊 Current state:', {
        isAuthenticated,
        isAdmin,
        userEmail: user?.email,
        currentPath: location.pathname
    });

    return (
        <div className="app">
            <Navbar
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                user={user}
                onLogout={handleLogout}
            />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />

                {/* Auth Routes */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated ?
                        <Navigate to="/" replace /> :
                        <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        isAuthenticated ?
                        <Navigate to="/" replace /> :
                        <Register />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/products"
                    element={
                        isAuthenticated ?
                        <Products isAuthenticated={isAuthenticated} /> :
                        <Navigate to="/login" replace />
                    }
                />

                {/* Admin Route - NO PROTECTION FOR NOW */}
                <Route
                    path="/admin"
                    element={<AdminDashboard onLogout={handleLogout} />}
                />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;