--remove database if i already exists
DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;

--select the employee tracket database
USE staff_db;

--create department table
CREATE TABLE department_table (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

--create role table
CREATE TABLE role_table (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department_table(id)
);

--create employee table
CREATE TABLE staff_table (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role_table(id)
    FOREIGN KEY (manager_id)
    REFERENCES staff_table(id)
);