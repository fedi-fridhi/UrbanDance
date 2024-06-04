<?php

require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;


class Users {
    private $conn;
    private $jwtSecret = 'efijz54zfsdkj'; 
    
    public function __construct() {
        $this->connectDb();
    }

    private function connectDb() {
        include 'config\Database.php'; 
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    private function emailExists($email) {
      $sql = "SELECT id FROM users WHERE email = ?";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->store_result();
      
      return $stmt->num_rows > 0;
    }

    public function register($name, $email, $password) {
        if ($this->emailExists($email)) {
          return json_encode(["success" => false, "message" => "Email already exists"]);
        } else {
          $passwordHash = password_hash($password, PASSWORD_DEFAULT);
          $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
          $stmt = $this->conn->prepare($sql);
          $stmt->bind_param("sss", $name, $email, $passwordHash);
          $stmt->execute();

          if ($stmt->affected_rows > 0) {
              $lastId = $this->conn->insert_id;
              $token = $this->createJWT($lastId, $name, $email);
              return json_encode(["success" => true, "message" => "User registered successfully", "jwt" => $token]);
          } else {
              return json_encode(["success" => false, "message" => "User registration failed"]);
          }
        }
    }

    public function login($email, $password) {
      $sql = "SELECT id, name, password, role FROM users WHERE email = ?";
      $stmt = $this->conn->prepare($sql);
      $stmt->bind_param("s", $email);
      $stmt->execute();
      $stmt->store_result();
      $stmt->bind_result($id, $name, $hashedPassword, $role);
      $stmt->fetch();

      if ($stmt->num_rows > 0 && password_verify($password, $hashedPassword)) {
          $token = $this->createJWT($id, $name, $email, $role);
          return json_encode([
              "success" => true, 
              "message" => "Login successful",
              "jwt" => $token
          ]);
      } else {
          return json_encode(["success" => false, "message" => "Invalid email or password"]);
      }
    }

    private function createJWT($id, $name, $email, $role) {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600;  
        $payload = array(
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'iss' => 'urbandance.com', 
            'data' => array(
                'id' => $id,
                'name' => $name,
                'email' => $email,
                'role' => $role
            )
        );

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }
    private function validateToken() {
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : false;
    
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "No token provided"]);
            exit;
        }
    
        list($tokenType, $token) = explode(" ", $authHeader, 2);
        if (!isset($token) || strcasecmp($tokenType, 'Bearer') != 0) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid token"]);
            exit;
        }
    
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            // You can add additional checks here on the $decoded data if needed
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid token: " . $e->getMessage()]);
            exit;
        }
    }
    
    public function getAllUsers() {
        
        $sql = "SELECT * FROM users";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getUserById($id) {
    
        $sql = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function deleteUserById($id) {
        $sql = "DELETE FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->affected_rows > 0;
    }

    public function updateUserById($userData) {
        $sql = "UPDATE users SET email = ?, name = ?, role = ?, phone = ?, address = ?, country = ?, region = ?, codepostal = ?, picturesrc = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssssssi",
            $userData['email'],
            $userData['name'],
            $userData['role'],
            $userData['phone'],
            $userData['address'], 
            $userData['country'],
            $userData['region'],
            $userData['codepostal'],
            $userData['picturesrc'],
            $userData['id']
            
        );
    
        
        $stmt->execute();
        if (!$stmt->execute()) {
            error_log("Execute failed: " . $stmt->error);
            return false;
        }
        return $stmt->affected_rows > 0;
    }
    private $resetPasswordExpiration = 3600; // Reset code valid for 1 hour

    public function initiatePasswordReset($email) {
        if (!$this->emailExists($email)) {
            return json_encode(["success" => false, "message" => "Email does not exist"]);
        }

        $resetCode = rand(100000, 999999); // Generate a 6-digit code
        $expiry = time() + $this->resetPasswordExpiration;

        // Store the reset code and expiry in the database
        $sql = "UPDATE users SET reset_code = ?, reset_expiry = ? WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sis", $resetCode, $expiry, $email);
        $stmt->execute();
        $mail = new PHPMailer(true);
            
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
            $mail->addAddress($email);  // Send to the submitter as a confirmation
            $mail->addReplyTo('urbandance.tn@outlook.com', 'Information');  // Add a reply-to address
            $mail->Subject = "Your Password Reset Code";
            $mail->Body = "Your reset code is $resetCode";
            
            // Send email
            $mail->send();

        return json_encode(["success" => true, "message" => "Reset code sent to your email"]);
    }
    public function verifyResetCode($email, $code) {
        $sql = "SELECT reset_code, reset_expiry FROM users WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    
        if (!$user || $code != $user['reset_code'] || time() > $user['reset_expiry']) {
            return json_encode(["success" => false, "message" => "Invalid or expired reset code"]);
        }
    
        return json_encode(["success" => true, "message" => "Reset code verified"]);
    }
    public function updatePassword($email, $newPassword) {
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $sql = "UPDATE users SET password = ? WHERE email = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $passwordHash, $email);
        $stmt->execute();
    
        return json_encode(["success" => true, "message" => "Password updated successfully"]);
    }        
    public function getUserRoleById($id) {
        $sql = "SELECT role FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    return $user ? $user['role'] : null;
    }
    public function updateUser($params) {
        if (isset($params['id'], $params['email'], $params['name'], $params['role'], $params['phone'], $params['address'], $params['country'], $params['region'], $params['codepostal'], $params['picturesrc'])) {
            $sql = "UPDATE users SET email = ?, name = ?, role = ?, phone = ?, address = ?, country = ?, region = ?, codepostal = ?, picturesrc = ? WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            
            $bindParams = [];
            foreach ($params as $key => $value) {
                $bindParams[$key] = &$params[$key];
            }
            
            
            $stmt->bind_param(
                "sssssssssi",
                $bindParams['email'],
                $bindParams['name'],
                $bindParams['role'],
                $bindParams['phone'],
                $bindParams['address'],
                $bindParams['country'],
                $bindParams['region'],
                $bindParams['codepostal'],
                $bindParams['picturesrc'],
                $bindParams['id']
            );
            
            return $stmt->execute();
        } else {
            throw new Exception("Missing parameters");
        }
    }
    public function searchCoachByName($coachName) {
        // Prepare a SQL statement to search for the coach by name and role
        $sql = "SELECT id, role FROM users WHERE name LIKE ? AND role = 'Coach' LIMIT 1";
        $stmt = $this->conn->prepare($sql);
    
        // Use the LIKE operator with wildcards for a broad match
        $searchTerm = "%{$coachName}%";
        $stmt->bind_param("s", $searchTerm);
        $stmt->execute();
    
        // Get the result and fetch the first row
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
    
        if ($user) {
            // Return the user ID if found and role is 'Coach'
            return $user['id'];
        } else {
            // Return a message if no matching coach is found or role is not 'Coach'
            return null;
        }
    }
    
    
    
  

    public function __destruct() {
        $this->conn->close();
    }
}
?>
