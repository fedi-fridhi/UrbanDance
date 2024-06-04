<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Target directory for uploaded files
$targetDirectory = "profile/";

// Validate if file and pictureName are present
if (!isset($_FILES['picture']) || !isset($_POST['pictureName'])) {
    echo json_encode(["success" => false, "message" => "No picture or picture name provided."]);
    exit;
}

$pictureName = preg_replace("/[^a-zA-Z0-9._-]/", "", $_POST['pictureName']); // Sanitizing the file name
$targetFile = $targetDirectory . basename($pictureName . strrchr($_FILES['picture']['name'], '.')); // Appending the original extension

// Check and handle the file upload
if (move_uploaded_file($_FILES["picture"]["tmp_name"], $targetFile)) {
    echo json_encode(["success" => true, "message" => "The file has been uploaded.", "pictureSrc" => $targetFile]);
} else {
    echo json_encode(["success" => false, "message" => "Sorry, there was an error uploading your file."]);
}

?>
