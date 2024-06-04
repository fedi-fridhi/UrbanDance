
<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['eventId'], $data['userId'])) {
    $events = new Events();
    
    $result = $events->addSubscription($data['eventId'], $data['userId']);

    echo $result;
} else {
    echo json_encode(["success" => false, "message" => "Missing eventId or userId"]);
}

?>
