-- DO $$ 
-- BEGIN
--     EXECUTE (
--         SELECT STRING_AGG('DROP TABLE IF EXISTS "' || tablename || '" CASCADE;', ' ')
--         FROM pg_tables
--         WHERE schemaname = 'public'
--     );
-- END $$;



-- Enums
CREATE TYPE financing AS ENUM ('cash', 'financing');
CREATE TYPE stages AS ENUM ('Quote', 'Saved', 'Ordered');
CREATE TYPE shippingmethodtype AS ENUM ('pickup', 'delivery');
CREATE TYPE paymentmethod AS ENUM ('card');
CREATE TYPE paymentstatus AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');
CREATE TYPE installmentstatus AS ENUM ('Pending', 'Paid', 'Overdue');
CREATE TYPE developmentstatus AS ENUM ('Pending', 'InProgress', 'Completed', 'Delayed');

-- Tables
CREATE TABLE Zone (
    id UUID PRIMARY KEY,
    zone_name TEXT,
    shipping_rate NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE State (
    id UUID PRIMARY KEY,
    state_name TEXT,
    is_delivery_paused BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE ZoneState (
    id UUID PRIMARY KEY,
    zone_id UUID REFERENCES Zone(id),
    state_id UUID REFERENCES State(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE FirstPageForm (
    id UUID PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone_number TEXT,
    email TEXT ,
    job_title TEXT,
    state_id UUID REFERENCES State(id),
    industry TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE Product (
    id UUID PRIMARY KEY,
    name TEXT,
    description TEXT,
    gvwr NUMERIC,
    lift_capacity NUMERIC,
    lift_height NUMERIC,
    product_title TEXT,
    product_url TEXT,
    container_capacity NUMERIC,
    price NUMERIC,
    downpayment_cost NUMERIC,
    meta_title TEXT,
    stock_quantity NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE ProductImage (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES Product(id),
    image_url TEXT,
    image_description TEXT,
    is_featured BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE Accessory (
    id UUID PRIMARY KEY,
    name TEXT,
    description TEXT,
    meta_title TEXT,
    accessory_title TEXT,
    accessory_url TEXT,
    price NUMERIC,
    stock_quantity NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE AccessoryProduct (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES Product(id),
    accessory_id UUID REFERENCES Accessory(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE AccessoryImage (
    id UUID PRIMARY KEY,
    accessory_id UUID REFERENCES Accessory(id),
    image_url TEXT,
    image_description TEXT,
    is_featured BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE ShippingMethod (
    id UUID PRIMARY KEY,
    method_type shippingmethodtype,
    name TEXT,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE WebQuote (
    id UUID PRIMARY KEY,
    webquote_url TEXT UNIQUE,
    stage stages,
    financing financing,
    product_id UUID REFERENCES Product(id),
    product_name TEXT,
    product_price NUMERIC,
    product_qty INT,
    shipping_method_id UUID REFERENCES ShippingMethod(id),
    zone_id UUID REFERENCES Zone(id),
    contact_first_name TEXT,
    contact_last_name TEXT,
    contact_company_name TEXT,
    contact_phone_number TEXT,
    contact_email TEXT,
    contact_industry TEXT,
    contact_job_title TEXT,
    billing_same_as_delivery BOOLEAN,
    billing_address_street TEXT,
    billing_address_city TEXT,
    billing_address_state TEXT,
    billing_address_zip_code TEXT,
    billing_address_country TEXT,
    delivery_cost NUMERIC,
    delivery_address_street TEXT,
    delivery_address_city TEXT,
    delivery_address_state_id UUID REFERENCES State(id),
    delivery_address_zip_code TEXT,
    delivery_address_country TEXT,
    estimated_delivery_date TIMESTAMP,
    pickup_location_name TEXT,
    pickup_location_address TEXT,
    pickup_scheduled_date TIMESTAMP,
    payment_type TEXT,
    product_total_cost NUMERIC,
    non_refundable_deposit NUMERIC,
    i_understand_deposit_is_non_refundable BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE QuoteAccessory (
    id UUID PRIMARY KEY,
    webquote_id UUID REFERENCES WebQuote(id),
    accessory_id UUID REFERENCES Accessory(id),
    accessory_name TEXT,
    quantity NUMERIC,
    unit_price NUMERIC,
    total_price NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE FullPayment (
    id UUID PRIMARY KEY,
    webquote_id UUID REFERENCES WebQuote(id),
    payment_method paymentmethod,
    payment_status paymentstatus,
    total_payment_amount NUMERIC,
    transaction_reference TEXT,
    processed_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE FinancingRateConfig (
    id UUID PRIMARY KEY,
    interest_rate NUMERIC,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE EMIPlan (
    id UUID PRIMARY KEY,
    webquote_id UUID REFERENCES WebQuote(id),
    financing_rate_config_id UUID REFERENCES FinancingRateConfig(id),
    total_financed_amount NUMERIC,
    monthly_emi_amount NUMERIC,
    number_of_installments INT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE InstallmentsTracking (
    id UUID PRIMARY KEY,
    emi_plan_id UUID REFERENCES EMIPlan(id),
    installment_number INT,
    due_date TIMESTAMP,
    amount NUMERIC,
    payment_status installmentstatus,
    payment_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE EMITransaction (
    id UUID PRIMARY KEY,
    installment_tracking_id UUID REFERENCES InstallmentsTracking(id),
    transaction_reference TEXT,
    transaction_amount NUMERIC,
    transaction_status paymentstatus,
    payment_method paymentmethod,
    processed_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE "Order"(
    id UUID PRIMARY KEY,
    webquote_id UUID REFERENCES WebQuote(id),
    order_status developmentstatus,
    estimated_completion_date TIMESTAMP,
    actual_completion_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE DevelopmentStage (
    id UUID PRIMARY KEY,
    product_order_id UUID REFERENCES "Order"(id),
    stage_name TEXT,
    stage_status developmentstatus,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    remarks TEXT,
    delay_reason TEXT,
    estimated_completion_date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);




-- Insert all data



-- Insert into Zone
INSERT INTO Zone (id, zone_name, shipping_rate, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Zone A', 10.5, NOW(), NOW()),
(gen_random_uuid(), 'Zone B', 15.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone C', 12.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone D', 20.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone E', 8.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone F', 18.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone G', 22.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone H', 25.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone I', 30.0, NOW(), NOW()),
(gen_random_uuid(), 'Zone J', 5.0, NOW(), NOW());

-- Insert into State
INSERT INTO State (id, state_name, is_delivery_paused, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'State A', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State B', TRUE, NOW(), NOW()),
(gen_random_uuid(), 'State C', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State D', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State E', TRUE, NOW(), NOW()),
(gen_random_uuid(), 'State F', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State G', TRUE, NOW(), NOW()),
(gen_random_uuid(), 'State H', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State I', FALSE, NOW(), NOW()),
(gen_random_uuid(), 'State J', TRUE, NOW(), NOW());

-- Insert into ZoneState
INSERT INTO ZoneState (id, zone_id, state_id, created_at, updated_at)
SELECT gen_random_uuid(), z.id, s.id, NOW(), NOW()
FROM (SELECT id FROM Zone LIMIT 10) z, (SELECT id FROM State LIMIT 10) s LIMIT 10;

-- Insert into FirstPageForm
INSERT INTO FirstPageForm (id, first_name, last_name, company, phone_number, email, job_title, state_id, industry, created_at, updated_at)
SELECT gen_random_uuid(), 
    'FirstName' || n, 'LastName' || n, 'Company' || n, '1234567890', 
    'email1' || n || '@example1.com', 'JobTitle' || n, s.id, 
    'Industry' || n, NOW(), NOW()
FROM generate_series(1, 10) AS n, (SELECT id FROM State LIMIT 10) s LIMIT 10;

-- Insert into Product
INSERT INTO Product (id, name, description, gvwr, lift_capacity, lift_height, product_title, product_url, container_capacity, price, downpayment_cost, meta_title, stock_quantity, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Product A', 'Description A', 1000, 500, 15, 'Title A', '/product-a', 100, 10000, 2000, 'Meta A', 10, NOW(), NOW()),
(gen_random_uuid(), 'Product B', 'Description B', 2000, 800, 20, 'Title B', '/product-b', 150, 15000, 3000, 'Meta B', 5, NOW(), NOW()),
(gen_random_uuid(), 'Product C', 'Description C', 3000, 1000, 25, 'Title C', '/product-c', 200, 20000, 4000, 'Meta C', 8, NOW(), NOW()),
(gen_random_uuid(), 'Product D', 'Description D', 4000, 1200, 30, 'Title D', '/product-d', 250, 25000, 5000, 'Meta D', 2, NOW(), NOW()),
(gen_random_uuid(), 'Product E', 'Description E', 5000, 1500, 35, 'Title E', '/product-e', 300, 30000, 6000, 'Meta E', 1, NOW(), NOW()),
(gen_random_uuid(), 'Product F', 'Description F', 6000, 1800, 40, 'Title F', '/product-f', 350, 35000, 7000, 'Meta F', 4, NOW(), NOW()),
(gen_random_uuid(), 'Product G', 'Description G', 7000, 2000, 45, 'Title G', '/product-g', 400, 40000, 8000, 'Meta G', 3, NOW(), NOW()),
(gen_random_uuid(), 'Product H', 'Description H', 8000, 2200, 50, 'Title H', '/product-h', 450, 45000, 9000, 'Meta H', 6, NOW(), NOW()),
(gen_random_uuid(), 'Product I', 'Description I', 9000, 2500, 55, 'Title I', '/product-i', 500, 50000, 10000, 'Meta I', 9, NOW(), NOW()),
(gen_random_uuid(), 'Product J', 'Description J', 10000, 2800, 60, 'Title J', '/product-j', 550, 55000, 11000, 'Meta J', 7, NOW(), NOW());

-- Insert into ProductImage
INSERT INTO ProductImage (id, product_id, image_url, image_description, is_featured, created_at, updated_at)
SELECT gen_random_uuid(), p.id, 
    'https://example.com/image' || n, 'Image Description ' || n, 
    (n % 2 = 0), NOW(), NOW()
FROM generate_series(1, 10) AS n, (SELECT id FROM Product LIMIT 10) p LIMIT 10;

-- Insert into Accessory
INSERT INTO Accessory (id, name, description, meta_title, accessory_title, accessory_url, price, stock_quantity, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'Accessory A', 'Description A', 'Meta A', 'Title A', '/accessory-a', 100.0, 10, NOW(), NOW()),
(gen_random_uuid(), 'Accessory B', 'Description B', 'Meta B', 'Title B', '/accessory-b', 150.0, 5, NOW(), NOW()),
(gen_random_uuid(), 'Accessory C', 'Description C', 'Meta C', 'Title C', '/accessory-c', 200.0, 8, NOW(), NOW()),
(gen_random_uuid(), 'Accessory D', 'Description D', 'Meta D', 'Title D', '/accessory-d', 250.0, 2, NOW(), NOW()),
(gen_random_uuid(), 'Accessory E', 'Description E', 'Meta E', 'Title E', '/accessory-e', 300.0, 1, NOW(), NOW()),
(gen_random_uuid(), 'Accessory F', 'Description F', 'Meta F', 'Title F', '/accessory-f', 350.0, 4, NOW(), NOW()),
(gen_random_uuid(), 'Accessory G', 'Description G', 'Meta G', 'Title G', '/accessory-g', 400.0, 3, NOW(), NOW()),
(gen_random_uuid(), 'Accessory H', 'Description H', 'Meta H', 'Title H', '/accessory-h', 450.0, 6, NOW(), NOW()),
(gen_random_uuid(), 'Accessory I', 'Description I', 'Meta I', 'Title I', '/accessory-i', 500.0, 9, NOW(), NOW()),
(gen_random_uuid(), 'Accessory J', 'Description J', 'Meta J', 'Title J', '/accessory-j', 550.0, 7, NOW(), NOW());

-- Insert into AccessoryProduct
INSERT INTO AccessoryProduct (id, product_id, accessory_id, created_at, updated_at)
SELECT gen_random_uuid(), p.id, a.id, NOW(), NOW()
FROM (SELECT id FROM Product LIMIT 10) p, (SELECT id FROM Accessory LIMIT 10) a LIMIT 10;

-- Insert into AccessoryImage
INSERT INTO AccessoryImage (id, accessory_id, image_url, image_description, is_featured, created_at, updated_at)
SELECT gen_random_uuid(), a.id, 
    'https://example.com/image' || n, 'Image Description ' || n, 
    (n % 2 = 0), NOW(), NOW()
FROM generate_series(1, 10) AS n, (SELECT id FROM Accessory LIMIT 10) a LIMIT 10;

-- Insert into ShippingMethod
INSERT INTO ShippingMethod (id, method_type, name, description, created_at, updated_at)
VALUES 
(gen_random_uuid(), 'pickup', 'Pickup A', 'Description A', NOW(), NOW()),
(gen_random_uuid(), 'delivery', 'Delivery A', 'Description B', NOW(), NOW()),
(gen_random_uuid(), 'pickup', 'Pickup B', 'Description C', NOW(), NOW()),
(gen_random_uuid(), 'delivery', 'Delivery B', 'Description D', NOW(), NOW()),
(gen_random_uuid(), 'pickup', 'Pickup C', 'Description E', NOW(), NOW()),
(gen_random_uuid(), 'delivery', 'Delivery C', 'Description F', NOW(), NOW()),
(gen_random_uuid(), 'pickup', 'Pickup D', 'Description G', NOW(), NOW()),
(gen_random_uuid(), 'delivery', 'Delivery D', 'Description H', NOW(), NOW()),
(gen_random_uuid(), 'pickup', 'Pickup E', 'Description I', NOW(), NOW()),
(gen_random_uuid(), 'delivery', 'Delivery E', 'Description J', NOW(), NOW());


INSERT INTO WebQuote (
    id, webquote_url, stage, financing, product_id, product_name, product_price, product_qty,
    shipping_method_id, zone_id, contact_first_name, contact_last_name, contact_company_name,
    contact_phone_number, contact_email, contact_industry, contact_job_title, billing_same_as_delivery,
    billing_address_street, billing_address_city, billing_address_state, billing_address_zip_code, billing_address_country,
    delivery_cost, delivery_address_street, delivery_address_city, delivery_address_state_id, delivery_address_zip_code,
    delivery_address_country, estimated_delivery_date, pickup_location_name, pickup_location_address, pickup_scheduled_date,
    payment_type, product_total_cost, non_refundable_deposit, i_understand_deposit_is_non_refundable,
    created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    'https://example.com/webquote/' || n,
    'Quote',
    'cash',
    p.id,
    p.name,
    p.price,
    1,
    sm.id,
    z.id,
    'FirstName' || n,
    'LastName' || n,
    'Company ' || n,
    '123456789' || n,
    'email' || n || '@example.com',
    'Industry' || n,
    'JobTitle ' || n,
    TRUE,
    'Billing Street ' || n,
    'Billing City ' || n,
    'Billing State ' || n,
    '1234' || n,
    'Country ' || n,
    50.0 + n,
    'Delivery Street ' || n,
    'Delivery City ' || n,
    s.id,
    '5678' || n,
    'Delivery Country ' || n,
    NOW() + (n || ' days')::interval,
    'Pickup Location ' || n,
    'Pickup Address ' || n,
    NOW() + (n || ' days')::interval,
    'FullPayment',
    p.price + 500,
    200.0,
    TRUE,
    NOW(),
    NOW()
FROM 
    generate_series(1, 10) AS n,
    (SELECT id, name, price FROM Product LIMIT 1) p,
    (SELECT id FROM ShippingMethod LIMIT 1) sm,
    (SELECT id FROM Zone LIMIT 1) z,
    (SELECT id FROM State LIMIT 1) s;

INSERT INTO QuoteAccessory (
    id, webquote_id, accessory_id, accessory_name, quantity, unit_price, total_price, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    w.id,
    a.id,
    a.name,
    1,
    a.price,
    a.price * 1,
    NOW(),
    NOW()
FROM 
    (SELECT id FROM WebQuote LIMIT 10) w,
    (SELECT id, name, price FROM Accessory LIMIT 10) a;

INSERT INTO FullPayment (
    id, webquote_id, payment_method, payment_status, total_payment_amount, transaction_reference, processed_at, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    w.id,
    'card',
    'Completed',
    5000.0,
    'TRANS' || w.id,
    NOW(),
    NOW(),
    NOW()
FROM 
    (SELECT id FROM WebQuote LIMIT 10) w;
INSERT INTO FinancingRateConfig (id, interest_rate, created_at, updated_at)
VALUES 
(gen_random_uuid(), 5.0, NOW(), NOW()),
(gen_random_uuid(), 6.5, NOW(), NOW()),
(gen_random_uuid(), 7.0, NOW(), NOW()),
(gen_random_uuid(), 7.5, NOW(), NOW()),
(gen_random_uuid(), 8.0, NOW(), NOW()),
(gen_random_uuid(), 8.5, NOW(), NOW()),
(gen_random_uuid(), 9.0, NOW(), NOW()),
(gen_random_uuid(), 9.5, NOW(), NOW()),
(gen_random_uuid(), 10.0, NOW(), NOW()),
(gen_random_uuid(), 10.5, NOW(), NOW());

INSERT INTO EMIPlan (
    id, webquote_id, financing_rate_config_id, total_financed_amount, monthly_emi_amount, number_of_installments,
    start_date, end_date, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    w.id,
    f.id,
    10000.0,
    1000.0,
    10,
    NOW(),
    NOW() + INTERVAL '10 months',
    NOW(),
    NOW()
FROM 
    (SELECT id FROM WebQuote LIMIT 10) w,
    (SELECT id FROM FinancingRateConfig LIMIT 10) f;

INSERT INTO InstallmentsTracking (
    id, emi_plan_id, installment_number, due_date, amount, payment_status, payment_date, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    e.id,
    n,
    NOW() + (n || ' months')::interval,
    1000.0,
    'Pending',
    NULL,
    NOW(),
    NOW()
FROM 
    generate_series(1, 10) AS n,
    (SELECT id FROM EMIPlan LIMIT 10) e;
INSERT INTO EMITransaction (
    id, installment_tracking_id, transaction_reference, transaction_amount, transaction_status, payment_method, processed_at, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    i.id,
    'TRANS' || i.id,
    i.amount,
    'Pending',
    'card',
    NOW(),
    NOW(),
    NOW()
FROM 
    (SELECT id, amount FROM InstallmentsTracking LIMIT 10) i;

INSERT INTO "Order" (
    id, webquote_id, order_status, estimated_completion_date, actual_completion_date, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    w.id,
    'InProgress',
    NOW() + INTERVAL '30 days',
    NULL,
    NOW(),
    NOW()
FROM 
    (SELECT id FROM WebQuote LIMIT 10) w;
INSERT INTO DevelopmentStage (
    id, product_order_id, stage_name, stage_status, started_at, completed_at, remarks, delay_reason, estimated_completion_date, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    o.id,
    'Stage ' || n,
    'Pending',
    NOW(),
    NULL,
    'No remarks',
    NULL,
    NOW() + (n || ' days')::interval,
    NOW(),
    NOW()
FROM 
    generate_series(1, 10) AS n,
    (SELECT id FROM "Order" LIMIT 10) o;
