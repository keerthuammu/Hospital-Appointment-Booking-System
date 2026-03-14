<?php
/**
 * CarePlus Hospital System - Admin Management API
 */
session_start();
header('Content-Type: application/json');
require_once '../includes/config.php';

// Check if admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'get_doctors':
        $stmt = $pdo->query("SELECT d.*, u.email FROM doctors d JOIN users u ON d.user_id = u.user_id");
        echo json_encode(['success' => true, 'doctors' => $stmt->fetchAll()]);
        break;

    case 'add_doctor':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $pdo->beginTransaction();
            $hashed = password_hash('password', PASSWORD_DEFAULT); // Default pass
            
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'doctor')");
            $stmt->execute([$data['name'], $data['email'], $hashed]);
            $user_id = $pdo->lastInsertId();

            $stmt2 = $pdo->prepare("INSERT INTO doctors (user_id, doctor_name, specialization, experience, fee, available_days, available_slots) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt2->execute([$user_id, $data['name'], $data['specialization'], $data['experience'], $data['fee'], $data['available_days'], $data['available_slots']]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'delete_doctor':
        $data = json_decode(file_get_contents("php://input"), true);
        if(!isset($data['doctor_id'])) {
            echo json_encode(['success'=>false, 'message'=>'doctor_id missing']);
            break;
        }
        try {
            // Because ON DELETE CASCADE is set on user_id, deleting the user will delete the doctor and appointments
            $stmt = $pdo->prepare("SELECT user_id FROM doctors WHERE doctor_id = ?");
            $stmt->execute([$data['doctor_id']]);
            $uid = $stmt->fetchColumn();
            
            if ($uid) {
                $stmt2 = $pdo->prepare("DELETE FROM users WHERE user_id = ?");
                $stmt2->execute([$uid]);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success'=>false, 'message'=>'Doctor not found']);
            }
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'update_doctor':
        $data = json_decode(file_get_contents("php://input"), true);
        try {
            $pdo->beginTransaction();
            
            // Get user_id first
            $stmt = $pdo->prepare("SELECT user_id FROM doctors WHERE doctor_id = ?");
            $stmt->execute([$data['doctor_id']]);
            $user_id = $stmt->fetchColumn();
            
            if (!$user_id) throw new Exception("Doctor not found");

            // Update users table
            $stmt_u = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE user_id = ?");
            $stmt_u->execute([$data['name'], $data['email'], $user_id]);
            
            // Update doctors table
            $stmt_d = $pdo->prepare("UPDATE doctors SET doctor_name = ?, specialization = ?, experience = ?, fee = ?, available_days = ?, available_slots = ? WHERE doctor_id = ?");
            $stmt_d->execute([$data['name'], $data['specialization'], $data['experience'], $data['fee'], $data['available_days'], $data['available_slots'], $data['doctor_id']]);
            
            $pdo->commit();
            echo json_encode(['success' => true, 'message' => 'Doctor updated successfully']);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    case 'get_appointments':
        $stmt = $pdo->query("SELECT a.*, d.doctor_name, d.specialization FROM appointments a JOIN doctors d ON a.doctor_id = d.doctor_id ORDER BY a.appointment_date DESC");
        echo json_encode(['success' => true, 'appointments' => $stmt->fetchAll()]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        break;
}
?>
