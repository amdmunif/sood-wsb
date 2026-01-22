<?php
// Script ini untuk menjalankan migration SQL secara otomatis
// Akses via browser: /api/migrate.php?key=RAHASIA

include_once __DIR__ . '/db.php';

// Coba load dari config.php jika ada
if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

$secretKey = defined('MIGRATION_KEY') ? MIGRATION_KEY : getenv('MIGRATION_KEY');
if (!$secretKey)
    $secretKey = 'RAHASIA_DEFAULT';

if (!isset($_GET['key']) || $_GET['key'] !== $secretKey) {
    die('Akses ditolak.');
}

$sqlFile = __DIR__ . '/migration_v2.sql';
if (!file_exists($sqlFile)) {
    die('File migration tidak ditemukan.');
}

$sql = file_get_contents($sqlFile);

try {
    $pdo->exec($sql);
    echo "Migration berhasil dijalankan!";
} catch (PDOException $e) {
    echo "Migration gagal: " . $e->getMessage();
}
?>