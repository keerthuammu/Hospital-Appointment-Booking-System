<?php
/**
 * CarePlus Hospital System - Doctor Directory API
 */
/*
get_doctors.php

Purpose: Retrieve list of doctors
*/

header('Content-Type: application/json');
require_once '../includes/config.php';

try {
    $stmt = $pdo->query("SELECT * FROM doctors");
    $docs = $stmt->fetchAll();
    
    $doctorsList = [];
    foreach ($docs as $doc) {
        $doctorsList[] = [
            'id' => $doc['doctor_id'],
            'name' => $doc['doctor_name'],
            'specialization' => $doc['specialization'],
            'experience' => $doc['experience'],
            'fee' => $doc['fee'],
            'photo' => $doc['photo_url'],
            'available_days' => $doc['available_days'],
            'slots' => explode(',', $doc['available_slots'])
        ];
    }
    
    echo json_encode($doctorsList);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
