<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

require 'classes/Groupes.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (isset(
        $data['id'],
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

        $result = $groupes->updateGroupeById(array(
            'id' => $data['id'],
            'name' => $data['name'],
            'type' => $data['type'],
            'coachid' => $data['coachid'],
            'price' => $data['price'],
            'nbr_limit' => $data['nbr_limit'],
            'lundi' => $data['days']['lundi'],
            'mardi' => $data['days']['mardi'],
            'mercredi' => $data['days']['mercredi'],
            'jeudi' => $data['days']['jeudi'],
            'vendredi' => $data['days']['vendredi'],
            'samedi' => $data['days']['samedi'],
            'dimanche' => $data['days']['dimanche'],
            'horaire_debut' => $data['horaire_debut'],
            'horaire_fin' => $data['horaire_fin']
        ));
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
