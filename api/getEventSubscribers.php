
<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';

if (isset($_GET['id'])) {
    $events = new Events();
    
    $result = $events->EventSubscibers($_GET['id']);

    echo json_encode($result);
} else {
    echo json_encode(["success" => false, "message" => "Missing event ID"]);
}

?>
