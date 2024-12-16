



CREATE TABLE Zone (
    id CHAR(36) PRIMARY KEY,
    zone_name TEXT,
    shipping_rate DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE State (
    id CHAR(36) PRIMARY KEY,
    state_name TEXT,
    is_delivery_paused TINYINT(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ZoneState (
    id CHAR(36) PRIMARY KEY,
    zone_id CHAR(36),
    state_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (zone_id) REFERENCES Zone(id),
    FOREIGN KEY (state_id) REFERENCES State(id)
);

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

CREATE TABLE AccessoryProduct (
    id CHAR(36) PRIMARY KEY,
    product_id CHAR(36),
    accessory_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(id),
    FOREIGN KEY (accessory_id) REFERENCES Accessory(id)
);

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

CREATE TABLE ShippingMethod (
    id CHAR(36) PRIMARY KEY,
    method_type ENUM('pickup', 'delivery'),
    name TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
    payment_type TEXT,
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
);

CREATE TABLE FinancingRateConfig (
    id CHAR(36) PRIMARY KEY,
    interest_rate DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
    FOREIGN KEY (webquote_id) REFERENCES WebQuote(id),
    FOREIGN KEY (financing_rate_config_id) REFERENCES FinancingRateConfig(id)
);

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




-- Insert data into Zone
INSERT INTO Zone (id, zone_name, shipping_rate) 
VALUES 
(UUID(), 'Zone A', 10.50),
(UUID(), 'Zone B', 15.75);

-- Insert data into State
INSERT INTO State (id, state_name, is_delivery_paused) 
VALUES 
(UUID(), 'California', 0),
(UUID(), 'Texas', 1);

-- Insert data into ZoneState
INSERT INTO ZoneState (id, zone_id, state_id)
VALUES 
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone A'), (SELECT id FROM State WHERE state_name = 'California')),
(UUID(), (SELECT id FROM Zone WHERE zone_name = 'Zone B'), (SELECT id FROM State WHERE state_name = 'Texas'));

-- Insert data into FirstPageForm
INSERT INTO FirstPageForm (id, first_name, last_name, company, phone_number, email, job_title, state_id, industry)
VALUES 
(UUID(), 'John', 'Doe', 'Tech Co', '1234567890', 'john.doe@example.com', 'Engineer', (SELECT id FROM State WHERE state_name = 'California'), 'Technology'),
(UUID(), 'Jane', 'Smith', 'Health Inc', '0987654321', 'jane.smith@example.com', 'Manager', (SELECT id FROM State WHERE state_name = 'Texas'), 'Healthcare');

-- Insert data into Product
INSERT INTO Product (id, name, description, gvwr, lift_capacity, lift_height, product_title, product_url, container_capacity, price, downpayment_cost, meta_title, stock_quantity)
VALUES 
(UUID(), 'Forklift Model A', 'A powerful forklift.', 5000, 3000, 5.5, 'Model A Forklift', '/products/model-a', 10.5, 20000.00, 5000.00, 'Best Forklift', 100),
(UUID(), 'Forklift Model B', 'A compact forklift.', 4000, 2000, 4.0, 'Model B Forklift', '/products/model-b', 8.0, 15000.00, 4000.00, 'Compact Forklift', 50);

-- Insert data into ProductImage
INSERT INTO ProductImage (id, product_id, image_url, image_description, is_featured)
VALUES 
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift Model A'), '/images/model-a.jpg', 'Model A Image', 1),
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift Model B'), '/images/model-b.jpg', 'Model B Image', 0);

-- Insert data into Accessory
INSERT INTO Accessory (id, name, description, meta_title, accessory_title, accessory_url, price, stock_quantity)
VALUES 
(UUID(), 'Attachment A', 'An attachment for forklifts.', 'Forklift Attachment', 'Attachment A', '/accessories/attachment-a', 200.00, 50),
(UUID(), 'Attachment B', 'A different attachment.', 'Forklift Attachment B', 'Attachment B', '/accessories/attachment-b', 250.00, 30);

-- Insert data into AccessoryProduct
INSERT INTO AccessoryProduct (id, product_id, accessory_id)
VALUES 
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift Model A'), (SELECT id FROM Accessory WHERE name = 'Attachment A')),
(UUID(), (SELECT id FROM Product WHERE name = 'Forklift Model B'), (SELECT id FROM Accessory WHERE name = 'Attachment B'));

-- Insert data into AccessoryImage
INSERT INTO AccessoryImage (id, accessory_id, image_url, image_description, is_featured)
VALUES 
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment A'), '/images/attachment-a.jpg', 'Attachment A Image', 1),
(UUID(), (SELECT id FROM Accessory WHERE name = 'Attachment B'), '/images/attachment-b.jpg', 'Attachment B Image', 0);

-- Insert data into ShippingMethod
INSERT INTO ShippingMethod (id, method_type, name, description)
VALUES 
(UUID(), 'pickup', 'Pickup Service', 'Customer pickup available.'),
(UUID(), 'delivery', 'Delivery Service', 'Home delivery available.');

-- Insert data into WebQuote
INSERT INTO WebQuote (id, webquote_url, stage, financing, product_id, product_name, product_price, product_qty, shipping_method_id, zone_id, contact_first_name, contact_last_name, contact_company_name, contact_phone_number, contact_email, contact_industry, contact_job_title, billing_same_as_delivery, billing_address_street, billing_address_city, billing_address_state, billing_address_zip_code, billing_address_country, delivery_cost, delivery_address_street, delivery_address_city, delivery_address_state_id, delivery_address_zip_code, delivery_address_country, payment_type, product_total_cost, non_refundable_deposit, i_understand_deposit_is_non_refundable)
VALUES 
(UUID(), '/quotes/quote-1', 'Quote', 'cash', (SELECT id FROM Product WHERE name = 'Forklift Model A'), 'Forklift Model A', 20000.00, 2, (SELECT id FROM ShippingMethod WHERE method_type = 'delivery'), (SELECT id FROM Zone WHERE zone_name = 'Zone A'), 'John', 'Doe', 'Tech Co', '1234567890', 'john.doe@example.com', 'Technology', 'Engineer', 1, '123 Billing St', 'San Francisco', 'California', '94107', 'USA', 500.00, '456 Delivery St', 'Los Angeles', (SELECT id FROM State WHERE state_name = 'California'), '90001', 'USA', 'FullPayment', 40000.00, 5000.00, 1);

-- Insert data into QuoteAccessory
INSERT INTO QuoteAccessory (id, webquote_id, accessory_id, accessory_name, quantity, unit_price, total_price)
VALUES 
(UUID(), (SELECT id FROM WebQuote WHERE webquote_url = '/quotes/quote-1'), (SELECT id FROM Accessory WHERE name = 'Attachment A'), 'Attachment A', 2, 200.00, 400.00);

-- Insert data into FullPayment
INSERT INTO FullPayment (id, webquote_id, payment_method, payment_status, total_payment_amount, transaction_reference)
VALUES 
(UUID(), (SELECT id FROM WebQuote WHERE webquote_url = '/quotes/quote-1'), 'card', 'Completed', 40500.00, 'TRX123456');

-- Insert data into FinancingRateConfig
INSERT INTO FinancingRateConfig (id, interest_rate)
VALUES 
(UUID(), 5.0);

-- Insert data into EMIPlan
INSERT INTO EMIPlan (id, webquote_id, financing_rate_config_id, total_financed_amount, monthly_emi_amount, number_of_installments, start_date, end_date)
VALUES 
(UUID(), (SELECT id FROM WebQuote WHERE webquote_url = '/quotes/quote-1'), (SELECT id FROM FinancingRateConfig), 20000.00, 500.00, 40, NOW(), DATE_ADD(NOW(), INTERVAL 40 MONTH));

-- Insert data into InstallmentsTracking
INSERT INTO InstallmentsTracking (id, emi_plan_id, installment_number, due_date, amount, payment_status)
VALUES 
(UUID(), (SELECT id FROM EMIPlan), 1, DATE_ADD(NOW(), INTERVAL 1 MONTH), 500.00, 'Pending');

-- Insert data into EMITransaction
INSERT INTO EMITransaction (id, installment_tracking_id, transaction_reference, transaction_amount, transaction_status, payment_method)
VALUES 
(UUID(), (SELECT id FROM InstallmentsTracking), 'TRX789123', 500.00, 'Completed', 'card');

-- Insert data into Order
INSERT INTO `Order` (id, webquote_id, order_status, estimated_completion_date, actual_completion_date)
VALUES 
(UUID(), (SELECT id FROM WebQuote WHERE webquote_url = '/quotes/quote-1'), 'InProgress', DATE_ADD(NOW(), INTERVAL 2 MONTH), NULL);

-- Insert data into DevelopmentStage
INSERT INTO DevelopmentStage (id, product_order_id, stage_name, stage_status, started_at, estimated_completion_date)
VALUES 
(UUID(), (SELECT id FROM `Order`), 'Assembly', 'Pending', NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH));

