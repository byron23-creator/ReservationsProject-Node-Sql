import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

const styles = {
    
    appContainer: {
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        fontFamily: 'sans-serif',
    },
    pageContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 16px',
    },
    
    header: {
        background: 'linear-gradient(90deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
        color: 'white',
        padding: '16px',
        boxShadow: '0 4px 10px -2px rgba(0, 0, 0, 0.2)',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        margin: '0 12px',
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'white',
    },
    // Card con más sombra para efecto "pop"
    card: {
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e9ecef'
    },
    formContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
        padding: '16px',
    },
    form: {
        width: '100%',
        maxWidth: '450px',
    },
    formTitle: {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '24px',
        color: '#343a40',
    },
    inputGroup: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        color: '#495057',
        marginBottom: '6px',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ced4da',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '1rem',
    },
    button: {
        width: '100%',
        backgroundColor: '#007bff', 
        color: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'background-color 0.2s ease',
    },
    buttonRed: {
        backgroundColor: '#dc3545', 
    },
    alertError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
        border: '1px solid #f5c6cb',
    },
    alertSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center',
        border: '1px solid #c3e6cb',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
    },
    espacioCard: {
        display: 'flex',
        flexDirection: 'column',
    },
    espacioCardContent: {
        flexGrow: 1,
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        width: '100%',
        maxWidth: '500px',
        padding: '32px',
    },
};



const apiClient = axios.create({ baseURL: 'http://localhost:3001/api' });

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));



const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setUser({ token });
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({ token });
        navigate('/espacios');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const authContextValue = { user, login, logout, isAuthenticated: !!user };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '32px' }}>Cargando aplicación...</div>;
    }

    return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};


const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.headerTitle}>🏢 ReservaEspacios</Link>
                <div>
                    {isAuthenticated ? (
                        <>
                            <Link to="/espacios" style={styles.navLink}>Espacios</Link>
                            <Link to="/mis-reservas" style={styles.navLink}>Mis Reservas</Link>
                            <button onClick={logout} style={{ ...styles.button, ...styles.buttonRed, width: 'auto', padding: '8px 12px', marginLeft: '16px' }}>
                                Salir 🚪
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={styles.navLink}>Login</Link>
                            <Link to="/register" style={styles.navLink}>Registro</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

const Card = ({ children, style: customStyle = {} }) => (
    <div style={{ ...styles.card, ...customStyle }}>
        {children}
    </div>
);


function LoginPage() {
    const [email, setEmail] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await apiClient.post('/auth/login', { email, contrasena });
            login(res.data.token);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al iniciar sesión');
        }
    };

    return (
        <div style={styles.formContainer}>
            <Card style={styles.form}>
                <h2 style={styles.formTitle}>Iniciar Sesión 🔑</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={styles.alertError}>{error}</p>}
                    <div style={styles.inputGroup}><label style={styles.label}>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Contraseña</label><input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} style={styles.input} required /></div>
                    <button type="submit" style={styles.button}>Entrar</button>
                </form>
            </Card>
        </div>
    );
}

function RegisterPage() {
    const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', contrasena: '', telefono: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const res = await apiClient.post('/auth/register', formData);
            setSuccess(res.data.msg + ' Serás redirigido al login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error al registrar');
        }
    };

    return (
        <div style={styles.formContainer}>
            <Card style={styles.form}>
                <h2 style={styles.formTitle}>Crea tu Cuenta 📝</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={styles.alertError}>{error}</p>}
                    {success && <p style={styles.alertSuccess}>{success}</p>}
                    <div style={styles.inputGroup}><label style={styles.label}>Nombre</label><input type="text" name="nombre" onChange={handleChange} style={styles.input} required /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Apellido</label><input type="text" name="apellido" onChange={handleChange} style={styles.input} required /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Email</label><input type="email" name="email" onChange={handleChange} style={styles.input} required /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Contraseña</label><input type="password" name="contrasena" onChange={handleChange} style={styles.input} required /></div>
                    <div style={styles.inputGroup}><label style={styles.label}>Teléfono (Opcional)</label><input type="tel" name="telefono" onChange={handleChange} style={styles.input} /></div>
                    <button type="submit" style={styles.button}>Registrarse</button>
                </form>
            </Card>
        </div>
    );
}

function EspaciosListPage() {
    const [espacios, setEspacios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedEspacio, setSelectedEspacio] = useState(null);

    useEffect(() => {
        apiClient.get('/espacios')
            .then(res => setEspacios(res.data))
            .catch(() => setError('No se pudieron cargar los espacios.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ textAlign: 'center', marginTop: '32px' }}>Buscando espacios... ⏳</p>;
    if (error) return <p style={{ ...styles.alertError, margin: '32px auto', maxWidth: '400px' }}>{error}</p>;

    return (
        <div style={styles.pageContainer}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Espacios Disponibles 🚀</h1>
            <div style={styles.grid}>
                {espacios.map(espacio => (
                    <Card key={espacio.id_espacio} style={styles.espacioCard}>
                        <div style={styles.espacioCardContent}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#007bff' }}>{espacio.nombre}</h3>
                            <p style={{ color: '#6c757d', marginBottom: '8px' }}>{espacio.tipo_espacio_nombre}</p>
                            <p style={{ color: '#495057', marginBottom: '4px' }}>📍 <span style={{ fontWeight: '600' }}>Ubicación:</span> {espacio.ubicacion}</p>
                            <p style={{ color: '#495057', marginBottom: '16px' }}>👥 <span style={{ fontWeight: '600' }}>Capacidad:</span> {espacio.capacidad} personas</p>
                            <p style={{ color: '#495057', marginBottom: '16px' }}>{espacio.descripcion}</p>
                        </div>
                        <button onClick={() => setSelectedEspacio(espacio)} style={styles.button}>Reservar ✨</button>
                    </Card>
                ))}
            </div>
            {selectedEspacio && <ReservaModal espacio={selectedEspacio} onClose={() => setSelectedEspacio(null)} />}
        </div>
    );
}

function ReservaModal({ espacio, onClose }) {
    const today = new Date().toISOString().split('T')[0];
    const [fecha, setFecha] = useState(today);
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!horaInicio || !horaFin || new Date(`${fecha}T${horaInicio}`) >= new Date(`${fecha}T${horaFin}`)) {
            setError('La hora de fin debe ser posterior a la hora de inicio.');
            return;
        }

        try {
            await apiClient.post('/reservas', { id_espacio: espacio.id_espacio, fecha_reserva: fecha, hora_inicio: horaInicio, hora_fin: horaFin });
            setSuccess('¡Reserva creada con éxito! 🎉');
            setTimeout(() => {
                onClose();
                navigate('/mis-reservas');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'No se pudo crear la reserva.');
        }
    };

    return (
        <div style={styles.modalOverlay}>
            <Card style={styles.modalContent}>
                <h2 style={styles.formTitle}>Reservar: {espacio.nombre}</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={styles.alertError}>😕 {error}</p>}
                    {success && <p style={styles.alertSuccess}>{success}</p>}
                    <div style={styles.inputGroup}><label style={styles.label}>Fecha</label><input type="date" value={fecha} min={today} onChange={e => setFecha(e.target.value)} style={styles.input} required /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div><label style={styles.label}>Hora de Inicio</label><input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} style={styles.input} required /></div>
                        <div><label style={styles.label}>Hora de Fin</label><input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} style={styles.input} required /></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                        <button type="button" onClick={onClose} style={{...styles.button, backgroundColor: '#6c757d', width: 'auto', padding: '10px 16px' }}>Cerrar</button>
                        <button type="submit" style={{...styles.button, width: 'auto', padding: '10px 16px' }}>Confirmar Reserva ✔️</button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

function MisReservasPage() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const fetchReservas = async () => {
        setLoading(true);
        try {
            setReservas((await apiClient.get('/reservas/mis-reservas')).data);
        } catch (err) {
            setError('No se pudieron cargar tus reservas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReservas(); }, []);

    const handleCancel = async (idReserva) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            try {
                await apiClient.patch(`/reservas/cancelar/${idReserva}`);
                fetchReservas();
            } catch (err) {
                alert(err.response?.data?.msg || 'Error al cancelar la reserva');
            }
        }
    };

    if (loading) return <p style={{ textAlign: 'center', marginTop: '32px' }}>Cargando tus reservas... ⏳</p>;
    if (error) return <p style={{...styles.alertError, margin: '32px auto'}}>{error}</p>;

    return (
        <div style={styles.pageContainer}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Mis Reservas 📅</h1>
            {reservas.length === 0 ? (
                <Card><p style={{ textAlign: 'center', color: '#495057' }}>🤷‍♂️ No tienes ninguna reserva activa. ¡Anímate a reservar!</p></Card>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reservas.map(reserva => (
                        <Card key={reserva.id_reserva} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                           <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#007bff' }}>{reserva.nombre_espacio}</h3>
                                <p style={{ color: '#495057' }}>{new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p style={{ color: '#343a40', fontWeight: '600' }}>{reserva.hora_inicio} - {reserva.hora_fin}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>📍 {reserva.ubicacion}</p>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                               <span style={{ fontSize: '0.875rem', fontWeight: '600', backgroundColor: '#d4edda', color: '#155724', padding: '4px 12px', borderRadius: '9999px', marginBottom: '12px', display: 'inline-block' }}>✅ {reserva.estado_reserva}</span>
                               <button onClick={() => handleCancel(reserva.id_reserva)} style={{...styles.button, ...styles.buttonRed, width: 'auto', padding: '8px 16px' }}>Cancelar ❌</button>
                           </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Componente Principal App ---
export default function App() {
    return (
        <Router>
            <div style={styles.appContainer}>
                <AuthProvider>
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/espacios" element={<PrivateRoute><EspaciosListPage /></PrivateRoute>} />
                            <Route path="/mis-reservas" element={<PrivateRoute><MisReservasPage /></PrivateRoute>} />
                            <Route path="*" element={<Navigate to="/espacios" />} />
                        </Routes>
                    </main>
                </AuthProvider>
            </div>
        </Router>
    );
}
