<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';

$data = json_decode(file_get_contents('php://input'), true);


$requiredFields = ['id', 'name', 'description', 'price', 'bannersrc', 'e_date', 'e_type', 'coachid', 'localisation', 'limit_subs'];

$isValid = true;
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $isValid = false;
        $missingFields[] = $field; 
    }
}

if ($isValid) {
    $events = new Events();
    
    
    $result = $events->updateEventById($data);

    echo $result;
} else {
    $missingFieldsList = implode(', ', $missingFields);
    echo json_encode(["success" => false, "message" => "Missing required fields: " . $missingFieldsList]);
}

?>
