-- CarePlus Hospital Booking System - Database Schema
-- For: Lamees (Database Designer)

CREATE DATABASE IF NOT EXISTS hospital_booking;
USE hospital_booking;

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience VARCHAR(50),
    fee VARCHAR(50),
    photo_url VARCHAR(255),
    available_days VARCHAR(255) -- E.g., "Mon, Wed, Fri"
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_no VARCHAR(20) UNIQUE NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    doctor_id INT,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Sample Data (To be filled by Lamees)
INSERT INTO doctors (name, specialization, experience, fee, available_days) VALUES 
('Dr. Madhavan Nair', 'Cardiology', '15 Years', '₹800', 'Mon, Wed, Fri'),
('Dr. Lakshmi Priya', 'Pediatrics', '10 Years', '₹600', 'Tue, Thu, Sat');
