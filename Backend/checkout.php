<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require './db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = intval($data['user_id'] ?? 0);
$items = $data['items'] ?? [];
$total = floatval($data['total'] ?? 0);

if ($user_id <= 0 || empty($items) || $total <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data']);
    exit;
}

$items_json = json_encode($items);

$stmt = $conn->prepare("INSERT INTO checkouts (user_id, items, total) VALUES (?, ?, ?)");
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare failed', 'mysql_error' => $conn->error]);
    $conn->close();
    exit;
}
$stmt->bind_param("isd", $user_id, $items_json, $total);

if ($stmt->execute()) {
    // Here you could notify admin (e.g., via email, push, or polling)
    echo json_encode(['status' => 'success', 'checkout_id' => $stmt->insert_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Checkout failed', 'mysql_error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>