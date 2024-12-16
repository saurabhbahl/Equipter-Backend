-- Create Zone table
CREATE TABLE Zone (
    id CHAR(36) PRIMARY KEY,
    zone_name TEXT,
    shipping_rate DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create State table
CREATE TABLE State (
    id CHAR(36) PRIMARY KEY,
    state_name TEXT,
    is_delivery_paused TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ZoneState table
CREATE TABLE ZoneState (
    id CHAR(36) PRIMARY KEY,
    zone_id CHAR(36),
    state_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES Zone(id),
    FOREIGN KEY (state_id) REFERENCES State(id)
);

-- Create FirstPageForm table
CREATE TABLE FirstPageForm (
    id CHAR(36) PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone_number TEXT,
    email TEXT UNIQUE,
    job_title TEXT,
    state_id CHAR(36),
    industry TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES State(id)
);

-- Create Product table
CREATE TABLE Product (
    id CHAR(36) PRIMARY KEY,
    name TEXT,
    description TEXT,
    gvwr DECIMAL(10, 2),
    lift_capacity DECIMAL(10, 2),
    lift_height DECIMAL(10, 2),
    product_title TEXT,
    product_url TEXT,
    container_capacity DECIMAL(10, 2),
    price DECIMAL(10, 2),
    downpayment_cost DECIMAL(10, 2),
    meta_title TEXT,
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ProductImage table
CREATE TABLE ProductImage (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36),
    image_url TEXT,
    image_description TEXT,
    is_featured TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(id)
);

-- Create Accessory table
CREATE TABLE Accessory (
    id CHAR(36) PRIMARY KEY,
    name TEXT,
    description TEXT,
    meta_title TEXT,
    accessory_title TEXT,
    accessory_url TEXT,
    price DECIMAL(10, 2),
    stock_quantity INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create AccessoryProduct table
CREATE TABLE AccessoryProduct (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36),
    accessory_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(id),
    FOREIGN KEY (accessory_id) REFERENCES Accessory(id)
);

-- Create AccessoryImage table
CREATE TABLE AccessoryImage (
    id CHAR(36) PRIMARY KEY,
    accessory_id CHAR(36),
    image_url TEXT,
    image_description TEXT,
    is_featured TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (accessory_id) REFERENCES Accessory(id)
);

-- Create ShippingMethod table
CREATE TABLE ShippingMethod (
    id CHAR(36) PRIMARY KEY,
    method_type ENUM('pickup', 'delivery'),
    name TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create WebQuote table
CREATE TABLE WebQuote (
    id CHAR(36) PRIMARY KEY,
    webquote_url TEXT UNIQUE,
    stage ENUM('Quote', 'Saved', 'Ordered'),
    financing ENUM('cash', 'financing'),
    product_id CHAR(36),
    product_name TEXT,
    product_price DECIMAL(10, 2),
    product_qty INT,
    shipping_method_id CHAR(36),
    zone_id CHAR(36),
    contact_first_name TEXT,
    contact_last_name TEXT,
    contact_company_name TEXT,
    contact_phone_number TEXT,
    contact_email TEXT,
    contact_industry TEXT,
    contact_job_title TEXT,
    billing_same_as_delivery TINYINT(1),
    billing_address_street TEXT,
    billing_address_city TEXT,
    billing_address_state TEXT,
    billing_address_zip_code TEXT,
    billing_address_country TEXT,
    delivery_cost DECIMAL(10, 2),
    delivery_address_street TEXT,
    delivery_address_city TEXT,
    delivery_address_state_id CHAR(36),
    delivery_address_zip_code TEXT,
    delivery_address_country TEXT,
    estimated_delivery_date TIMESTAMP NULL DEFAULT NULL,
    pickup_location_name TEXT,
    pickup_location_address TEXT,
    pickup_scheduled_date TIMESTAMP NULL DEFAULT NULL,
    payment_type ENUM('FullPayment', 'EMI') NOT NULL,
    product_total_cost DECIMAL(10, 2),
    non_refundable_deposit DECIMAL(10, 2),
    i_understand_deposit_is_non_refundable TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(id),
    FOREIGN KEY (shipping_method_id) REFERENCES ShippingMethod(id),
    FOREIGN KEY (zone_id) REFERENCES Zone(id),
    FOREIGN KEY (delivery_address_state_id) REFERENCES State(id)
);

-- Create FullPayment table
CREATE TABLE FullPayment (
    id CHAR(36) PRIMARY KEY,
    webquote_id CHAR(36),
    payment_method ENUM('card'),
    payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
    total_payment_amount DECIMAL(10, 2),
    transaction_reference TEXT,
    processed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (webquote_id) REFERENCES WebQuote(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT chk_webquote_full_payment CHECK (
        (SELECT payment_type FROM WebQuote WHERE WebQuote.id = webquote_id) = 'FullPayment'
    )
);

-- Create EMIPlan table
CREATE TABLE EMIPlan (
    id CHAR(36) PRIMARY KEY,
    webquote_id CHAR(36),
    financing_rate_config_id CHAR(36),
    total_financed_amount DECIMAL(10, 2),
    monthly_emi_amount DECIMAL(10, 2),
    number_of_installments INT,
    start_date TIMESTAMP NULL DEFAULT NULL,
    end_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (webquote_id) REFERENCES WebQuote(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY (financing_rate_config_id) REFERENCES FinancingRateConfig(id),
    CONSTRAINT chk_webquote_emi CHECK (
        (SELECT payment_type FROM WebQuote WHERE WebQuote.id = webquote_id) = 'EMI'
    )
);

-- Create FinancingRateConfig table
CREATE TABLE FinancingRateConfig (
    id CHAR(36) PRIMARY KEY,
    interest_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create InstallmentsTracking table
CREATE TABLE InstallmentsTracking (
    id CHAR(36) PRIMARY KEY,
    emi_plan_id CHAR(36),
    installment_number INT,
    due_date TIMESTAMP NULL DEFAULT NULL,
    amount DECIMAL(10, 2),
    payment_status ENUM('Pending', 'Paid', 'Overdue'),
    payment_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emi_plan_id) REFERENCES EMIPlan(id)
);

-- Create EMITransaction table
CREATE TABLE EMITransaction (
    id CHAR(36) PRIMARY KEY,
    installment_tracking_id CHAR(36),
    transaction_reference TEXT,
    transaction_amount DECIMAL(10, 2),
    transaction_status ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
    payment_method ENUM('card'),
    processed_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (installment_tracking_id) REFERENCES InstallmentsTracking(id)
);

-- Create Order table
CREATE TABLE `Order` (
    id CHAR(36) PRIMARY KEY,
    webquote_id CHAR(36),
    order_status ENUM('Pending', 'InProgress', 'Completed', 'Delayed'),
    estimated_completion_date TIMESTAMP NULL DEFAULT NULL,
    actual_completion_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (webquote_id) REFERENCES WebQuote(id)
);

-- Create DevelopmentStage table
CREATE TABLE DevelopmentStage (
    id CHAR(36) PRIMARY KEY,
    product_order_id CHAR(36),
    stage_name TEXT,
    stage_status ENUM('Pending', 'InProgress', 'Completed', 'Delayed'),
    started_at TIMESTAMP NULL DEFAULT NULL,
    completed_at TIMESTAMP NULL DEFAULT NULL,
    remarks TEXT,
    delay_reason TEXT,
    estimated_completion_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_order_id) REFERENCES `Order`(id)
);




CREATE TABLE QuoteAccessory (
    id CHAR(36) PRIMARY KEY,
    webquote_id CHAR(36),
    accessory_id CHAR(36),
    accessory_name TEXT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (webquote_id) REFERENCES WebQuote(id),
    FOREIGN KEY (accessory_id) REFERENCES Accessory(id)
);






-- insert values
-- Insert into Zone
INSERT INTO zone (id, zone_name, shipping_rate) VALUES
(UUID(), 'Zone A', 10.50),
(UUID(), 'Zone B', 15.00),
(UUID(), 'Zone C', 20.00),
(UUID(), 'Zone D', 25.00),
(UUID(), 'Zone E', 30.00),
(UUID(), 'Zone F', 35.00),
(UUID(), 'Zone G', 40.00),
(UUID(), 'Zone H', 45.00),
(UUID(), 'Zone I', 50.00),
(UUID(), 'Zone J', 55.00);

-- Insert into State
INSERT INTO state (id, state_name, is_delivery_paused) VALUES
(UUID(), 'California', 0),
(UUID(), 'Texas', 1),
(UUID(), 'Florida', 0),
(UUID(), 'New York', 1),
(UUID(), 'Illinois', 0),
(UUID(), 'Nevada', 0),
(UUID(), 'Washington', 0),
(UUID(), 'Oregon', 1),
(UUID(), 'Arizona', 0),
(UUID(), 'Georgia', 1);

-- Insert into ZoneState
INSERT INTO zonestate (id, zone_id, state_id) VALUES
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone A'), (SELECT id FROM state WHERE state_name = 'California')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone B'), (SELECT id FROM state WHERE state_name = 'Texas')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone C'), (SELECT id FROM state WHERE state_name = 'Florida')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone D'), (SELECT id FROM state WHERE state_name = 'New York')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone E'), (SELECT id FROM state WHERE state_name = 'Illinois')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone F'), (SELECT id FROM state WHERE state_name = 'Nevada')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone G'), (SELECT id FROM state WHERE state_name = 'Washington')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone H'), (SELECT id FROM state WHERE state_name = 'Oregon')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone I'), (SELECT id FROM state WHERE state_name = 'Arizona')),
(UUID(), (SELECT id FROM zone WHERE zone_name = 'Zone J'), (SELECT id FROM state WHERE state_name = 'Georgia'));

-- Insert into Product
INSERT INTO product (id, name, description, gvwr, lift_capacity, lift_height, product_title, product_url, container_capacity, price, downpayment_cost, meta_title, stock_quantity) VALUES
(UUID(), 'Forklift A', 'Heavy-duty forklift.', 5000, 3000, 5.5, 'Model A Forklift', '/products/model-a', 10.5, 20000.00, 5000.00, 'Best Forklift', 50),
(UUID(), 'Forklift B', 'Compact forklift.', 4000, 2000, 4.0, 'Model B Forklift', '/products/model-b', 8.0, 15000.00, 4000.00, 'Compact Forklift', 30),
(UUID(), 'Crane C', 'Mobile crane.', 10000, 8000, 10.0, 'Crane Model C', '/products/model-c', 15.0, 50000.00, 10000.00, 'Powerful Crane', 20),
(UUID(), 'Excavator D', 'Advanced excavator.', 12000, 10000, 12.0, 'Excavator D', '/products/excavator-d', 20.0, 60000.00, 12000.00, 'Advanced Excavator', 15),
(UUID(), 'Bulldozer E', 'Efficient bulldozer.', 15000, 12000, 15.0, 'Bulldozer E', '/products/bulldozer-e', 25.0, 80000.00, 20000.00, 'Efficient Bulldozer', 10),
(UUID(), 'Forklift X', 'Lightweight forklift.', 3000, 1500, 4.0, 'Model X Forklift', '/products/model-x', 7.5, 10000.00, 3000.00, 'Economy Forklift', 40),
(UUID(), 'Crane Y', 'Heavy-duty crane.', 15000, 12000, 12.0, 'Crane Model Y', '/products/model-y', 18.0, 70000.00, 15000.00, 'Durable Crane', 25),
(UUID(), 'Excavator Z', 'Advanced excavator.', 15000, 12000, 15.0, 'Excavator Z', '/products/excavator-z', 30.0, 80000.00, 20000.00, 'Advanced Excavator Z', 10),
(UUID(), 'Bulldozer H', 'Efficient bulldozer.', 18000, 14000, 18.0, 'Bulldozer H', '/products/bulldozer-h', 35.0, 90000.00, 25000.00, 'High-Performance Bulldozer', 8),
(UUID(), 'Forklift F', 'Industrial forklift.', 6000, 3500, 6.5, 'Model F Forklift', '/products/model-f', 12.5, 25000.00, 6000.00, 'Premium Forklift', 20);

-- Insert into WebQuote
INSERT INTO webquote (id, webquote_url, stage, financing, product_id, product_name, product_price, product_qty, payment_type, product_total_cost, non_refundable_deposit, i_understand_deposit_is_non_refundable) VALUES
(UUID(), '/quotes/quote-1', 'Quote', 'cash', (SELECT id FROM product WHERE name = 'Forklift A'), 'Forklift A', 20000.00, 2, 'FullPayment', 40000.00, 5000.00, 1),
(UUID(), '/quotes/quote-2', 'Saved', 'financing', (SELECT id FROM product WHERE name = 'Crane C'), 'Crane C', 50000.00, 1, 'EMI', 50000.00, 10000.00, 1),
(UUID(), '/quotes/quote-3', 'Ordered', 'cash', (SELECT id FROM product WHERE name = 'Bulldozer E'), 'Bulldozer E', 80000.00, 1, 'FullPayment', 80000.00, 20000.00, 1),
(UUID(), '/quotes/quote-4', 'Saved', 'financing', (SELECT id FROM product WHERE name = 'Excavator D'), 'Excavator D', 60000.00, 1, 'EMI', 60000.00, 12000.00, 1),
(UUID(), '/quotes/quote-5', 'Quote', 'cash', (SELECT id FROM product WHERE name = 'Forklift B'), 'Forklift B', 15000.00, 3, 'FullPayment', 45000.00, 4000.00, 1),
(UUID(), '/quotes/quote-6', 'Saved', 'financing', (SELECT id FROM product WHERE name = 'Crane Y'), 'Crane Y', 70000.00, 1, 'EMI', 70000.00, 15000.00, 1),
(UUID(), '/quotes/quote-7', 'Ordered', 'cash', (SELECT id FROM product WHERE name = 'Forklift F'), 'Forklift F', 25000.00, 2, 'FullPayment', 50000.00, 6000.00, 1),
(UUID(), '/quotes/quote-8', 'Saved', 'financing', (SELECT id FROM product WHERE name = 'Excavator Z'), 'Excavator Z', 80000.00, 1, 'EMI', 80000.00, 20000.00, 1),
(UUID(), '/quotes/quote-9', 'Quote', 'cash', (SELECT id FROM product WHERE name = 'Forklift X'), 'Forklift X', 10000.00, 4, 'FullPayment', 40000.00, 3000.00, 1),
(UUID(), '/quotes/quote-10', 'Saved', 'financing', (SELECT id FROM product WHERE name = 'Bulldozer H'), 'Bulldozer H', 90000.00, 1, 'EMI', 90000.00, 25000.00, 1);

-- Insert into FullPayment
INSERT INTO fullpayment (id, webquote_id, payment_method, payment_status, total_payment_amount, transaction_reference) VALUES
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-1'), 'card', 'Completed', 40000.00, 'TRANS12345'),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-3'), 'card', 'Completed', 80000.00, 'TRANS12346'),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-5'), 'card', 'Pending', 45000.00, 'TRANS12347'),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-7'), 'card', 'Refunded', 50000.00, 'TRANS12348'),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-9'), 'card', 'Completed', 40000.00, 'TRANS12349');

-- Insert into EMIPlan
INSERT INTO emiplan (id, webquote_id, financing_rate_config_id, total_financed_amount, monthly_emi_amount, number_of_installments, start_date, end_date) VALUES
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-2'), UUID(), 50000.00, 5000.00, 10, NOW(), DATE_ADD(NOW(), INTERVAL 10 MONTH)),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-4'), UUID(), 60000.00, 6000.00, 10, NOW(), DATE_ADD(NOW(), INTERVAL 10 MONTH)),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-6'), UUID(), 70000.00, 7000.00, 10, NOW(), DATE_ADD(NOW(), INTERVAL 10 MONTH)),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-8'), UUID(), 80000.00, 8000.00, 10, NOW(), DATE_ADD(NOW(), INTERVAL 10 MONTH)),
(UUID(), (SELECT id FROM webquote WHERE webquote_url = '/quotes/quote-10'), UUID(), 90000.00, 9000.00, 10, NOW(), DATE_ADD(NOW(), INTERVAL 10 MONTH));













-- Insert into Zone
INSERT INTO Zone (id, zone_name, shipping_rate) VALUES
(UUID(), 'Zone A', 10.50),
(UUID(), 'Zone B', 20.00),
(UUID(), 'Zone C', 15.75),
(UUID(), 'Zone D', 25.00),
(UUID(), 'Zone E', 30.00);

-- Insert into State
INSERT INTO State (id, state_name, is_delivery_paused) VALUES
(UUID(), 'California', 0),
(UUID(), 'Texas', 1),
(UUID(), 'Florida', 0),
(UUID(), 'New York', 1),
(UUID(), 'Illinois', 0);

-- Insert into ZoneState
INSERT INTO ZoneState (id, zone_id, state_id) VALUES
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone A'), (SELECT id FROM State WHERE state_name = 'California')),
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone B'), (SELECT id FROM State WHERE state_name = 'Texas')),
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone C'), (SELECT id FROM State WHERE state_name = 'Florida')),
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone D'), (SELECT id FROM State WHERE state_name = 'New York')),
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone E'), (SELECT id FROM State WHERE state_name = 'Illinois'));

-- Insert into FirstPageForm
INSERT INTO FirstPageForm (id, first_name, last_name, company, phone_number, email, job_title, state_id, industry) VALUES
(UUID(), 'John', 'Doe', 'Tech Inc', '1234567890', 'john.doe@example.com', 'Engineer', (SELECT id FROM State WHERE state_name = 'California'), 'Technology'),
(UUID(), 'Jane', 'Smith', 'Health Co', '0987654321', 'jane.smith@example.com', 'Manager', (SELECT id FROM State WHERE state_name = 'Texas'), 'Healthcare'),
(UUID(), 'Jim', 'Beam', 'Retail LLC', '4567891230', 'jim.beam@example.com', 'Salesperson', (SELECT id FROM State WHERE state_name = 'Florida'), 'Retail'),
(UUID(), 'Alice', 'Johnson', 'Edu Ltd', '6789012345', 'alice.johnson@example.com', 'Teacher', (SELECT id FROM State WHERE state_name = 'New York'), 'Education'),
(UUID(), 'Bob', 'Williams', 'Construction Pro', '7890123456', 'bob.williams@example.com', 'Contractor', (SELECT id FROM State WHERE state_name = 'Illinois'), 'Construction');

-- Insert into Product
INSERT INTO Product (id, name, description, gvwr, lift_capacity, lift_height, product_title, product_url, container_capacity, price, downpayment_cost, meta_title, stock_quantity) VALUES
(UUID(), 'Forklift A', 'Heavy-duty forklift.', 5000, 3000, 5.5, 'Model A Forklift', '/products/model-a', 10.5, 20000.00, 5000.00, 'Best Forklift', 50),
(UUID(), 'Forklift B', 'Compact forklift.', 4000, 2000, 4.0, 'Model B Forklift', '/products/model-b', 8.0, 15000.00, 4000.00, 'Compact Forklift', 30),
(UUID(), 'Crane C', 'Mobile crane.', 10000, 8000, 10.0, 'Crane Model C', '/products/model-c', 15.0, 50000.00, 10000.00, 'Powerful Crane', 20),
(UUID(), 'Excavator D', 'Advanced excavator.', 12000, 10000, 12.0, 'Excavator D', '/products/excavator-d', 20.0, 60000.00, 12000.00, 'Advanced Excavator', 15),
(UUID(), 'Bulldozer E', 'Efficient bulldozer.', 15000, 12000, 15.0, 'Bulldozer E', '/products/bulldozer-e', 25.0, 80000.00, 20000.00, 'Efficient Bulldozer', 10);

-- Insert into ProductImage
INSERT INTO ProductImage (id, product_id, image_url, image_description, is_featured) VALUES
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift A'), '/images/forklift-a.jpg', 'Forklift A Image', 1),
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift B'), '/images/forklift-b.jpg', 'Forklift B Image', 0),
(UUID(), (SELECT id FROM Product WHERE name = 'Crane C'), '/images/crane-c.jpg', 'Crane C Image', 1),
(UUID(), (SELECT id FROM Product WHERE name = 'Excavator D'), '/images/excavator-d.jpg', 'Excavator D Image', 0),
(UUID(), (SELECT id FROM Product WHERE name = 'Bulldozer E'), '/images/bulldozer-e.jpg', 'Bulldozer E Image', 1);

-- Insert into Accessory
INSERT INTO Accessory (id, name, description, meta_title, accessory_title, accessory_url, price, stock_quantity) VALUES
(UUID(), 'Attachment X', 'Compatible with forklifts.', 'Attachment X Meta', 'Attachment X', '/accessories/attachment-x', 250.00, 40),
(UUID(), 'Attachment Y', 'Compatible with cranes.', 'Attachment Y Meta', 'Attachment Y', '/accessories/attachment-y', 300.00, 30),
(UUID(), 'Attachment Z', 'Compatible with excavators.', 'Attachment Z Meta', 'Attachment Z', '/accessories/attachment-z', 350.00, 20),
(UUID(), 'Attachment W', 'Compatible with bulldozers.', 'Attachment W Meta', 'Attachment W', '/accessories/attachment-w', 400.00, 10),
(UUID(), 'Attachment V', 'Universal attachment.', 'Attachment V Meta', 'Attachment V', '/accessories/attachment-v', 450.00, 15);

-- Insert into AccessoryProduct
INSERT INTO AccessoryProduct (id, product_id, accessory_id) VALUES
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift A'), (SELECT id FROM Accessory WHERE name = 'Attachment X')),
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift B'), (SELECT id FROM Accessory WHERE name = 'Attachment X')),
(UUID(), (SELECT id FROM Product WHERE name = 'Crane C'), (SELECT id FROM Accessory WHERE name = 'Attachment Y')),
(UUID(), (SELECT id FROM Product WHERE name = 'Excavator D'), (SELECT id FROM Accessory WHERE name = 'Attachment Z')),
(UUID(), (SELECT id FROM Product WHERE name = 'Bulldozer E'), (SELECT id FROM Accessory WHERE name = 'Attachment W'));

-- Insert into AccessoryImage
INSERT INTO AccessoryImage (id, accessory_id, image_url, image_description, is_featured) VALUES
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment X'), '/images/attachment-x.jpg', 'Attachment X Image', 1),
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment Y'), '/images/attachment-y.jpg', 'Attachment Y Image', 0),
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment Z'), '/images/attachment-z.jpg', 'Attachment Z Image', 1),
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment W'), '/images/attachment-w.jpg', 'Attachment W Image', 0),
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment V'), '/images/attachment-v.jpg', 'Attachment V Image', 1);

-- Insert into ShippingMethod
INSERT INTO ShippingMethod (id, method_type, name, description) VALUES
(UUID(), 'pickup', 'Pickup Option A', 'Pickup from warehouse A.'),
(UUID(), 'pickup', 'Pickup Option B', 'Pickup from warehouse B.'),
(UUID(), 'delivery', 'Delivery Service A', 'Delivery to Zone A.'),
(UUID(), 'delivery', 'Delivery Service B', 'Delivery to Zone B.'),
(UUID(), 'delivery', 'Delivery Service C', 'Delivery to Zone C.');

-- Insert into WebQuote
INSERT INTO WebQuote (id, webquote_url, stage, financing, product_id, product_name, product_price, product_qty, shipping_method_id, zone_id, contact_first_name, contact_last_name, contact_company_name, contact_phone_number, contact_email, contact_industry, contact_job_title, billing_same_as_delivery, billing_address_street, billing_address_city, billing_address_state, billing_address_zip_code, billing_address_country, delivery_cost, delivery_address_street, delivery_address_city, delivery_address_state_id, delivery_address_zip_code, delivery_address_country, payment_type, product_total_cost, non_refundable_deposit, i_understand_deposit_is_non_refundable) VALUES
(UUID(), '/quotes/quote-1', 'Quote', 'cash', (SELECT id FROM Product WHERE name = 'Forklift A'), 'Forklift A', 20000.00, 2, (SELECT id FROM ShippingMethod WHERE method_type = 'delivery'), (SELECT id FROM Zone WHERE zone_name = 'Zone A'), 'John', 'Doe', 'Tech Inc', '1234567890', 'john.doe@example.com', 'Technology', 'Engineer', 1, '123 Billing St', 'San Francisco', 'California', '94107', 'USA', 500.00, '456 Delivery St', 'Los Angeles', (SELECT id FROM State WHERE state_name = 'California'), '90001', 'USA', 'FullPayment', 40000.00, 5000.00, 1);
