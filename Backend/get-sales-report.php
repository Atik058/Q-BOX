<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require './db.php';

// Get total checkout amount per day for last 5 days (accepted orders only)
$res = $conn->query("
    SELECT DATE(created_at) as date, SUM(total) as total
    FROM checkouts
    WHERE status = 'accepted' AND created_at >= DATE_SUB(CURDATE(), INTERVAL 4 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date DESC
    LIMIT 5
");
$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}
echo json_encode(['report' => array_reverse($data)]); // reverse for chronological order
$conn->close();
?>