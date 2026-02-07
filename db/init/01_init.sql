-- UCEShop Database Initialization Script
-- Crear la base de datos uceshop y los tres esquemas lógicos

-- Conectar a la base de datos uceshop (se asume ya creada por PostgreSQL container)

-- Crear esquemas lógicos
CREATE SCHEMA IF NOT EXISTS customers;
CREATE SCHEMA IF NOT EXISTS products;
CREATE SCHEMA IF NOT EXISTS orders;

-- Crear tabla de clientes en el esquema customers
CREATE TABLE IF NOT EXISTS customers.customer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos en el esquema products
CREATE TABLE IF NOT EXISTS products.product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (price > 0),
    CHECK (stock >= 0)
);

-- Crear tabla de pedidos en el esquema orders
CREATE TABLE IF NOT EXISTS orders.order (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (quantity > 0),
    CHECK (unit_price > 0),
    CHECK (total_amount > 0)
);

-- Insertar datos de prueba para clientes
INSERT INTO customers.customer (name, email, phone, address) VALUES
('Juan Pérez', 'juan.perez@uce.edu.ec', '+593987654321', 'Av. América 123, Quito'),
('María González', 'maria.gonzalez@uce.edu.ec', '+593987654322', 'Calle Colon 456, Quito'),
('Carlos Rodríguez', 'carlos.rodriguez@uce.edu.ec', '+593987654323', 'Av. 12 de Octubre 789, Quito')
ON CONFLICT (email) DO NOTHING;

-- Insertar datos de prueba para productos
INSERT INTO products.product (name, description, price, stock, category) VALUES
('Libro UCE - Matemáticas I', 'Libro de texto de Matemáticas I para estudiantes de UCE', 25.50, 100, 'Libros'),
('Cuaderno UCE Universitario', 'Cuaderno con logo de UCE, 100 hojas', 3.75, 200, 'Cuadernos'),
('Sudadera UCE Azul', 'Sudadera oficial de la Universidad Central del Ecuador', 45.99, 50, 'Sudaderas'),
('Libro UCE - Física General', 'Libro de texto de Física General', 32.00, 75, 'Libros'),
('Cuaderno UCE Premium', 'Cuaderno premium con espiral, 150 hojas', 5.25, 150, 'Cuadernos')
ON CONFLICT DO NOTHING;

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_customer_email ON customers.customer(email);
CREATE INDEX IF NOT EXISTS idx_product_category ON products.product(category);
CREATE INDEX IF NOT EXISTS idx_order_customer_id ON orders.order(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_product_id ON orders.order(product_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON orders.order(status);

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language plpgsql;

-- Triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers.customer 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products.product 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders.order 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Otorgar permisos al usuario de la aplicación
GRANT USAGE ON SCHEMA customers TO uceshop_user;
GRANT USAGE ON SCHEMA products TO uceshop_user;
GRANT USAGE ON SCHEMA orders TO uceshop_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA customers TO uceshop_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA products TO uceshop_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA orders TO uceshop_user;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA customers TO uceshop_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA products TO uceshop_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA orders TO uceshop_user;