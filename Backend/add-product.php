<?php
// add-product.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require './db.php';

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name'] ?? '');
$description = trim($data['description'] ?? '');
$stock = intval($data['stock'] ?? 0);
$price = floatval($data['price'] ?? 0);
$image_url = trim($data['image_url'] ?? '');


// file_put_contents('php://stderr', print_r($data, true)); // This logs to your PHP terminal
// echo json_encode([
//     'debug' => [
//         'name' => $name,
//         'description' => $description,
//         'stock' => $stock,
//         'price' => $price,
//         'image_url' => $image_url,
//         'raw_data' => $data
//     ]
// ]);
// exit;

if (empty($name) || $stock <= 0 || $price <= 0 || empty($image_url)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing data.']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssdis", $name, $description, $price, $stock, $image_url);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Product added successfully.']);
} else {
     echo json_encode([
        'status' => 'error',
        'message' => 'Failed to add product.',
        'mysql_error' => $stmt->error ]);// Add this line
}

$stmt->close();
$conn->close();
?>