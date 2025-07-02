<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require './db.php';

// Join users table to get username
$res = $conn->query("SELECT c.*, u.name AS username FROM checkouts c LEFT JOIN users u ON c.user_id = u.id WHERE c.status IN ('pending','accepted') ORDER BY c.created_at DESC");
$checkouts = [];
while ($row = $res->fetch_assoc()) {
    $checkouts[] = $row;
}
echo json_encode(['checkouts' => $checkouts]);
$conn->close();
?>