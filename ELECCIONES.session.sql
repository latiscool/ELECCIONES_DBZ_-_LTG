CREATE DATABASE elecciones;


CREATE TABLE candidatos (
id SERIAL, 
nombre VARCHAR(50), 
foto varchar(100000), 
color varchar(9), 
votos INT);

CREATE TABLE historial (
estado varchar(35) UNIQUE,
votos INT,
ganador varchar(40)
);

-- SELECT*FROM candidatos;