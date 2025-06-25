import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        try {
            const response = await api.get('/bookings/my');
            setBookings(response.data);
            setError('');
        } catch (err) {
            console.error('Error al cargar mis reservas:', err);
            setError('Error al cargar tus reservas.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            try {
                await api.delete(`/bookings/${bookingId}`);
                setMessage('Reserva cancelada exitosamente.');
                fetchMyBookings(); // Recargar las reservas
            } catch (err) {
                console.error('Error al cancelar reserva:', err.response ? err.response.data : err);
                setError(err.response?.data?.message || 'Error al cancelar la reserva.');
            }
        }
    };

    // Función auxiliar para formatear fechas
    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateTimeString).toLocaleDateString('es-ES', options);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Mis Reservas</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {bookings.length === 0 ? (
                <p>No tienes reservas activas.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: booking.status === 'canceled' ? '#f8d7da' : '#e2f0cb' }}>
                            <h3>{booking.space_name}</h3>
                            <p><strong>Ubicación:</strong> {booking.location}</p>
                            <p><strong>Inicio:</strong> {formatDateTime(booking.start_time)}</p>
                            <p><strong>Fin:</strong> {formatDateTime(booking.end_time)}</p>
                            <p><strong>Estado:</strong> {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}</p>
                            {booking.status === 'confirmed' && (
                                <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '10px'
                                    }}
                                >
                                    Cancelar Reserva
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;