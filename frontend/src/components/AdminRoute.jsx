import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
