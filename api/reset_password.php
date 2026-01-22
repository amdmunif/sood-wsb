<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$token = $data['token'] ?? '';
$newPassword = $data['password'] ?? '';

if (empty($token) || empty($newPassword)) {
    sendResponse(['message' => 'Data tidak lengkap'], 400);
}

// 1. Verifikasi Token (dalam implementasi nyata, cek tabel password_resets)
// 2. Jika valid, update password user yang memiliki token tersebut

// Contoh logika update langsung (SIMULASI):
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

// Asumsi kita tahu emailnya dari token yang valid
// $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
// $stmt->execute([$hash, $email_dari_token]);

sendResponse(['message' => 'Password Anda berhasil diperbarui. Silakan login kembali.']);
?>