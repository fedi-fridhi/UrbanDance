<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (isset($data['groupId'], $data['userId'])) {
        $groupes = new Groupes();
        $result = $groupes->addInscription($data['groupId'], $data['userId']);
        echo $result;
    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
