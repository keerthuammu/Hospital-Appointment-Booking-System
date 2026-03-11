<?php
// API to fetch doctors
// For: Jobin (Backend) & Josekutty (AJAX)

header('Content-Type: application/json');
require_once '../includes/config.php';

try {
    $stmt = $pdo->query("SELECT * FROM doctors");
    $doctors = $stmt->fetchAll();
    
    echo json_encode($doctors);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
