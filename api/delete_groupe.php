<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (isset($data['id'])) {
        $groupes = new Groupes();
        $result = $groupes->deleteGroupeById($data['id']);
        echo $result;
    } else {
        echo json_encode(["success" => false, "message" => "Missing groupe ID"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
