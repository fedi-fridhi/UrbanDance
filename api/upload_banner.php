<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

$targetDir = "uploads/";
$fileName = basename($_FILES["banner"]["name"]);
$targetFilePath = $targetDir . $fileName;
$fileType = pathinfo($targetFilePath,PATHINFO_EXTENSION);

if(in_array($fileType, ['mp4', 'avi', 'mov'])) { // check if file is a video
    if(move_uploaded_file($_FILES["banner"]["tmp_name"], $targetFilePath)){
        // File upload success
        echo json_encode(["success" => true, "bannerSrc" => $targetFilePath]);
    } else{
        // File upload error
        echo json_encode(["success" => false, "message" => "Sorry, there was an error uploading your file."]);
    }
} else {
    // Not a video file
    echo json_encode(["success" => false, "message" => "Sorry, only MP4, AVI, & MOV files are allowed to upload."]);
}

?>
