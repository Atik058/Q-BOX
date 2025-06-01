<?php
// login.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Debug log
error_log("Raw input: " . file_get_contents('php://input'));
error_log("POST data: " . print_r($_POST, true));

// Parse the raw input if needed
$rawData = file_get_contents('php://input');
parse_str($rawData, $parsedData);

// Include DB connection
require './db.php';

// Read POST data, try both $_POST and parsed data
$email = isset($_POST['email']) ? trim($_POST['email']) : (isset($parsedData['email']) ? trim($parsedData['email']) : '');
$password = isset($_POST['password']) ? trim($_POST['password']) : (isset($parsedData['password']) ? trim($parsedData['password']) : '');

// Debug log
error_log("Processed data - Email: '$email', Password length: " . strlen($password));

// Validate inputs
if (empty($email) || empty($password)) {
    error_log("Validation failed - Empty fields");
    echo json_encode([
        'status' => 'error', 
        'message' => 'Email and password are required.',
        'debug' => [
            'email' => $email,
            'password_length' => strlen($password)
        ]
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Check user credentials
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email or password.']);
    $stmt->close();
    exit;
}

// Login successful
echo json_encode([
    'status' => 'success',
    'message' => 'Login successful.',
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email']
    ]
]);

$stmt->close();
$conn->close();
?> 