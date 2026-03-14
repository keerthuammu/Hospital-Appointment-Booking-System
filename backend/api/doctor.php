<?php
/**
 * CarePlus Hospital System - Doctor Portal API
 */
session_start();
header('Content-Type: application/json');
require_once '../includes/config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_schedule':
        $doctor_id = $_SESSION['doctor_id'];
        $stmt = $pdo->prepare("SELECT a.*, p.phone as registered_phone FROM appointments a LEFT JOIN patients p ON a.patient_id = p.patient_id WHERE a.doctor_id = ? ORDER BY a.appointment_date, a.time_slot");
        $stmt->execute([$doctor_id]);
        echo json_encode(['success' => true, 'appointments' => $stmt->fetchAll()]);
        break;

    case 'update_status':
        $data = json_decode(file_get_contents("php://input"), true);
        $status = $data['status'];
        $app_id = $data['appointment_id'];
        
        $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE appointment_id = ? AND doctor_id = ?");
        $success = $stmt->execute([$status, $app_id, $_SESSION['doctor_id']]);
        
        echo json_encode(['success' => $success]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
