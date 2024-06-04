<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Disable error reporting to the output
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_log('/path/to/error.log'); // Set the path to your error.log file

require 'classes/Events.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    // Check for all required fields, including the new 'localisation' and 'limit_subs'
    if (isset(
        $data['name'],
        $data['description'],
        $data['price'],
        $data['bannersrc'],
        $data['e_date'],
        $data['coachid'],
        $data['e_type'],
        $data['localisation'], // Newly added field
        $data['limit_subs']    // Newly added field
    )) {
        $events = new Events();
        
        // Call the createEvent method with all required fields
        $result = $events->createEvent(
            $data['name'],
            $data['description'],
            $data['price'],
            $data['bannersrc'],
            $data['e_date'],
            $data['coachid'],
            $data['e_type'],
            $data['localisation'], // Newly added field
            $data['limit_subs']    // Newly added field
        );
        echo json_encode($result);
    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
    }
} catch (Exception $e) {
    http_response_code(500); // Set HTTP response code to 500 (Internal Server Error)
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
