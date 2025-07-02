<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require './db.php';

$res = $conn->query("SELECT SUM(stock) as total_stock FROM products");
$row = $res->fetch_assoc();
echo json_encode(['total_stock' => intval($row['total_stock'])]);
$conn->close();
?>