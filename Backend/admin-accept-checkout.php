<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require './db.php';

$data = json_decode(file_get_contents("php://input"), true);
$checkout_id = intval($data['checkout_id'] ?? 0);

if ($checkout_id <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid checkout ID']);
    exit;
}

// Get checkout items
$res = $conn->query("SELECT items FROM checkouts WHERE id = $checkout_id AND status = 'pending'");
if ($row = $res->fetch_assoc()) {
    $items = json_decode($row['items'], true);

    // Deduct stock for each item
    foreach ($items as $item) {
        $product_id = intval($item['id']);
        $qty = intval($item['quantity'] ?? 1);
        $conn->query("UPDATE products SET stock = stock - $qty WHERE id = $product_id AND stock >= $qty");
    }

    // Update checkout status
    $conn->query("UPDATE checkouts SET status = 'accepted' WHERE id = $checkout_id");
    echo json_encode(['status' => 'success', 'message' => 'Checkout accepted and stock updated']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Checkout not found or already processed']);
}

$conn->close();
?>