<?php
// Script untuk membuat akun Super Admin pertama kali
// Akses via browser: /api/seed_admin.php?key=RAHASIA

include_once __DIR__ . '/db.php';
// Coba load config untuk key
if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

$secretKey = defined('MIGRATION_KEY') ? MIGRATION_KEY : getenv('MIGRATION_KEY');
if (!$secretKey)
    $secretKey = 'RAHASIA_DEFAULT';

if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
    die('Akses ditolak.');
}

$email = 'admin@sood.com';
$password = 'admin123'; // Password default
$name = 'Super Admin';

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo "User Super Admin ($email) sudah ada.";
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'Super Admin')");
        $stmt->execute([$name, $email, $hash]);
        echo "Berhasil membuat Super Admin.<br>Email: $email<br>Password: $password";
    }
} catch (PDOException $e) {
    echo "Gagal: " . $e->getMessage();
}
?>