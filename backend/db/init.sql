DROP TABLE IF EXISTS Reserva;
DROP TABLE IF EXISTS Usuario;
DROP TABLE IF EXISTS Espacio;
DROP TABLE IF EXISTS Tipo_Usuario;
DROP TABLE IF EXISTS Tipo_Espacio;
DROP TABLE IF EXISTS Estado_Reserva;

-- Tabla: Tipo_Usuario
CREATE TABLE Tipo_Usuario (
    id_tipo_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla: Tipo_Espacio
CREATE TABLE Tipo_Espacio (
    id_tipo_espacio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla: Estado_Reserva
CREATE TABLE Estado_Reserva (
    id_estado_reserva INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla: Usuario
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    id_tipo_usuario INT,
    FOREIGN KEY (id_tipo_usuario) REFERENCES Tipo_Usuario(id_tipo_usuario)
);

-- Tabla: Espacio
CREATE TABLE Espacio (
    id_espacio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    capacidad INT,
    ubicacion VARCHAR(100),
    estado BOOLEAN DEFAULT TRUE, 
    descripcion TEXT,
    id_tipo_espacio INT,
    FOREIGN KEY (id_tipo_espacio) REFERENCES Tipo_Espacio(id_tipo_espacio)
);

-- Tabla: Reserva
CREATE TABLE Reserva (
    id_reserva INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_espacio INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_estado_reserva INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_espacio) REFERENCES Espacio(id_espacio),
    FOREIGN KEY (id_estado_reserva) REFERENCES Estado_Reserva(id_estado_reserva)
);

-- Inserción de datos iniciales para empezar a probar la aplicación

-- Tipos de Usuario
INSERT INTO Tipo_Usuario (nombre) VALUES ('Cliente'), ('Administrador');

-- Tipos de Espacio
INSERT INTO Tipo_Espacio (nombre) VALUES ('Sala de Reuniones'), ('Cancha Deportiva'), ('Puesto de Coworking'), ('Auditorio');

-- Estados de Reserva
INSERT INTO Estado_Reserva (nombre) VALUES ('Confirmada'), ('Cancelada'), ('Pendiente');

-- Espacios de Ejemplo
INSERT INTO Espacio (nombre, capacidad, ubicacion, descripcion, id_tipo_espacio) VALUES 
('Sala Creativa A', 10, 'Piso 1, Ala Norte', 'Sala equipada con pizarra blanca y proyector.', 1),
('Sala de Juntas Principal', 25, 'Piso 2, Centro', 'Ideal para reuniones ejecutivas.', 1),
('Cancha de Futbol 5', 10, 'Exterior, Zona Oeste', 'Cancha de cesped sintetico con iluminacion.', 2),
('Puesto Individual #12', 1, 'Planta Abierta, Piso 3', 'Puesto de trabajo con monitor y silla ergonómica.', 3);