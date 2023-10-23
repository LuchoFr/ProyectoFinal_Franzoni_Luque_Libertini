CREATE DATABASE IF NOT EXISTS  db_proyecto_final;
USE db_proyecto_final;
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY,
    companyName VARCHAR(255),
    adress VARCHAR(255),
    cuit VARCHAR(20),
    email VARCHAR(255),
    user VARCHAR(50),
    password VARCHAR(50)
)

CREATE TABLE IF NOT EXISTS Clients (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    lastName VARCHAR(255),
    adress VARCHAR(50),
    dni VARCHAR(255),
    email VARCHAR(50),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
)

CREATE TABLE IF NOT EXISTS Products(
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    stock INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
)

CREATE TABLE IF NOT EXISTS Services(
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id) 
)
CREATE TABLE IF NOT EXISTS Bills(
    id INT PRIMARY KEY,
    date  DATE,
    price DECIMAL(10,2),
    userID INT,
    clientID INT,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (clientID) REFERENCES Clients(id)
)
CREATE TABLE IF NOT EXISTS BillDetailsProducts (
    id INT PRIMARY KEY,
    billID INT,
    productID INT,
    quantity INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (billID) REFERENCES Bills(id),
    FOREIGN KEY (productID) REFERENCES Products(id)
)
CREATE TABLE IF NOT EXISTS BillDetailsServices(
    id INT PRIMARY KEY,
    billID INT,
    serviceID INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (billID) REFERENCES Bills(id),
    FOREIGN KEY (serviceID) REFERENCES Services(id)
)


/* QUERIES USERS */

USE db_proyecto_final;
INSERT INTO Users (id, companyName, adress, cuit, email, user, password)
VALUES
    (1, 'CocaCola', 'Dirección de Coca Cola', '1234567890', 'cocacola@email.com', 'cocacola_user', 'cocacola'),
    (2, 'WalMart', 'Dirección de Wal-Mart', '0987654321', 'walmart@email.com', 'walmart_user', 'walmart'),
    (3, 'Pepsi', 'Dirección de Pepsi', '1357924680', 'pepsi@email.com', 'pepsi_user', 'pepsi');


/* QUERIES PRODUCTS */
USE db_proyecto_final;
INSERT INTO Products (id, name, description, price, stock, userID)
VALUES
    (1, 'Smartphone XYZ', 'Un smartphone de última generación', 799.99, 50, 1),
    (2, 'Laptop SuperPro', 'Una laptop potente para profesionales', 1299.99, 30, 2),
    (3, 'Cámara Digital HD', 'Cámara para aficionados a la fotografía', 299.95, 25, 3),
    (4, 'Auriculares Inalámbricos', 'Auriculares de alta calidad', 99.99, 100, 1),
    (5, 'Televisor 4K', 'Televisor de 55 pulgadas con calidad 4K', 699.99, 20, 2),
    (6, 'Tablet Mini', 'Tablet compacta para entretenimiento', 199.99, 40, 3),
    (7, 'Impresora Todo-en-Uno', 'Impresora para uso doméstico', 79.95, 15, 1),
    (8, 'Teclado Mecánico', 'Teclado gaming con retroiluminación LED', 49.99, 60, 2),
    (9, 'Monitor Curvo', 'Monitor de 27 pulgadas con diseño curvo', 299.99, 10, 3),
    (10, 'Altavoz Bluetooth', 'Altavoz portátil con conexión Bluetooth', 29.99, 75, 1);