<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require './db.php';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

$result = $conn->query("SELECT * FROM products WHERE id = $id LIMIT 1");
if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Product not found']);
}
$conn->close();