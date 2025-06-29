import { env } from "./env";
import mysql from "mysql2/promise";

(async () => {
  const connection = await mysql.createConnection({
    host: env.db.host,
    port: Number(env.db.port),
    user: env.db.user,
    password: env.db.password,
    database: env.db.name,
    multipleStatements: true,
  });

  try {
    const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20) DEFAULT NULL,
      is_active TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY email (email)
    );

    CREATE TABLE IF NOT EXISTS addresses (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      street VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip_code VARCHAR(20) NOT NULL,
      country VARCHAR(100) NOT NULL,
      is_default TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY fk_user_address (user_id),
      CONSTRAINT fk_user_address FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS shipments (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      origin_zip VARCHAR(20) NOT NULL,
      destination_zip VARCHAR(20) NOT NULL,
      weight DECIMAL(10,2) NOT NULL,
      length DECIMAL(10,2) NOT NULL,
      width DECIMAL(10,2) NOT NULL,
      height DECIMAL(10,2) NOT NULL,
      total_cost DECIMAL(15,2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      CONSTRAINT fk_shipments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tariffs (
      id INT NOT NULL AUTO_INCREMENT,
      origin_zip VARCHAR(10) NOT NULL,
      destination_zip VARCHAR(10) NOT NULL,
      min_weight DECIMAL(10,2) NOT NULL,
      max_weight DECIMAL(10,2) NOT NULL,
      cost DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );

    CREATE TABLE IF NOT EXISTS shipment_status_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      shipment_id INT NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
    );

    DROP TRIGGER IF EXISTS trg_after_shipment_status_update;

    CREATE TRIGGER trg_after_shipment_status_update
    AFTER UPDATE ON shipments
    FOR EACH ROW
    BEGIN
      IF OLD.status <> NEW.status THEN
        INSERT INTO shipment_status_history (shipment_id, status)
        VALUES (NEW.id, NEW.status);
      END IF;
    END;

    -- inserts
    
    
    INSERT INTO tariffs (origin_zip, destination_zip, min_weight, max_weight, cost)
    VALUES 
    ('110111', '050021', 0, 5, 8000),
    ('110111', '050021', 5.01, 10, 12000),
    ('110111', '050021', 10.01, 20, 18000),
    ('110111', '760001', 0, 5, 9000),
    ('110111', '760001', 5.01, 10, 13000),
    ('050021', '110111', 0, 5, 8500);
    
    INSERT INTO users (email, password, name, last_name, phone)
    VALUES (
      'user1@example.com',
      '$2b$10$2efmPcFZ83ZiQQGarZ41ReDnWBv0nYdFdUkMpk6AX73OgOhpLhBRC',
      'E2E',
      'Tester',
      '0000000000'
      );
      
      
        INSERT INTO shipments (user_id, origin_zip, destination_zip, weight, length, width, height, total_cost, status)
        VALUES
          (
          1,               
          '11001',         
          '22002',         
          3.5,             
          20.0,            
          15.0,           
          10.0,           
          150.00,         
          'pending'       
        );
        
  INSERT INTO addresses (user_id, street, city, state, zip_code, country, is_default)
  VALUES (1, 'Calle Falsa 123', 'Bogotá', 'Cundinamarca', '110111', 'Colombia', true);  
    `;

    await connection.query(schema);
    console.log("✅ Migración ejecutada exitosamente");
  } catch (err) {
    console.error("❌ Error durante la migración:", err);
    process.exit(1);
  } finally {
    await connection.end();
  }
})();
