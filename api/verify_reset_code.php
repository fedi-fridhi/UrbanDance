<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; // Make sure to include the Users class file

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['email']) && !empty($data['code'])) {
    $users = new Users();
    $response = $users->verifyResetCode($data['email'], $data['code']);

    echo $response;
} else {
    echo json_encode(["success" => false, "message" => "Email and code are required"]);
}
?>
