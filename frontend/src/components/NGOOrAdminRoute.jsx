import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const NGOOrAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;

    if (!user || (user.role !== 'ADMIN' && (user.role !== 'NGO' || user.ngoStatus !== 'APPROVED'))) {
        return <Navigate to="/" />;
    }

    return children;
};

export default NGOOrAdminRoute;
