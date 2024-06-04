
<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Events.php';


    $events = new Events();
    
    $result = $events->getAllNextEvents();

    echo json_encode($result);

?>
