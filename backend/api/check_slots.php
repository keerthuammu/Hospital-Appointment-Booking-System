<?php
/**
 * CarePlus Hospital System - Slot Availability Checker
 */
/*
check_slots.php

Purpose: Check available appointment slots

Prevents double booking.

Example workflow:

1️ User selects doctor
2️ User selects date
3️ System checks available slots
*/

header('Content-Type: application/json');
require_once '../includes/config.php';

if (!isset($_GET['doctor_id']) || !isset($_GET['date'])) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$doctor_id = $_GET['doctor_id'];
$date = $_GET['date'];

try {
    $stmt = $pdo->prepare("SELECT time_slot FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND status != 'Cancelled'");
    $stmt->execute([$doctor_id, $date]);
    $booked_slots = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode(['success' => true, 'booked_slots' => $booked_slots]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
