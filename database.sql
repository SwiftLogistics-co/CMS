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
