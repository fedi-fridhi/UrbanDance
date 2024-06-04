<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Include PHPMailer autoload file
require 'vendor/autoload.php';



    
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if all required form fields are present
    if (isset($data['name'], $data['email'], $data['number'], $data['subject'], $data['message'])) {
        try {
            // Create a new PHPMailer instance
            $mail = new PHPMailer(true);
            
            // Enable verbose debugging
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
            
            // Set Outlook SMTP settings
            $mail->isSMTP();
            $mail->Host = 'smtp-mail.outlook.com';
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = 'STARTTLS';
            $mail->Port = 587;
            
            // Authentication with your credentials
            $mail->Username = 'urbandance.tn@outlook.com';
            $mail->Password = 'urbandance2001';
            
            // Set email content
            $mail->setFrom('urbandance.tn@outlook.com', 'UrbanDance');  // Set from address matching the username
            $mail->addAddress($data['email'], $data['name']);  // Send to the submitter as a confirmation
            $mail->addReplyTo('urbandance.tn@outlook.com', 'Information');  // Add a reply-to address
            $mail->Subject = $data['subject'];
            $mail->Body = $data['message'];
            
            // Send email
            $mail->send();
            echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
        } catch (Exception $e) {
            // Failed to send email
            echo json_encode(["success" => false, "message" => "Failed to send message: " . $mail->ErrorInfo]);
        }
    } else {
        // Missing form data
        echo json_encode(["success" => false, "message" => "Missing form data"]);
    }


?>
