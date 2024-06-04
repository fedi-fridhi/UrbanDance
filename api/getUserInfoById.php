<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['id'])) {
    $users = new Users();
    $user = $users->getUserById($data['id']);

    if ($user) {
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "No user found with ID " . $data['id']]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID is required"]);
}
?>