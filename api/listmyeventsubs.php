<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';

if (isset($_GET['userId'])) {
    $events = new Events();
    $subscriptions = $events->mySubscriptions($_GET['userId']);
    echo json_encode($subscriptions);
} else {
    echo json_encode(["success" => false, "message" => "Missing required field: userId"]);
}
?>
