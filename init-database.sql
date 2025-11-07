-- Script SQL para inicializar la base de datos Gravi
-- Ejecutar en phpMyAdmin o MySQL Workbench

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS gravi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gravi;

-- Tabla de suscriptores
CREATE TABLE IF NOT EXISTS suscriptores (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    nit VARCHAR(20) NOT NULL UNIQUE,
    subdominio VARCHAR(50),
    email_contacto VARCHAR(255),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_suscriptores_nit (nit),
    INDEX idx_suscriptores_subdominio (subdominio)
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    suscriptor_id CHAR(36) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (suscriptor_id) REFERENCES suscriptores(id) ON DELETE CASCADE
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    nit VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    rol_id CHAR(36),
    suscriptor_id CHAR(36),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    ultimo_login DATETIME,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL,
    FOREIGN KEY (suscriptor_id) REFERENCES suscriptores(id) ON DELETE CASCADE
);

-- Insertar datos de prueba
INSERT IGNORE INTO suscriptores (id, nombre, nit, subdominio, email_contacto, direccion, telefono, activo) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Edificio Torres del Parque', '900123456-7', 'torres-del-parque', 'admin@torresdelparque.com', 'Calle 123 #45-67, Bogotá', '+57 301 234 5678', 1);

INSERT IGNORE INTO roles (id, suscriptor_id, nombre, descripcion) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Administrador', 'Usuario con acceso completo al sistema');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, nit, password, telefono, rol_id, suscriptor_id, activo) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Admin', 'Sistema', 'admin@gravi.com', '1234567890', 'admin123', '+57 300 123 4567', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 1);