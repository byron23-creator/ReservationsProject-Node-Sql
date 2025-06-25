import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un spinner de carga
    }

    if (!user) {
        // No autenticado, redirige a la página de login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Autenticado pero no autorizado para el rol
        return <Navigate to="/" replace />; // O una página de "Acceso Denegado"
    }

    // Autenticado y autorizado
    return <Outlet />;
};

export default ProtectedRoute;