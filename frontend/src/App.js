import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SpacesPage from './pages/SpacesPage';
import MyBookingsPage from './pages/MyBookingsPage';
import './App.css'; // Para estilos globales

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <div className="container"> {/* Un contenedor para centrar contenido */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/spaces" element={<SpacesPage />} />

                        {/* Rutas protegidas */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/my-bookings" element={<MyBookingsPage />} />
                            {/* Si tuvieras una página para administrar espacios solo para admin:
                            <Route path="/admin/spaces" element={<AdminSpacesPage />} />
                            */}
                        </Route>

                        {/* Puedes añadir una ruta para 404 Not Found */}
                        <Route path="*" element={<div><h1>404 - Página no encontrada</h1></div>} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;