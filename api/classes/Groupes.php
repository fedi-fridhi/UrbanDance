<?php

class Groupes {
    private $conn;

    public function __construct() {
        $this->connectDb();
    }

    private function connectDb() {
        include 'config/Database.php'; 
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAllGroupes() {
        $sql = "SELECT * FROM groupes";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getGroupeById($id) {
        $sql = "SELECT * FROM groupes WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function createGroupe($name, $type, $nbr_limit, $coachid, $price, $days, $horaire_debut, $horaire_fin) {
        // Assuming there are 12 placeholders in the SQL string
        $sql = "INSERT INTO groupes (name, type, coachid, price, nbr_limit, lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche, horaire_debut, horaire_fin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
        // Prepare the statement
        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            return json_encode(["success" => false, "message" => "Failed to prepare statement"]);
        }
    
        // Convert boolean days to integer
        $lundi = $days['lundi'] ? 1 : 0;
        $mardi = $days['mardi'] ? 1 : 0;
        $mercredi = $days['mercredi'] ? 1 : 0;
        $jeudi = $days['jeudi'] ? 1 : 0;
        $vendredi = $days['vendredi'] ? 1 : 0;
        $samedi = $days['samedi'] ? 1 : 0;
        $dimanche = $days['dimanche'] ? 1 : 0;
    
        // Correct the types in bind_param()
        $stmt->bind_param("ssiiiiiiiiiiss", 
            $name, 
            $type, 
            $nbr_limit,
            $coachid,
            $price,
            $lundi,
            $mardi,
            $mercredi,
            $jeudi,
            $vendredi,
            $samedi,
            $dimanche,
            $horaire_debut,
            $horaire_fin
        );
    
        $stmt->execute();
    
        if ($stmt->affected_rows > 0) {
            return json_encode(["success" => true, "message" => "Groupe created successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Groupe creation failed"]);
        }
    }
    
    

    public function updateGroupeById($groupeData) {
        if (isset($groupeData['id'], $groupeData['name'], $groupeData['type'], $groupeData['nbr_limit'])) {
            // Assuming that the $groupeData array contains keys for each column in the groupes table
            $sql = "UPDATE groupes SET name = ?, type = ?, nbr_limit = ?, coachid = ?, price = ?, lundi = ?, mardi = ?, mercredi = ?, jeudi = ?, vendredi = ?, samedi = ?, dimanche = ?, horaire_debut = ?, horaire_fin = ? WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
    
            $stmt->bind_param(
                "ssiiiiiiiiiissi", 
                $groupeData['name'],
                $groupeData['type'],
                $groupeData['nbr_limit'],
                $groupeData['coachid'],
                $groupeData['price'],
                $groupeData['lundi'],
                $groupeData['mardi'],
                $groupeData['mercredi'],
                $groupeData['jeudi'],
                $groupeData['vendredi'],
                $groupeData['samedi'],
                $groupeData['dimanche'],
                $groupeData['horaire_debut'],
                $groupeData['horaire_fin'],
                $groupeData['id']
            );
    
            $stmt->execute();
            return json_encode($stmt->affected_rows > 0 ?
                ["success" => true, "message" => "Groupe updated successfully"] :
                ["success" => false, "message" => "Groupe update failed"]);
        } else {
            throw new Exception("Missing parameters in groupeData array.");
        }
    }

    public function deleteGroupeById($id) {
        $sql = "DELETE FROM groupes WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return json_encode($stmt->affected_rows > 0 ?
            ["success" => true, "message" => "Groupe deleted successfully"] :
            ["success" => false, "message" => "Groupe deletion failed"]);
    }
    public function addInscription($groupId, $userId) {
        // First, check if the user is already subscribed to the group
        $checkSql = "SELECT * FROM groupe_students WHERE groupeId = ? AND userId = ?";
        $checkStmt = $this->conn->prepare($checkSql);
        $checkStmt->bind_param("ii", $groupId, $userId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
    
        if ($checkResult->num_rows > 0) {
            // User is already subscribed
            return json_encode(["success" => false, "message" => "User is already subscribed to this group"]);
        }
    
        // Check the number of students and the limit
        $sql = "SELECT nbr_students, nbr_limit FROM groupes WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $groupId);
        $stmt->execute();
        $groupResult = $stmt->get_result()->fetch_assoc();
        
        if (!$groupResult || $groupResult['nbr_students'] >= $groupResult['nbr_limit']) {
            return json_encode(["success" => false, "message" => "Group is at full capacity"]);
        }
        
        // Proceed with adding the student to the group
        $insertSql = "INSERT INTO groupe_students (groupeId, userId, inscription_date) VALUES (?, ?, CURRENT_TIMESTAMP)";
        $insertStmt = $this->conn->prepare($insertSql);
        $insertStmt->bind_param("ii", $groupId, $userId);
        $insertStmt->execute();
        if ($insertStmt->affected_rows > 0) {
            $this->updateStudentCount($groupId, 1); // Increment nbr_students for the group
            return json_encode(["success" => true, "message" => "Inscription added successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Failed to add inscription"]);
        }
    }
    
    
    public function deleteInscription($groupId, $userId) {
        // Delete the inscription
        $sql = "DELETE FROM groupe_students WHERE groupeId = ? AND userId = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $groupId, $userId);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $this->updateStudentCount($groupId, -1); // Decrement nbr_students for the group
            return json_encode(["success" => true, "message" => "Inscription deleted successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Failed to delete inscription"]);
        }
    }
    
    private function updateStudentCount($groupId, $delta) {
        $sql = "UPDATE groupes SET nbr_students = nbr_students + ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $delta, $groupId);
        $stmt->execute();
    }

    public function mySubscriptions($userId) {
        $sql = "SELECT g.* FROM groupes g 
                INNER JOIN groupe_students gs ON g.id = gs.groupeId 
                WHERE gs.userId = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    // Function to retrieve all students in a particular group
    public function groupeStudents($groupId) {
        $sql = "SELECT u.* FROM users u 
                INNER JOIN groupe_students gs ON u.id = gs.userId 
                WHERE gs.groupeId = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $groupId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function __destruct() {
        $this->conn->close();
    }

}

?>
