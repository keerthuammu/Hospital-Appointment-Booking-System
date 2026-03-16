<?php
/**
 * CarePlus Hospital System - Database Configuration
 */

$host = 'localhost';
$db   = 'hospital_booking';
$user = 'root';
$pass = 'Li16@2003'; // 🛠️ CHANGE THIS if you have a database password
$charset = 'utf8mb4';

// 🛠️ ADD ";port=3307" to $dsn below if your MySQL port is not 3306
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>
