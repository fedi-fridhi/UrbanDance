<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');



require 'classes/Users.php';

$users = new Users();

$userList = $users->getAllUsers();

if (!empty($userList)) {
    echo json_encode($userList);
} else {
    echo json_encode(["success" => false, "message" => "No users found"]);
}
?>