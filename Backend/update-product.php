<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require './db.php';

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id'] ?? 0);
$name = trim($data['name'] ?? '');
$description = trim($data['description'] ?? '');
$price = floatval($data['price'] ?? 0);
$stock = intval($data['stock'] ?? 0);

// Validate input
if ($id <= 0 || empty($name) || $price <= 0 || $stock < 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid or missing data.']);
    exit;
}

// Prepare and execute the update
$stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, stock=? WHERE id=?");
$stmt->bind_param("ssdii", $name, $description, $price, $stock, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}

$stmt->close();
$conn->close();