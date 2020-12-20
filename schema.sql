DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;
USE employee_trackerDB;

CREATE TABLE department(
    id INT NOT NULL auto_increment,
    names VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT NOT NULL auto_increment,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NULL,
    department_id INTEGER,
    PRIMARY KEY(id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE manager(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    primary key(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE employee(
    id INT NOT NULL auto_increment,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
	PRIMARY KEY (id),
    role_id INT,
    manager_id INT,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
	CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES manager(id) ON DELETE CASCADE