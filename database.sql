-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) CHECK (role IN ('client', 'driver')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Routes table
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    driver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_location VARCHAR(200),
    end_location VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table (with route_id instead of join table)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_id INT REFERENCES routes(id) ON DELETE SET NULL,
    product VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, delivered, failed
    created_at TIMESTAMP DEFAULT NOW()
);


-- Insert 5 drivers
INSERT INTO users (name, email, password_hash, phone, address, role)
VALUES
('Driver One', 'driver1@swift.com', 'hashpass1', '0711111111', 'Colombo', 'driver'),
('Driver Two', 'driver2@swift.com', 'hashpass2', '0722222222', 'Kandy', 'driver'),
('Driver Three', 'driver3@swift.com', 'hashpass3', '0733333333', 'Galle', 'driver'),
('Driver Four', 'driver4@swift.com', 'hashpass4', '0744444444', 'Jaffna', 'driver'),
('Driver Five', 'driver5@swift.com', 'hashpass5', '0755555555', 'Kurunegala', 'driver');

-- Insert 10 routes
INSERT INTO routes (route_name, driver_id, start_location, end_location) VALUES
('Colombo City Express', 1, 'Colombo Fort', 'Nugegoda'),
('Kandy Central Route', 2, 'Kandy City Center', 'Peradeniya'),
('Galle Coastal Delivery', 3, 'Galle Fort', 'Matara'),
('Jaffna Northern Express', 4, 'Jaffna Town', 'Kilinochchi'),
('Kurunegala Hub Route', 5, 'Kurunegala Town', 'Dambulla'),
('Colombo Airport Shuttle', 1, 'Colombo Fort', 'Katunayake Airport'),
('Kandy Hills Route', 2, 'Kandy City Center', 'Nuwara Eliya'),
('Southern Highway Express', 3, 'Galle', 'Hambantota'),
('Eastern Province Delivery', 4, 'Trincomalee', 'Batticaloa'),
('Western Province Daily', 5, 'Negombo', 'Colombo');
