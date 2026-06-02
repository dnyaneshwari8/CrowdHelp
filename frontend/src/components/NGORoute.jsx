import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const NGORoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <Spinner />;

    // Strictly allow ONLY approved NGOs.
    // Admins have their own separate dashboard.
    const isApprovedNGO = user.role === 'NGO' && user.ngoStatus === 'APPROVED';

    if (!isApprovedNGO) {
        return <Navigate to="/" />;
    }

    return children;
};

export default NGORoute;
