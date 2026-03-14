<?php
/**
 * CarePlus Hospital System - Booking Submission API
 */
session_start();
header('Content-Type: application/json');
require_once '../includes/config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

if (!isset($_SESSION['patient_id'])) {
    echo json_encode(['success' => false, 'message' => 'Authentication required. Please login to book an appointment.']);
    exit;
}

try {
    // Check for double booking
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND time_slot = ? AND status != 'Cancelled'");
    $stmtCheck->execute([$data['doctor_id'], $data['appointment_date'], $data['appointment_time']]);
    if ($stmtCheck->fetchColumn() > 0) {
        echo json_encode(['success' => false, 'message' => 'Slot already booked.']);
        exit;
    }

    $patient_id = null;
    if (isset($_SESSION['patient_id'])) {
        $patient_id = $_SESSION['patient_id'];
    }

    $stmt = $pdo->prepare("INSERT INTO appointments (reference_no, patient_id, doctor_id, patient_name, patient_phone, appointment_date, time_slot, status) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed')");
    
    $success = $stmt->execute([
        $data['reference_no'],
        $patient_id,
        $data['doctor_id'],
        $data['patient_name'],
        $data['patient_phone'],
        $data['appointment_date'],
        $data['appointment_time']
    ]);

    echo json_encode(['success' => $success]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
