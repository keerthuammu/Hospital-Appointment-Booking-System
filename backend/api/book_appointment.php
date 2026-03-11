<?php
// API to book an appointment
// For: Jobin (Backend)

header('Content-Type: application/json');
require_once '../includes/config.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO appointments (reference_no, patient_name, patient_phone, doctor_id, appointment_date, appointment_time) 
                           VALUES (?, ?, ?, ?, ?, ?)");
    
    $success = $stmt->execute([
        $data['reference_no'],
        $data['patient_name'],
        $data['patient_phone'],
        $data['doctor_id'],
        $data['appointment_date'],
        $data['appointment_time']
    ]);

    echo json_encode(['success' => $success]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
