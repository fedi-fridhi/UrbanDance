<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Users.php'; 

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['id'])) {
    $users = new Users();
    $result = $users->deleteUserById($data['id']);

    if ($result) {
        echo json_encode(["success" => true, "message" => "User deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete user"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID is required"]);
}
?>