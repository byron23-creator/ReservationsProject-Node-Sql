import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // Crea este archivo para estilos

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Reserva Espacios</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/spaces">Espacios</Link></li>
                {user ? (
                    <>
                        <li><Link to="/my-bookings">Mis Reservas</Link></li>
                        <li>
                            <span className="navbar-welcome">Hola, {user.username}!</span>
                            <button onClick={logout} className="navbar-logout-btn">Salir</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Iniciar Sesión</Link></li>
                        <li><Link to="/register">Registrarse</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;