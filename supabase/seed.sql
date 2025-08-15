-- Seed procurement_orders table with realistic 3-year data
INSERT INTO public.procurement_orders (order_date, vendor_name, category, region, item_name, quantity, unit_price, total_amount, contract_type, delivery_score) VALUES

-- Office Supplies - Multiple vendors with price variance
('2022-01-15', 'OfficeMax Pro', 'Office Supplies', 'North America', 'Laser Printer Paper (500 sheets)', 100, 8.50, 850.00, 'contract', 4.5),
('2022-01-20', 'Staples Business', 'Office Supplies', 'North America', 'Laser Printer Paper (500 sheets)', 150, 9.25, 1387.50, 'maverick', 4.2),
('2022-02-03', 'Office Depot Corp', 'Office Supplies', 'Europe', 'Laser Printer Paper (500 sheets)', 80, 10.00, 800.00, 'contract', 4.0),
('2022-02-10', 'Global Paper Solutions', 'Office Supplies', 'Asia Pacific', 'Laser Printer Paper (500 sheets)', 200, 7.75, 1550.00, 'contract', 4.8),

-- IT Hardware - High variance items
('2022-01-05', 'Dell Technologies', 'IT Hardware', 'North America', 'Business Laptop i7 16GB', 25, 1200.00, 30000.00, 'contract', 4.7),
('2022-01-12', 'HP Enterprise', 'IT Hardware', 'Europe', 'Business Laptop i7 16GB', 30, 1350.00, 40500.00, 'contract', 4.4),
('2022-01-18', 'Lenovo Corporate', 'IT Hardware', 'Asia Pacific', 'Business Laptop i7 16GB', 20, 1150.00, 23000.00, 'contract', 4.6),
('2022-02-22', 'TechSource Direct', 'IT Hardware', 'North America', 'Business Laptop i7 16GB', 15, 1450.00, 21750.00, 'maverick', 3.8),

-- Facilities Management
('2022-01-08', 'Johnson Controls', 'Facilities', 'North America', 'HVAC Maintenance Contract', 1, 15000.00, 15000.00, 'contract', 4.3),
('2022-01-25', 'Honeywell Building', 'Facilities', 'Europe', 'HVAC Maintenance Contract', 1, 18500.00, 18500.00, 'contract', 4.1),
('2022-02-14', 'Siemens Facility Services', 'Facilities', 'Asia Pacific', 'HVAC Maintenance Contract', 1, 12000.00, 12000.00, 'contract', 4.5),

-- Marketing Materials
('2022-01-30', 'VistaPrint Business', 'Marketing', 'North America', 'Business Cards (1000 pack)', 50, 45.00, 2250.00, 'contract', 4.2),
('2022-02-05', 'Moo Professional', 'Marketing', 'Europe', 'Business Cards (1000 pack)', 40, 55.00, 2200.00, 'maverick', 4.0),
('2022-02-18', 'PrintPapa Corp', 'Marketing', 'North America', 'Business Cards (1000 pack)', 60, 38.00, 2280.00, 'contract', 4.4),

-- Travel Services
('2022-01-10', 'American Express GBT', 'Travel', 'Global', 'Corporate Travel Management', 1, 25000.00, 25000.00, 'contract', 4.6),
('2022-02-01', 'Concur Travel', 'Travel', 'Global', 'Travel Expense Software', 1, 18000.00, 18000.00, 'contract', 4.3),
('2022-02-28', 'BCD Travel', 'Travel', 'Europe', 'Event Management Services', 1, 12500.00, 12500.00, 'maverick', 3.9),

-- Professional Services
('2022-01-16', 'Deloitte Consulting', 'Professional Services', 'North America', 'Management Consulting', 1, 75000.00, 75000.00, 'contract', 4.8),
('2022-02-08', 'McKinsey & Company', 'Professional Services', 'Europe', 'Strategy Consulting', 1, 85000.00, 85000.00, 'contract', 4.9),
('2022-02-20', 'PwC Advisory', 'Professional Services', 'Asia Pacific', 'Digital Transformation', 1, 65000.00, 65000.00, 'contract', 4.5),

-- Manufacturing Equipment
('2022-01-28', 'Caterpillar Industrial', 'Manufacturing', 'North America', 'Forklift 5000lb Capacity', 5, 35000.00, 175000.00, 'contract', 4.4),
('2022-02-12', 'Toyota Material Handling', 'Manufacturing', 'Asia Pacific', 'Forklift 5000lb Capacity', 3, 38000.00, 114000.00, 'contract', 4.7),
('2022-02-25', 'Crown Equipment', 'Manufacturing', 'Europe', 'Forklift 5000lb Capacity', 4, 36500.00, 146000.00, 'maverick', 4.1),

-- Security Services
('2022-01-22', 'Securitas Security', 'Security', 'North America', 'Physical Security Guards', 12, 4500.00, 54000.00, 'contract', 4.2),
('2022-02-15', 'G4S Secure Solutions', 'Security', 'Europe', 'Physical Security Guards', 10, 5200.00, 52000.00, 'contract', 4.0),
('2022-02-27', 'Allied Universal', 'Security', 'North America', 'Physical Security Guards', 8, 4800.00, 38400.00, 'maverick', 3.7),

-- 2021 Data - More entries for comprehensive analysis
('2021-03-10', 'OfficeMax Pro', 'Office Supplies', 'North America', 'Laser Printer Paper (500 sheets)', 120, 8.25, 990.00, 'contract', 4.4),
('2021-03-15', 'Staples Business', 'Office Supplies', 'Europe', 'Laser Printer Paper (500 sheets)', 90, 9.50, 855.00, 'maverick', 4.1),
('2021-04-22', 'Global Paper Solutions', 'Office Supplies', 'Asia Pacific', 'Laser Printer Paper (500 sheets)', 180, 7.60, 1368.00, 'contract', 4.9),

('2021-03-05', 'Dell Technologies', 'IT Hardware', 'North America', 'Business Laptop i7 16GB', 35, 1180.00, 41300.00, 'contract', 4.6),
('2021-04-18', 'HP Enterprise', 'IT Hardware', 'Europe', 'Business Laptop i7 16GB', 25, 1320.00, 33000.00, 'contract', 4.3),
('2021-05-12', 'TechSource Direct', 'IT Hardware', 'North America', 'Business Laptop i7 16GB', 18, 1420.00, 25560.00, 'maverick', 3.9),

('2021-06-08', 'Johnson Controls', 'Facilities', 'North America', 'HVAC Maintenance Contract', 1, 14500.00, 14500.00, 'contract', 4.2),
('2021-07-20', 'Honeywell Building', 'Facilities', 'Europe', 'HVAC Maintenance Contract', 1, 17800.00, 17800.00, 'contract', 4.0),

('2021-08-15', 'VistaPrint Business', 'Marketing', 'North America', 'Business Cards (1000 pack)', 45, 42.00, 1890.00, 'contract', 4.3),
('2021-09-22', 'Moo Professional', 'Marketing', 'Europe', 'Business Cards (1000 pack)', 35, 52.00, 1820.00, 'maverick', 4.1),

('2021-10-10', 'American Express GBT', 'Travel', 'Global', 'Corporate Travel Management', 1, 23000.00, 23000.00, 'contract', 4.5),
('2021-11-18', 'Concur Travel', 'Travel', 'Global', 'Travel Expense Software', 1, 16500.00, 16500.00, 'contract', 4.2),

('2021-12-05', 'Deloitte Consulting', 'Professional Services', 'North America', 'Management Consulting', 1, 72000.00, 72000.00, 'contract', 4.7),
('2021-12-20', 'McKinsey & Company', 'Professional Services', 'Europe', 'Strategy Consulting', 1, 82000.00, 82000.00, 'contract', 4.8),

-- 2020 Data
('2020-01-15', 'OfficeMax Pro', 'Office Supplies', 'North America', 'Laser Printer Paper (500 sheets)', 110, 8.00, 880.00, 'contract', 4.3),
('2020-02-28', 'Staples Business', 'Office Supplies', 'Europe', 'Laser Printer Paper (500 sheets)', 85, 9.00, 765.00, 'maverick', 4.0),
('2020-03-12', 'Global Paper Solutions', 'Office Supplies', 'Asia Pacific', 'Laser Printer Paper (500 sheets)', 160, 7.50, 1200.00, 'contract', 4.8),

('2020-04-20', 'Dell Technologies', 'IT Hardware', 'North America', 'Business Laptop i7 16GB', 40, 1150.00, 46000.00, 'contract', 4.5),
('2020-05-15', 'HP Enterprise', 'IT Hardware', 'Europe', 'Business Laptop i7 16GB', 30, 1280.00, 38400.00, 'contract', 4.2),
('2020-06-10', 'Lenovo Corporate', 'IT Hardware', 'Asia Pacific', 'Business Laptop i7 16GB', 22, 1100.00, 24200.00, 'contract', 4.7),

('2020-07-08', 'Johnson Controls', 'Facilities', 'North America', 'HVAC Maintenance Contract', 1, 14000.00, 14000.00, 'contract', 4.1),
('2020-08-25', 'Honeywell Building', 'Facilities', 'Europe', 'HVAC Maintenance Contract', 1, 17200.00, 17200.00, 'contract', 3.9),

('2020-09-12', 'VistaPrint Business', 'Marketing', 'North America', 'Business Cards (1000 pack)', 40, 40.00, 1600.00, 'contract', 4.2),
('2020-10-30', 'Moo Professional', 'Marketing', 'Europe', 'Business Cards (1000 pack)', 30, 50.00, 1500.00, 'maverick', 4.0),

('2020-11-15', 'American Express GBT', 'Travel', 'Global', 'Corporate Travel Management', 1, 22000.00, 22000.00, 'contract', 4.4),
('2020-12-22', 'Concur Travel', 'Travel', 'Global', 'Travel Expense Software', 1, 15000.00, 15000.00, 'contract', 4.1),

-- Additional vendors and items for more comprehensive data
('2022-03-01', 'Microsoft Corporation', 'IT Software', 'Global', 'Office 365 Enterprise Licenses', 500, 22.00, 11000.00, 'contract', 4.8),
('2022-03-15', 'Adobe Systems', 'IT Software', 'North America', 'Creative Cloud Licenses', 100, 52.99, 5299.00, 'contract', 4.6),
('2022-04-10', 'Salesforce Inc', 'IT Software', 'Global', 'CRM Platform Licenses', 200, 150.00, 30000.00, 'contract', 4.7),

('2022-05-12', 'Amazon Web Services', 'Cloud Services', 'Global', 'Cloud Computing Services', 1, 8500.00, 8500.00, 'contract', 4.9),
('2022-05-20', 'Google Cloud Platform', 'Cloud Services', 'Global', 'Cloud Storage Services', 1, 6200.00, 6200.00, 'maverick', 4.5),
('2022-06-08', 'Microsoft Azure', 'Cloud Services', 'Global', 'Cloud Infrastructure', 1, 7800.00, 7800.00, 'contract', 4.7),

-- More office supplies with price variance
('2022-07-15', 'Pen Warehouse', 'Office Supplies', 'North America', 'Blue Ballpoint Pens (12 pack)', 200, 3.50, 700.00, 'contract', 4.1),
('2022-07-22', 'BIC Corporate', 'Office Supplies', 'Europe', 'Blue Ballpoint Pens (12 pack)', 150, 4.25, 637.50, 'maverick', 3.9),
('2022-08-10', 'Pilot Pen Company', 'Office Supplies', 'Asia Pacific', 'Blue Ballpoint Pens (12 pack)', 180, 3.75, 675.00, 'contract', 4.3),

-- Telecommunications
('2022-09-05', 'Verizon Business', 'Telecommunications', 'North America', 'Corporate Mobile Plans', 300, 45.00, 13500.00, 'contract', 4.4),
('2022-09-18', 'AT&T Business', 'Telecommunications', 'North America', 'Corporate Mobile Plans', 250, 48.00, 12000.00, 'maverick', 4.1),
('2022-10-12', 'T-Mobile Business', 'Telecommunications', 'North America', 'Corporate Mobile Plans', 200, 42.00, 8400.00, 'contract', 4.5);