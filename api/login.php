<?php
include 'db.php'; // Di server ini tetap meng-include .php jika file aslinya .php

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    sendResponse(['message' => 'Email dan password harus diisi'], 400);
}

$stmt = $pdo->prepare("SELECT u.*, p.name as pkbm_name 
                       FROM users u 
                       LEFT JOIN pkbm p ON u.pkbm_id = p.id 
                       WHERE u.email = ?");
$stmt->execute([$data['email']]);
$user = $stmt->fetch();

if ($user && password_verify($data['password'], $user['password'])) {
    unset($user['password']);
    $_SESSION['user'] = $user;
    sendResponse($user);
} else {
    sendResponse(['message' => 'Email atau password salah'], 401);
}
?>