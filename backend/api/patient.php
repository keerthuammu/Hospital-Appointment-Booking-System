<?php
/**
 * CarePlus Hospital System - Patient Dashboard API
 */
session_start();
header('Content-Type: application/json');
require_once '../includes/config.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'patient') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_history':
        $patient_id = $_SESSION['patient_id'];
        $stmt = $pdo->prepare("SELECT a.*, d.doctor_name, d.specialization FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id WHERE a.patient_id = ? ORDER BY a.appointment_date DESC");
        $stmt->execute([$patient_id]);
        echo json_encode(['success' => true, 'history' => $stmt->fetchAll()]);
        break;
        
    case 'cancel_appointment':
        $data = json_decode(file_get_contents("php://input"), true);
        $app_id = $data['appointment_id'];
        $stmt = $pdo->prepare("UPDATE appointments SET status = 'Cancelled' WHERE appointment_id = ? AND patient_id = ? AND status != 'Completed'");
        $success = $stmt->execute([$app_id, $_SESSION['patient_id']]);
        echo json_encode(['success' => $success]);
        break;

    case 'get_profile':
        $stmt = $pdo->prepare("SELECT u.name, u.email, p.phone, p.address, p.date_of_birth FROM users u JOIN patients p ON u.user_id = p.user_id WHERE u.user_id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        echo json_encode(['success' => true, 'profile' => $stmt->fetch()]);
        break;
        
    case 'update_profile':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $pdo->beginTransaction();
            
            // Update users table
            $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE user_id = ?");
            $stmt->execute([$data['name'], $data['email'], $_SESSION['user_id']]);
            
            // Update patients table
            $stmt2 = $pdo->prepare("UPDATE patients SET phone = ?, address = ?, date_of_birth = ? WHERE user_id = ?");
            $stmt2->execute([$data['phone'], $data['address'], $data['date_of_birth'], $_SESSION['user_id']]);
            
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
