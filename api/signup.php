<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name']) && isset($data['email']) && isset($data['password'])) {
    $users = new Users();
    echo $users->register($data['name'], $data['email'], $data['password']);
} else {
    echo json_encode(["success" => false, "message" => "Required fields are missing"]);
}
?>
