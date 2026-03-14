-- CarePlus Hospital Booking System - Database Schema

CREATE DATABASE IF NOT EXISTS hospital_booking;
USE hospital_booking;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience VARCHAR(50),
    fee VARCHAR(50),
    photo_url VARCHAR(255),
    available_days VARCHAR(100),
    available_slots VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    reference_no VARCHAR(20) UNIQUE NOT NULL,
    patient_id INT,
    doctor_id INT NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
);

-- Sample Data Seeding
-- Admin User
INSERT INTO users (name, email, password, role) VALUES ('Admin', 'admin@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- 8 Doctor Users & Profiles
INSERT INTO users (name, email, password, role) VALUES ('Dr. Madhavan Nair', 'madhavan@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc1_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc1_user_id, 'Dr. Madhavan Nair', 'Cardiology', '15 Years', '₹800', 'assets/doctors/dr_madhavan_nair.png', 'Monday,Wednesday,Friday', '09:00 AM,10:00 AM,11:00 AM,02:00 PM,03:00 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Lakshmi Priya', 'lakshmi@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc2_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc2_user_id, 'Dr. Lakshmi Priya', 'Pediatrics', '10 Years', '₹600', 'assets/doctors/dr_lakshmi_priya.png', 'Tuesday,Thursday,Saturday', '10:00 AM,11:00 AM,01:00 PM,04:00 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Rajesh Kumar', 'rajesh@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc3_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc3_user_id, 'Dr. Rajesh Kumar', 'Orthopedics', '12 Years', '₹700', 'assets/doctors/dr_rajesh_kumar.png', 'Monday,Wednesday,Thursday', '09:00 AM,11:00 AM,02:00 PM,05:00 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Anjali Menon', 'anjali@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc4_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc4_user_id, 'Dr. Anjali Menon', 'Neurology', '20 Years', '₹1000', 'assets/doctors/dr_anjali_menon.png', 'Tuesday,Friday', '09:30 AM,10:30 AM,02:30 PM,03:30 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Rahul Krishnan', 'rahul@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc5_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc5_user_id, 'Dr. Rahul Krishnan', 'Dermatology', '8 Years', '₹500', 'assets/doctors/dr_rahul_krishnan.png', 'Monday,Tuesday,Saturday', '10:00 AM,12:00 PM,03:00 PM,04:00 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Parvathy S.', 'parvathy@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc6_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc6_user_id, 'Dr. Parvathy S.', 'Gynecology', '14 Years', '₹900', 'assets/doctors/dr_parvathy_s.png', 'Wednesday,Thursday,Saturday', '09:00 AM,11:30 AM,02:00 PM,03:30 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Suresh Babu', 'sureshb@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc7_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc7_user_id, 'Dr. Suresh Babu', 'Orthopedics', '18 Years', '₹750', 'assets/doctors/dr_suresh_babu.png', 'Friday,Saturday', '10:00 AM,11:00 AM,03:00 PM');

INSERT INTO users (name, email, password, role) VALUES ('Dr. Arun Kumar', 'arun@careplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor');
SET @doc8_user_id = LAST_INSERT_ID();
INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, photo_url, available_days, available_slots) 
VALUES (@doc8_user_id, 'Dr. Arun Kumar', 'General Medicine', '5 Years', '₹400', 'assets/doctors/dr_madhavan_nair.png', 'Monday,Tuesday,Wednesday', '09:00 AM,10:00 AM,04:00 PM');

-- Patient User
INSERT INTO users (name, email, password, role) VALUES ('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient');
SET @pat1_user_id = LAST_INSERT_ID();
INSERT INTO patients (user_id, phone, address, date_of_birth) VALUES (@pat1_user_id, '+919876543210', 'Kerala, India', '1990-01-01');
