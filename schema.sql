-- ========================================
-- WASHFLOW CAR WASH BOOKING SYSTEM
-- Complete Database Schema with Membership
-- Version 2.0 - Fixed Ambiguous Column
-- ========================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+07:00';

-- ========================================
-- DROP TABLES (ลำดับจากลูกไปแม่)
-- ========================================
DROP TABLE IF EXISTS service_detail;
DROP TABLE IF EXISTS service;
DROP TABLE IF EXISTS receipt;
DROP TABLE IF EXISTS point_redemption;
DROP TABLE IF EXISTS point_transaction;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS vehicle_type;
DROP TABLE IF EXISTS membership;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS employee_position;
DROP TABLE IF EXISTS branch;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS membership_tier;
DROP TABLE IF EXISTS service_type;

-- ========================================
-- 1. BRANCH
-- ========================================
CREATE TABLE branch (
    branch_ID INT PRIMARY KEY AUTO_INCREMENT,
    branch_name VARCHAR(100) NOT NULL,
    branch_address VARCHAR(255) NOT NULL,
    branch_tel VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 2. MEMBERSHIP_TIER (ต้องสร้างก่อน customer)
-- ========================================
CREATE TABLE membership_tier (
    tier_ID INT PRIMARY KEY AUTO_INCREMENT,
    tier_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Bronze, Silver, Gold, Platinum',
    tier_color VARCHAR(20) NOT NULL COMMENT 'Hex color code',
    tier_icon VARCHAR(50) DEFAULT '🏆' COMMENT 'Emoji icon',
    tier_order INT NOT NULL UNIQUE COMMENT 'Order: 1=Bronze, 2=Silver...',
    
    -- Requirements
    min_points INT DEFAULT 0 NOT NULL COMMENT 'แต้มขั้นต่ำ',
    min_spent DECIMAL(10,2) DEFAULT 0.00 NOT NULL COMMENT 'ยอดใช้จ่ายขั้นต่ำ',
    
    -- Benefits
    discount_percent DECIMAL(5,2) DEFAULT 0.00 NOT NULL COMMENT 'ส่วนลด %',
    points_multiplier DECIMAL(3,2) DEFAULT 1.00 NOT NULL COMMENT 'ตัวคูณ point',
    benefits TEXT COMMENT 'JSON array of benefits',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_tier_order (tier_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 3. CUSTOMER (with Membership)
-- ========================================
CREATE TABLE customer (
    cust_ID INT PRIMARY KEY AUTO_INCREMENT,
    cust_fname VARCHAR(100) NOT NULL,
    cust_lname VARCHAR(100) NOT NULL,
    cust_tel VARCHAR(20) NOT NULL, 
    cust_address VARCHAR(255),
    cust_username VARCHAR(50) NOT NULL UNIQUE,
    cust_password VARCHAR(255) NOT NULL,
    
    -- Membership Fields
    membership_tier_ID INT DEFAULT 1 COMMENT 'FK to membership_tier',
    total_points INT DEFAULT 0 NOT NULL COMMENT 'คะแนนสะสมทั้งหมด',
    available_points INT DEFAULT 0 NOT NULL COMMENT 'คะแนนที่ใช้ได้',
    total_spent DECIMAL(10,2) DEFAULT 0.00 NOT NULL COMMENT 'ยอดใช้จ่ายรวม',
    last_tier_check TIMESTAMP NULL COMMENT 'เช็ค tier ครั้งล่าสุด',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (membership_tier_ID) REFERENCES membership_tier(tier_ID),
    
    INDEX idx_username (cust_username),
    INDEX idx_tier (membership_tier_ID),
    INDEX idx_points (total_points),
    INDEX idx_spent (total_spent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 4. EMPLOYEE_POSITION
-- ========================================
CREATE TABLE employee_position (
    pos_ID INT PRIMARY KEY AUTO_INCREMENT,
    pos_name VARCHAR(100) NOT NULL UNIQUE,
    pos_salary DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 5. EMPLOYEE
-- ========================================
CREATE TABLE employee (
    emp_ID INT PRIMARY KEY AUTO_INCREMENT,
    emp_fname VARCHAR(100) NOT NULL,
    emp_lname VARCHAR(100) NOT NULL,
    emp_address VARCHAR(255),
    emp_username VARCHAR(50) NOT NULL UNIQUE,
    emp_password VARCHAR(255) NOT NULL,
    branch_ID INT NOT NULL,
    pos_ID INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE COMMENT 'สถานะพนักงาน',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (branch_ID) REFERENCES branch(branch_ID),
    FOREIGN KEY (pos_ID) REFERENCES employee_position(pos_ID),
    
    INDEX idx_username (emp_username),
    INDEX idx_active (is_active),
    INDEX idx_branch (branch_ID),
    INDEX idx_position (pos_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 6. VEHICLE_TYPE
-- ========================================
CREATE TABLE vehicle_type (
    vehicletype_ID INT PRIMARY KEY AUTO_INCREMENT,
    vehicletype_name VARCHAR(50) NOT NULL UNIQUE,
    vehicletype_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (vehicletype_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 7. SERVICE_TYPE
-- ========================================
CREATE TABLE service_type (
    serviceType_ID INT PRIMARY KEY AUTO_INCREMENT,
    serviceType_Name VARCHAR(100) NOT NULL UNIQUE,
    serviceType_BasePrice DECIMAL(10,2) NOT NULL,
    serviceType_Duration INT DEFAULT 30 NOT NULL COMMENT 'ระยะเวลา (นาที)',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (serviceType_Name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 8. VEHICLE (รองรับ TEMP plates)
-- ========================================
CREATE TABLE vehicle (
    vehicle_ID INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_plate VARCHAR(20) UNIQUE COMMENT 'NULL สำหรับ TEMP plates', 
    vehicle_color VARCHAR(50),
    cust_ID INT NOT NULL,
    vehicletype_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cust_ID) REFERENCES customer(cust_ID) ON DELETE CASCADE,
    FOREIGN KEY (vehicletype_ID) REFERENCES vehicle_type(vehicletype_ID),
    
    INDEX idx_customer (cust_ID),
    INDEX idx_plate (vehicle_plate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 9. BOOKING (with Membership & Pricing)
-- ========================================
CREATE TABLE booking (
    booking_ID INT PRIMARY KEY AUTO_INCREMENT,
    booking_date DATETIME NOT NULL COMMENT 'วันที่และเวลาจอง', 
    booking_time TIME COMMENT 'เวลาจอง (แยกเก็บ)',
    duration INT DEFAULT 30 NOT NULL COMMENT 'ระยะเวลาบริการ (นาที)',
    booking_status VARCHAR(50) DEFAULT 'pending' NOT NULL, 
    
    -- Pricing & Membership
    subtotal DECIMAL(10,2) DEFAULT 0.00 COMMENT 'ยอดรวมก่อนหัก',
    membership_discount DECIMAL(10,2) DEFAULT 0.00 COMMENT 'ส่วนลดสมาชิก',
    points_used INT DEFAULT 0 COMMENT 'คะแนนที่ใช้',
    final_amount DECIMAL(10,2) DEFAULT 0.00 COMMENT 'ยอดชำระสุทธิ',
    points_earned INT DEFAULT 0 COMMENT 'คะแนนที่จะได้รับ',
    
    cust_ID INT NOT NULL,
    branch_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cust_ID) REFERENCES customer(cust_ID),
    FOREIGN KEY (branch_ID) REFERENCES branch(branch_ID),
    
    INDEX idx_customer (cust_ID),
    INDEX idx_date_time (booking_date, booking_time),
    INDEX idx_status (booking_status),
    INDEX idx_branch_date (branch_ID, booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 10. PAYMENT
-- ========================================
CREATE TABLE payment (
    payment_ID INT PRIMARY KEY AUTO_INCREMENT,
    payment_amount DECIMAL(10,2) NOT NULL, 
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,  
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' COMMENT 'pending/completed/refunded',
    booking_ID INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_ID) REFERENCES booking(booking_ID) ON DELETE CASCADE,
    
    INDEX idx_status (payment_status),
    INDEX idx_method (payment_method),
    INDEX idx_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 11. SERVICE
-- ========================================
CREATE TABLE service (
    service_ID INT PRIMARY KEY AUTO_INCREMENT,
    service_status VARCHAR(50) DEFAULT 'pending' NOT NULL, 
    service_startdate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,  
    service_finishdate DATETIME,
    booking_ID INT NOT NULL,
    vehicle_ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_ID) REFERENCES booking(booking_ID) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_ID) REFERENCES vehicle(vehicle_ID),
    
    INDEX idx_status (service_status),
    INDEX idx_booking (booking_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 12. RECEIPT
-- ========================================
CREATE TABLE receipt (
    receipt_ID INT PRIMARY KEY AUTO_INCREMENT,
    receipt_number VARCHAR(20) NOT NULL UNIQUE,  
    receipt_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, 
    receipt_description TEXT,
    payment_ID INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (payment_ID) REFERENCES payment(payment_ID) ON DELETE CASCADE,
    
    INDEX idx_number (receipt_number),
    INDEX idx_date (receipt_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 13. SERVICE_DETAIL
-- ========================================
CREATE TABLE service_detail (
    sdetail_ID INT PRIMARY KEY AUTO_INCREMENT,
    sdetail_quantity INT DEFAULT 1 NOT NULL, 
    sdetail_price DECIMAL(10,2) NOT NULL,  

    service_ID INT NOT NULL,
    serviceType_ID INT NOT NULL,
    emp_ID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (service_ID) REFERENCES service(service_ID) ON DELETE CASCADE,
    FOREIGN KEY (serviceType_ID) REFERENCES service_type(serviceType_ID),
    FOREIGN KEY (emp_ID) REFERENCES employee(emp_ID) ON DELETE SET NULL,
    
    INDEX idx_service (service_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 14. POINT_TRANSACTION
-- ========================================
CREATE TABLE point_transaction (
    transaction_ID INT PRIMARY KEY AUTO_INCREMENT,
    cust_ID INT NOT NULL,
    booking_ID INT NULL COMMENT 'NULL = manual adjustment',
    
    transaction_type ENUM('earn', 'redeem', 'expire', 'bonus', 'adjust') NOT NULL,
    points INT NOT NULL COMMENT '+/- points',
    
    description TEXT,
    related_amount DECIMAL(10,2) NULL COMMENT 'จำนวนเงินที่เกี่ยวข้อง',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cust_ID) REFERENCES customer(cust_ID) ON DELETE CASCADE,
    FOREIGN KEY (booking_ID) REFERENCES booking(booking_ID) ON DELETE SET NULL,
    
    INDEX idx_cust_date (cust_ID, created_at),
    INDEX idx_type (transaction_type),
    INDEX idx_booking (booking_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- 15. POINT_REDEMPTION
-- ========================================
CREATE TABLE point_redemption (
    redemption_ID INT PRIMARY KEY AUTO_INCREMENT,
    cust_ID INT NOT NULL,
    booking_ID INT NOT NULL,
    
    points_used INT NOT NULL COMMENT 'จำนวน point ที่ใช้',
    discount_amount DECIMAL(10,2) NOT NULL COMMENT 'ส่วนลดที่ได้ (บาท)',
    redemption_rate DECIMAL(10,2) DEFAULT 100.00 COMMENT '100 pts = 10 Baht',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cust_ID) REFERENCES customer(cust_ID) ON DELETE CASCADE,
    FOREIGN KEY (booking_ID) REFERENCES booking(booking_ID) ON DELETE CASCADE,
    
    INDEX idx_customer (cust_ID),
    INDEX idx_booking (booking_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- INSERT SAMPLE DATA
-- ========================================

-- 1. Membership Tiers (ต้อง Insert ก่อน Customer)
INSERT INTO membership_tier 
(tier_name, tier_color, tier_icon, tier_order, min_points, min_spent, discount_percent, points_multiplier, benefits) 
VALUES
('Bronze', '#cd7f32', '🥉', 1, 0, 0.00, 0.00, 1.00, 
 '["Welcome Gift: 50 Points","Standard Support","Basic Promotions","Booking History"]'),
 
('Silver', '#c0c0c0', '🥈', 2, 1000, 5000.00, 5.00, 1.20, 
 '["5% Discount on All Services","Earn 20% More Points (1.2x)","Priority Booking (7 days)","Birthday Gift: 100 Points","Exclusive Promotions"]'),
 
('Gold', '#ffd700', '🥇', 3, 3000, 15000.00, 10.00, 1.50, 
 '["10% Discount","Earn 50% More Points (1.5x)","Priority Booking (14 days)","Birthday Discount: 20% OFF","Free Service: 1x/year","VIP Support"]'),
 
('Platinum', '#e5e4e2', '💎', 4, 10000, 50000.00, 15.00, 2.00, 
 '["15% Discount","Earn Double Points (2x)","Unlimited Priority Booking","Birthday: 30% OFF","Free Service: 3x/year","Account Manager","VIP Lounge"]');

-- 2. Branches
INSERT INTO branch (branch_name, branch_address, branch_tel) VALUES
('สาขาเซ็นทรัล พลาซ่า', '1 ถนนเพชรบุรีตัดใหม่ แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ 10400', '02-123-4567'),
('สาขาเมกาบางนา', '39 ถนนบางนา-ตราด กม.8 แขวงบางนา เขตบางนา กรุงเทพฯ 10260', '02-234-5678'),
('สาขาฟิวเจอร์พาร์ค รังสิต', '94 ถนนพหลโยธิน ตำบลประชาธิปัตย์ อำเภอธัญบุรี ปทุมธานี 12130', '02-345-6789');

-- 3. Employee Positions
INSERT INTO employee_position (pos_name, pos_salary) VALUES
('Manager', 35000.00),
('Cashier', 18000.00),
('Cleaner', 15000.00);

-- 4. Employees
INSERT INTO employee (emp_fname, emp_lname, emp_address, emp_username, emp_password, branch_ID, pos_ID, is_active) VALUES
('สมชาย', 'ใจดี', '123 ถนนสุขุมวิท กรุงเทพฯ', 'manager1', 'manager123', 1, 1, TRUE),
('สมหญิง', 'รักงาน', '456 ถนนพระราม 9 กรุงเทพฯ', 'cashier1', 'cashier123', 1, 2, TRUE),
('สมศรี', 'ขยัน', '789 ถนนเพชรบุรี กรุงเทพฯ', 'cleaner1', 'cleaner123', 1, 3, TRUE);

-- 5. Sample Customers (with Welcome Bonus)
INSERT INTO customer 
(cust_fname, cust_lname, cust_tel, cust_address, cust_username, cust_password, membership_tier_ID, total_points, available_points) 
VALUES
('ทดสอบ', 'ระบบ', '081-234-5678', '123 ถนนพระราม 4 กรุงเทพฯ', 'testuser', 'test1234', 1, 50, 50),
('จอห์น', 'โด', '082-345-6789', '456 ถนนสุขุมวิท นนทบุรี', 'johndoe', 'john1234', 1, 50, 50),
('แมรี่', 'เจน', '083-456-7890', '789 ถนนเพชรบุรี กรุงเทพฯ', 'maryjane', 'mary1234', 2, 1200, 1200),
('ปีเตอร์', 'ปาร์คเกอร์', '084-567-8901', '321 ถนนศรีนครินทร์ กรุงเทพฯ', 'peterparker', 'peter1234', 3, 3500, 3500);

-- 6. Service Types
INSERT INTO service_type (serviceType_Name, serviceType_BasePrice, serviceType_Duration, is_active) VALUES
('ล้างรถ', 200.00, 30, TRUE),
('เคลือบสีรถ', 150.00, 15, TRUE),
('ขัดสี', 1000.00, 60, TRUE),
('ดูดฝุ่น', 80.00, 20, TRUE),
('ซักเบาะ', 2000.00, 90, TRUE);

-- 7. Vehicle Types
INSERT INTO vehicle_type (vehicletype_name, vehicletype_multiplier) VALUES
('รถเก๋ง', 1.00),
('รถกระบะ', 1.20),
('รถสปอร์ต', 1.50),
('รถตู้', 1.30),
('มอเตอร์ไซค์', 0.80);

-- 8. Welcome Bonus Transactions
INSERT INTO point_transaction (cust_ID, transaction_type, points, description) VALUES
(1, 'bonus', 50, 'Welcome Bonus - Thank you for joining CYBERCAR! 🎉'),
(2, 'bonus', 50, 'Welcome Bonus - Thank you for joining CYBERCAR! 🎉'),
(3, 'bonus', 50, 'Welcome Bonus - Thank you for joining CYBERCAR! 🎉'),
(3, 'earn', 1150, 'Earned from multiple bookings'),
(4, 'bonus', 50, 'Welcome Bonus - Thank you for joining CYBERCAR! 🎉'),
(4, 'earn', 3450, 'Earned from multiple bookings');

-- ========================================
-- CREATE VIEWS
-- ========================================

-- View 1: Customer with Membership
CREATE OR REPLACE VIEW v_customer_membership AS
SELECT 
    c.cust_ID,
    c.cust_fname,
    c.cust_lname,
    c.cust_tel,
    c.cust_username,
    c.total_points,
    c.available_points,
    c.total_spent,
    c.created_at as member_since,
    
    t.tier_ID,
    t.tier_name,
    t.tier_icon,
    t.tier_color,
    t.tier_order,
    t.discount_percent,
    t.points_multiplier,
    t.benefits,
    
    -- Next Tier Info
    (SELECT tier_name FROM membership_tier 
     WHERE tier_order > t.tier_order 
     ORDER BY tier_order ASC LIMIT 1) as next_tier_name,
    (SELECT min_points FROM membership_tier 
     WHERE tier_order > t.tier_order 
     ORDER BY tier_order ASC LIMIT 1) as next_tier_points,
    (SELECT min_spent FROM membership_tier 
     WHERE tier_order > t.tier_order 
     ORDER BY tier_order ASC LIMIT 1) as next_tier_spent
    
FROM customer c
LEFT JOIN membership_tier t ON c.membership_tier_ID = t.tier_ID;

-- View 2: Booking Details
CREATE OR REPLACE VIEW v_booking_details AS
SELECT 
    b.booking_ID,
    b.booking_date,
    b.booking_time,
    b.duration,
    b.booking_status,
    b.subtotal,
    b.membership_discount,
    b.points_used,
    b.final_amount,
    b.points_earned,
    
    c.cust_ID,
    c.cust_fname,
    c.cust_lname,
    c.cust_tel,
    
    br.branch_name,
    
    p.payment_amount,
    p.payment_method,
    p.payment_status,
    
    r.receipt_number,
    r.receipt_description
    
FROM booking b
LEFT JOIN customer c ON b.cust_ID = c.cust_ID
LEFT JOIN branch br ON b.branch_ID = br.branch_ID
LEFT JOIN payment p ON b.booking_ID = p.booking_ID
LEFT JOIN receipt r ON p.payment_ID = r.payment_ID;

-- View 3: Membership Statistics
CREATE OR REPLACE VIEW v_membership_stats AS
SELECT 
    t.tier_name,
    t.tier_icon,
    t.tier_color,
    t.tier_order,
    COUNT(c.cust_ID) as total_members,
    COALESCE(SUM(c.total_points), 0) as total_points,
    COALESCE(SUM(c.available_points), 0) as available_points,
    COALESCE(SUM(c.total_spent), 0) as total_revenue
FROM membership_tier t
LEFT JOIN customer c ON t.tier_ID = c.membership_tier_ID
GROUP BY t.tier_ID, t.tier_name, t.tier_icon, t.tier_color, t.tier_order
ORDER BY t.tier_order;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

SELECT '========================================' as '';
SELECT '✅ DATABASE CREATED SUCCESSFULLY!' as Status;
SELECT '========================================' as '';
SELECT '' as '';

-- แสดงจำนวน Tables และ Views
SELECT 
    'Total Tables' as Type,
    COUNT(*) as Count
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
UNION ALL
SELECT 
    'Total Views' as Type,
    COUNT(*) as Count
FROM information_schema.VIEWS 
WHERE TABLE_SCHEMA = DATABASE();

SELECT '' as '';
SELECT '📊 Tables Created:' as '';
SELECT TABLE_NAME, TABLE_ROWS, 
       ROUND(DATA_LENGTH/1024, 2) as Size_KB
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

SELECT '' as '';
SELECT '💎 Membership Tiers:' as '';
SELECT 
    tier_name as Tier,
    tier_icon as Icon,
    min_points as Min_Points,
    min_spent as Min_Spent,
    CONCAT(discount_percent, '%') as Discount,
    CONCAT(points_multiplier, 'x') as Multiplier
FROM membership_tier 
ORDER BY tier_order;

SELECT '' as '';
SELECT '👥 Customer Membership Distribution:' as '';
SELECT * FROM v_membership_stats;

SELECT '' as '';
SELECT '🏢 Branches:' as '';
SELECT 
    b.branch_ID,
    b.branch_name,
    b.branch_tel,
    CASE WHEN b.is_active THEN '✓ Active' ELSE '✗ Inactive' END as Status
FROM branch b;

SELECT '' as '';
SELECT '👨‍💼 Employees:' as '';
SELECT 
    e.emp_fname,
    e.emp_lname,
    p.pos_name as Position,
    b.branch_name as Branch,
    CASE WHEN e.is_active THEN '✓ Active' ELSE '✗ Inactive' END as Emp_Status,  -- ✅ แก้ไข
    CASE WHEN b.is_active THEN '✓' ELSE '✗' END as Branch_Status  -- ✅ แก้ไข
FROM employee e
LEFT JOIN employee_position p ON e.pos_ID = p.pos_ID
LEFT JOIN branch b ON e.branch_ID = b.branch_ID;

SELECT '' as '';
SELECT '🚗 Service Types:' as '';
SELECT 
    serviceType_Name as Service,
    CONCAT('฿', serviceType_BasePrice) as Price,
    CONCAT(serviceType_Duration, ' min') as Duration
FROM service_type
WHERE is_active = TRUE
ORDER BY serviceType_BasePrice;

SELECT '' as '';
SELECT '👤 Sample Customers:' as '';
SELECT 
    cust_fname,
    cust_lname,
    tier_name as Tier,
    tier_icon as Icon,
    available_points as Points,
    CONCAT('฿', total_spent) as Spent
FROM v_customer_membership
ORDER BY cust_ID
LIMIT 10;

SELECT '' as '';
SELECT '========================================' as '';
SELECT '🎉 Ready to use!' as Message;
SELECT '========================================' as '';
SELECT '' as '';
SELECT '📝 Default Login Accounts:' as '';
SELECT '' as '';
SELECT 'CUSTOMERS:' as Type;
SELECT '  testuser / test1234 (Bronze, 50 pts)' as Account;
SELECT '  johndoe / john1234 (Bronze, 50 pts)' as Account;
SELECT '  maryjane / mary1234 (Silver, 1200 pts)' as Account;
SELECT '  peterparker / peter1234 (Gold, 3500 pts)' as Account;
SELECT '' as '';
SELECT 'EMPLOYEES:' as Type;
SELECT '  manager1 / manager123 (Manager)' as Account;
SELECT '  cashier1 / cashier123 (Cashier)' as Account;
SELECT '  cleaner1 / cleaner123 (Cleaner)' as Account;
SELECT '' as '';
SELECT '========================================' as '';
