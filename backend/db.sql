CREATE DATABASE IF NOT EXISTS  db_proyecto_final;
USE db_proyecto_final;
CREATE TABLE Users (
    id INT PRIMARY KEY,
    companyName VARCHAR(255),
    adress VARCHAR(255),
    cuit VARCHAR(20),
    email VARCHAR(255),
    user VARCHAR(50),
    password VARCHAR(50),
);
CREATE TABLE Clients (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    lastName VARCHAR(255),
    adress VARCHAR(50),
    dni VARCHAR(255),
    email VARCHAR(50),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
);
CREATE TABLE Products(
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    stock INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
)
CREATE TABLE Services(
    id INT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price DECIMAL(10,2),
    userID INT,
    FOREIGN KEY (userID) REFERENCES Users(id) 
)
CREATE TABLE Bills(
    id INT PRIMARY KEY,
    date  DATE,
    price DECIMAL(10,2),
    userID INT,
    clientID INT,
    FOREIGN KEY (userID) REFERENCES Users(id)
    FOREIGN KEY (clientID) REFERENCES Client(id)
)