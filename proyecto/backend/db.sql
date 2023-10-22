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

INSERT INTO users VALUES
(1, 'Coca Cola', 'Calle Falsa 123' , 20-234234234-4, 'cocacola@mail.com', 'coca_cola_admin','cocacolita'),
