<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php'; 

$data = json_decode(file_get_contents('php://input'), true);

try {
    
    if (isset(
        $data['name'],
        $data['type'],
        $data['coachid'],
        $data['price'],
        $data['nbr_limit'],
        $data['days'],
        $data['horaire_debut'],
        $data['horaire_fin']
    )) {
        $groupes = new Groupes();
        
        // Convert days from booleans to integers
        foreach ($data['days'] as $day => $value) {
            $data['days'][$day] = $value ? 1 : 0;
        }

        $result = $groupes->createGroupe(
            $data['name'],
            $data['type'],
            $data['coachid'],
            $data['price'],
            $data['nbr_limit'],
            $data['days'],
            $data['horaire_debut'],
            $data['horaire_fin']
        );
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
