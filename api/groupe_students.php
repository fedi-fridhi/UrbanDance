<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php';

try {
    // Use $_GET to access parameters in a GET request
    if (isset($_GET['groupId'])) {
        $groupes = new Groupes();
        $groupId = intval($_GET['groupId']);  // Ensure the groupId is treated as an integer
        $result = $groupes->groupeStudents($groupId);

        if ($result) {
            echo json_encode($result);
        } else {
            echo json_encode(["success" => false, "message" => "No students found"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing groupId field"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
