<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    sendResponse(['message' => 'Email harus diisi'], 400);
}

// Cek apakah email ada di database
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    // Logika pengiriman email (gunakan fungsi mail() PHP atau library PHPMailer)
    // Untuk demo, kita asumsikan berhasil
    
    // 1. Generate Token (simpan di DB tabel password_resets jika perlu)
    $token = bin2hex(random_bytes(32));
    
    // 2. Kirim Link: https://domain-anda.com/reset-password?token=$token
    // mail($email, "Reset Password SOOD", "Klik link ini: ...");
    
    sendResponse(['message' => 'Instruksi reset password telah dikirim ke email Anda (Simulasi).']);
} else {
    // Tetap beri respon sukses (untuk keamanan agar tidak ketahuan email mana yang terdaftar)
    sendResponse(['message' => 'Jika email Anda terdaftar, instruksi akan dikirim.']);
}
?>