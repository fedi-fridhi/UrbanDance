<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php';

$data = json_decode(file_get_contents('php://input'), true);


$requiredFields = ['id', 'email', 'name', 'role', 'phone', 'address', 'country', 'region', 'codepostal', 'picturesrc'];

// Check if all required fields are provided
$isValid = true;
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        $isValid = false;
        break;
    }
}

if ($isValid) {
    $users = new Users();
    
    // Since updateUser now accepts an associative array, we pass the $data directly
    $result = $users->updateUser($data);

    if ($result) {
        echo json_encode(["success" => true, "message" => "User updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update user"]);
    }
} else {
    // Provide a more detailed message for which fields are missing
    $missingFields = array_filter($requiredFields, function($field) use ($data) {
        return empty($data[$field]);
    });
    $missingFieldsList = implode(', ', $missingFields);
    echo json_encode(["success" => false, "message" => "Missing required fields: " . $missingFieldsList]);
}

?>
