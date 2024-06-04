<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; // Make sure to include the Users class file

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['email']) && !empty($data['password'])) {
    $users = new Users();
    echo $users->login($data['email'], $data['password']);
} else {
    echo json_encode(["success" => false, "message" => "Email and Password are required"]);
}
?>
