<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';

if (isset($_GET['eventId']) && isset($_GET['userId'])) {
    $events = new Events();
    $isSubscribed = $events->isSubscribedToEvent($_GET['eventId'], $_GET['userId']);
    echo json_encode(["isSubscribed" => $isSubscribed]);
} else {
    echo json_encode(["success" => false, "message" => "Missing required fields: eventId, userId"]);
}
?>
