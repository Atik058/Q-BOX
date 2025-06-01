<?php
// signup.php

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
$name = isset($_POST['name']) ? trim($_POST['name']) : (isset($parsedData['name']) ? trim($parsedData['name']) : '');
$email = isset($_POST['email']) ? trim($_POST['email']) : (isset($parsedData['email']) ? trim($parsedData['email']) : '');
$password = isset($_POST['password']) ? trim($_POST['password']) : (isset($parsedData['password']) ? trim($parsedData['password']) : '');

// Debug log
error_log("Processed data - Name: '$name', Email: '$email', Password length: " . strlen($password));

// Validate inputs
if (empty($name) || empty($email) || empty($password)) {
    error_log("Validation failed - Empty fields");
    echo json_encode([
        'status' => 'error', 
        'message' => 'All fields are required.',
        'debug' => [
            'name' => $name,
            'email' => $email,
            'password_length' => strlen($password),
            'raw_post' => $_POST,
            'parsed_data' => $parsedData
        ]
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit;
}

// Check if email already exists
$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$result = $checkStmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Hash password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Insert user
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    // Get the inserted user's data
    $userId = $conn->insert_id;
    $userStmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $userStmt->bind_param("i", $userId);
    $userStmt->execute();
    $userResult = $userStmt->get_result();
    $user = $userResult->fetch_assoc();
    $userStmt->close();

    // Convert id to string
    $user['id'] = (string)$user['id'];

    echo json_encode([
        'status' => 'success', 
        'message' => 'Signup successful.',
        'user' => $user
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
}

$stmt->close();
$conn->close();
?> 