CREATE DATABASE IF NOT EXISTS  db_proyecto_final;
USE db_proyecto_final;
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyName VARCHAR(255),
    address VARCHAR(255),
    cuit VARCHAR(20),
    email VARCHAR(255),
    user VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lastName VARCHAR(255),
    address VARCHAR(50),
    dni VARCHAR(255),
    cuit VARCHAR(255),
    email VARCHAR(50),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Products(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    stock INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Services(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id) 
);

CREATE TABLE IF NOT EXISTS Bills(
    id INT AUTO_INCREMENT PRIMARY KEY,
    date  DATE,
    price DECIMAL(10,2),
    userID INT,
    clientID INT,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (clientID) REFERENCES Clients(id)
);

CREATE TABLE IF NOT EXISTS BillDetails(
    id INT AUTO_INCREMENT PRIMARY KEY,
    billID INT,
    productID INT NULL, -- Permitir valores nulos para poder cargar solo service en caso de ser null porduct
    serviceID INT NULL, -- Permitir valores nulos para poder cargar solo products en caso de ser service null
    productQuantity INT NULL,
    FOREIGN KEY (billID) REFERENCES Bills(id),
    FOREIGN KEY (productID) REFERENCES Products(id),
    FOREIGN KEY (serviceID) REFERENCES Services(id)
);



/* QUERIES USERS */

USE db_proyecto_final;
INSERT INTO Users (companyName, address, cuit, email, user, password)
VALUES
    ('CocaCola', 'Dirección de Coca Cola', '1234567890', 'cocacola@email.com', 'cocacola_user', 'cocacola'),
    ('WalMart', 'Dirección de Wal-Mart', '0987654321', 'walmart@email.com', 'walmart_user', 'walmart'),
    ('Pepsi', 'Dirección de Pepsi', '1357924680', 'pepsi@email.com', 'pepsi_user', 'pepsi');


/* QUERIES PRODUCTS */
INSERT INTO Products (name, description, price, stock, userID)
VALUES
    ('Smartphone XYZ', 'Un smartphone de última generación', 799.99, 50, 1),
    ('Laptop SuperPro', 'Una laptop potente para profesionales', 1299.99, 30, 2),
    ('Cámara Digital HD', 'Cámara para aficionados a la fotografía', 299.95, 25, 3),
    ('Auriculares Inalámbricos', 'Auriculares de alta calidad', 99.99, 100, 1),
    ('Televisor 4K', 'Televisor de 55 pulgadas con calidad 4K', 699.99, 20, 2),
    ('Tablet Mini', 'Tablet compacta para entretenimiento', 199.99, 40, 3),
    ('Impresora Todo-en-Uno', 'Impresora para uso doméstico', 79.95, 15, 1),
    ('Teclado Mecánico', 'Teclado gaming con retroiluminación LED', 49.99, 60, 2),
    ('Monitor Curvo', 'Monitor de 27 pulgadas con diseño curvo', 299.99, 10, 3),
    ('Altavoz Bluetooth', 'Altavoz portátil con conexión Bluetooth', 29.99, 75, 1);


/* QUERIES SERVICES */
INSERT INTO Services (name, description, price, userID)
VALUES
    ('Mantenimiento de Redes Empresariales', 'Servicio de mantenimiento y optimización de redes corporativas', 80.00, 1),
    ('Desarrollo de Aplicaciones Web', 'Creación de aplicaciones web personalizadas', 100.00, 1),
    ('Soporte Técnico Remoto', 'Asistencia técnica a distancia para problemas informáticos', 40.00, 2),
    ('Diseño de Interfaces de Usuario', 'Diseño y desarrollo de interfaces de usuario atractivas', 90.00, 2),
    ('Servicio de Seguridad de Datos', 'Protección y auditoría de la seguridad de datos', 70.00, 3),
    ('Recuperación de Datos', 'Recuperación de datos perdidos o dañados', 60.00, 3),
    ('Optimización de Sistemas', 'Mejora del rendimiento y optimización de sistemas informáticos', 75.00, 1),
    ('Servicio de Consultoría en Ciberseguridad', 'Consultoría y auditoría en ciberseguridad', 110.00, 2);

/*QUERIES CLIENTES*/
INSERT INTO Clients (name, lastName, address, dni, cuit, email, userID)
VALUES
    ('Juan', 'Pérez', '123 Calle Principal', '12345678', '20345678901', 'juan@email.com', 1),
    ('Ana', 'González', '456 Calle Secundaria', '87654321', '30345678902', 'ana@email.com', 1),
    ('Pedro', 'Sánchez', '789 Avenida Central', '98765432', '40345678903', 'pedro@email.com', 2),
    ('María', 'López', '101 Plaza Mayor', '23456789', '50345678904', 'maria@email.com', 2),
    ('Luis', 'Martínez', '202 Calle Estrella', '34567890', '60345678905', 'luis@email.com', 3),
    ('Laura', 'Rodríguez', '303 Avenida del Sol', '45678901', '70345678906', 'laura@email.com', 3);

/*Para eliminar la database*/
DROP DATABASE db_proyecto_final