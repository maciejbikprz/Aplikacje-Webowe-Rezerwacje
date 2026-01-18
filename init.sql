-- Tworzenie tabeli użytkowników
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tworzenie tabeli łódek
CREATE TABLE IF NOT EXISTS boats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    description TEXT,
    capacity INT NOT NULL,
    pricePerDay DECIMAL(10, 2) NOT NULL,
    length DECIMAL(10, 2),
    status ENUM('available', 'reserved', 'maintenance') DEFAULT 'available',
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tworzenie tabeli rezerwacji
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    boat_id INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (boat_id) REFERENCES boats(id) ON DELETE CASCADE
);


-- Tworzenie admina
INSERT INTO users (firstName, lastName, email, password, role) VALUES
('admin', 'admin', 'admin@admin', '$2b$10$JCvF23SF0ZC7UwAQJMj.WOHn.NB3EtyTdvmDakF30SOIbXepSU8Ca', 'admin');

-- Tworzenie przykładowego użytkownika
INSERT INTO users (firstName, lastName, email, password, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$2b$10$JCvF23SF0ZC7UwAQJMj.WOHn.NB3EtyTdvmDakF30SOIbXepSU8Ca', 'user');

INSERT INTO users (firstName, lastName, email, password, role) VALUES
('Jane', 'Smith', 'jane.smith@example.com', '$2b$10$JCvF23SF0ZC7UwAQJMj.WOHn.NB3EtyTdvmDakF30SOIbXepSU8Ca', 'user');

-- Tworzenie przykładowych łódek
INSERT INTO boats (name, type, description, capacity, pricePerDay, length, status
) VALUES
('Sea Breeze', 'Sailboat', 'A comfortable sailboat for coastal cruising.', 6, 150.00, 30.5, 'available'),
('Wave Rider', 'Motorboat', 'A fast motorboat perfect for day trips.', 4, 200.00, 25.0, 'available'),
('Ocean Explorer', 'Yacht', 'A luxurious yacht for extended voyages.', 10, 500.00, 50.0, 'available'),
('River Runner', 'Kayak', 'A lightweight kayak for river adventures.', 2, 50.00, 12.0, 'available'),
('Fishing Pro', 'Fishing Boat', 'A boat equipped for fishing trips.', 5, 120.00, 20.0, 'available'),
('Sun Chaser', 'Catamaran', 'A stable catamaran for group outings.', 8, 300.00, 35.0, 'available');
-- Tworzenie przykładowych rezerwacji
INSERT INTO reservations (user_id, boat_id, startDate, endDate, totalPrice,
    status) VALUES
    (2, 1, '2024-07-01', '2024-07-05', 600.00, 'confirmed'),
    (3, 2, '2024-08-10', '2024-08-12', 400.00, 'pending');
