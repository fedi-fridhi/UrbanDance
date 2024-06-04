<?php

class Events {
    private $conn;

    public function __construct() {
        $this->connectDb();
    }

    private function connectDb() {
        include 'config/Database.php'; 
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    public function getAllEvents() {
        $sql = "SELECT * FROM events";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAllNextEvents() {
        $sql = "SELECT * FROM events WHERE e_date > NOW()";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getEventById($id) {
        $sql = "SELECT * FROM events WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function createEvent($name, $description, $price, $bannersrc, $e_date, $coachid, $e_type, $localisation, $limit_subs) {
        $nbr_subs = 0; // Start with zero subscriptions
        $sql = "INSERT INTO events (name, description, price, bannersrc, e_date, coachid, e_type, localisation, limit_subs, nbr_subs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssississii", $name, $description, $price, $bannersrc, $e_date, $coachid, $e_type, $localisation, $limit_subs, $nbr_subs);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            return json_encode(["success" => true, "message" => "Event created successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Event creation failed"]);
        }
    }

    public function updateEventById($eventData) {
        if (isset($eventData['id'], $eventData['name'], $eventData['description'], $eventData['price'], $eventData['bannersrc'], $eventData['e_date'], $eventData['coachid'], $eventData['e_type'], $eventData['localisation'], $eventData['limit_subs'])) {
            $sql = "UPDATE events SET name = ?, description = ?, price = ?, bannersrc = ?, e_date = ?, coachid = ?, e_type = ?, localisation = ?, limit_subs = ? WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
    
            $stmt->bind_param(
                "ssississii", 
                $eventData['name'],
                $eventData['description'],
                $eventData['price'],
                $eventData['bannersrc'],
                $eventData['e_date'],
                $eventData['coachid'],
                $eventData['e_type'],
                $eventData['localisation'],
                $eventData['limit_subs'],
                $eventData['id']
            );
    
            $stmt->execute();
            return json_encode($stmt->affected_rows > 0 ?
                ["success" => true, "message" => "Event updated successfully"] :
                ["success" => false, "message" => "Event update failed"]);
        } else {
            throw new Exception("Missing parameters in eventData array.");
        }
    }

    public function deleteEventById($id) {
        $sql = "DELETE FROM events WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return json_encode($stmt->affected_rows > 0 ?
            ["success" => true, "message" => "Event deleted successfully"] :
            ["success" => false, "message" => "Event deletion failed"]);
    }

    public function addSubscription($eventId, $userId) {
        // Check for event's subscription limit
        $sql = "SELECT nbr_subs, limit_subs FROM events WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $eventResult = $stmt->get_result()->fetch_assoc();

        if ($eventResult['nbr_subs'] >= $eventResult['limit_subs']) {
            return json_encode(["success" => false, "message" => "Subscription limit reached for this event"]);
        }

        // Check if the user is already subscribed
        $sql = "SELECT id FROM event_subs WHERE event_id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventId, $userId);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            return json_encode(["success" => false, "message" => "Already subscribed to this event"]);
        }

        // Proceed with adding subscription
        $sql = "INSERT INTO event_subs (event_id, user_id) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventId, $userId);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $this->updateSubscriptionCount($eventId, 1); // Increment nbr_subs for the event
            return json_encode(["success" => true, "message" => "Subscription added successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Failed to add subscription"]);
        }
    }

    public function deleteSubscription($eventId, $userId) {
        // Delete the subscription
        $sql = "DELETE FROM event_subs WHERE event_id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventId, $userId);
        $stmt->execute();
        if ($stmt->affected_rows > 0) {
            $this->updateSubscriptionCount($eventId, -1); // Decrement nbr_subs for the event
            return json_encode(["success" => true, "message" => "Subscription deleted successfully"]);
        } else {
            return json_encode(["success" => false, "message" => "Failed to delete subscription"]);
        }
    }

    private function updateSubscriptionCount($eventId, $delta) {
        $sql = "UPDATE events SET nbr_subs = nbr_subs + ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $delta, $eventId);
        $stmt->execute();
    }

    
    public function mySubscriptions($userId) {
        $sql = "SELECT events.* FROM events 
                INNER JOIN event_subs ON events.id = event_subs.event_id 
                WHERE event_subs.user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function isSubscribedToEvent($eventId, $userId) {
        $sql = "SELECT id FROM event_subs 
                WHERE event_id = ? AND user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $eventId, $userId);
        $stmt->execute();
        $stmt->store_result();

        return $stmt->num_rows > 0;
    }

    public function EventSubscibers($eventId) {
        $sql = "SELECT users.* FROM users 
                INNER JOIN event_subs ON users.id = event_subs.user_id 
                WHERE event_subs.event_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }


    public function __destruct() {
        $this->conn->close();
    }
}
?>
