<?php
header('Content-Type: application/json');
require './db.php';

$result = $conn->query("SELECT COUNT(*) as total FROM products");
$row = $result->fetch_assoc();
echo json_encode(['total' => intval($row['total'])]);
$conn->close();