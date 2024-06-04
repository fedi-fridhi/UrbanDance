<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require 'classes/Groupes.php';

try {
    $groupes = new Groupes();
    $result = $groupes->getAllGroupes();
    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal Server Error: ' . $e->getMessage()
    ]);
}

?>
