<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET'); // Explicitly allow GET methods
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php';

try {
    // Retrieve userId from the URL query parameters
    if (isset($_GET['userId']) && !empty($_GET['userId'])) {
        $userId = intval($_GET['userId']); // Ensure the input is treated as an integer
        $groupes = new Groupes();
        $result = $groupes->mySubscriptions($userId);
        
        // Check if the result is not empty
        if (!empty($result)) {
            echo json_encode($result);
        } else {
            echo json_encode(["success" => false, "message" => "No subscriptions found"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing userId field"]);
    }
} catch (Exception $e) {
    http_response_code(500); // Set HTTP response code to 500 for server errors
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
