<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');


require 'classes/Users.php';

// Create a new Users object
$users = new Users();

// Get the coach name from the query string
$coachName = isset($_GET['name']) ? $_GET['name'] : '';

if (empty($coachName)) {
    echo json_encode(['success' => false, 'message' => 'Coach name is required']);
    exit;
}

// Search for the coach by name
$coachId = $users->searchCoachByName($coachName);

if ($coachId !== null) {
    echo json_encode(['success' => true, 'coachId' => $coachId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Coach not found']);
}
