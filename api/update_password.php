<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['email']) && !empty($data['newPassword'])) {
    $users = new Users();
    $response = $users->updatePassword($data['email'], $data['newPassword']);

    echo $response;
} else {
    echo json_encode(["success" => false, "message" => "Email and new password are required"]);
}
?>
