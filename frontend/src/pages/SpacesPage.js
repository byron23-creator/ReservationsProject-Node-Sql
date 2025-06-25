import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const SpacesPage = () => {
    const { user } = useAuth(); // Para saber si el usuario está autenticado
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const response = await api.get('/spaces');
            setSpaces(response.data);
        } catch (err) {
            console.error('Error al cargar espacios:', err);
            setError('Error al cargar los espacios.');
        }
    };

    const handleReserve = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedSpace) {
            setError('Por favor, selecciona un espacio.');
            return;
        }
        if (!startTime || !endTime) {
            setError('Por favor, ingresa la hora de inicio y fin.');
            return;
        }

        try {
            await api.post('/bookings', {
                space_id: selectedSpace.id,
                start_time: startTime,
                end_time: endTime
            });
            setMessage(`Reserva para ${selectedSpace.name} creada exitosamente!`);
            // Limpiar formulario
            setSelectedSpace(null);
            setStartTime('');
            setEndTime('');
        } catch (err) {
            console.error('Error al reservar:', err.response ? err.response.data : err);
            setError(err.response?.data?.message || 'Error al crear la reserva. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Espacios Disponibles</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {spaces.map(space => (
                    <div key={space.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <h3>{space.name}</h3>
                        <p><strong>Tipo:</strong> {space.type}</p>
                        <p><strong>Ubicación:</strong> {space.location}</p>
                        <p><strong>Capacidad:</strong> {space.capacity} personas</p>
                        <p><strong>Precio/hora:</strong> ${space.price_per_hour}</p>
                        {user ? ( // Solo muestra el botón si el usuario está logeado
                            <button
                                onClick={() => setSelectedSpace(space)}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: selectedSpace?.id === space.id ? '#0056b3' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '10px'
                                }}
                            >
                                {selectedSpace?.id === space.id ? 'Espacio Seleccionado' : 'Seleccionar para Reservar'}
                            </button>
                        ) : (
                            <p style={{ marginTop: '10px', color: '#555' }}>Inicia sesión para reservar este espacio.</p>
                        )}
                    </div>
                ))}
            </div>

            {selectedSpace && user && ( // Solo muestra el formulario si hay un espacio seleccionado y el usuario está logeado
                <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <h3>Reservar: {selectedSpace.name}</h3>
                    <form onSubmit={handleReserve} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '15px' }}>
                        <div>
                            <label htmlFor="startTime">Hora de Inicio:</label>
                            <input
                                type="datetime-local"
                                id="startTime"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div>
                            <label htmlFor="endTime">Hora de Fin:</label>
                            <input
                                type="datetime-local"
                                id="endTime"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Confirmar Reserva
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedSpace(null)}
                            style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Cancelar Selección
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SpacesPage;