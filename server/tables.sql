-- create database
create database nimap
use nimap
-- Create the "category" table
CREATE TABLE category (
  categoryId INT AUTO_INCREMENT PRIMARY KEY,  -- Use AUTO_INCREMENT for automatic incrementing
  categoryName VARCHAR(255) NOT NULL
);

-- Create the "product" table
CREATE TABLE product (
  productId INT AUTO_INCREMENT PRIMARY KEY,
  productName VARCHAR(255) NOT NULL,
  categoryId INT,
  FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

ALTER USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'password';
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';