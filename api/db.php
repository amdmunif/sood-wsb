<?php
// Pengaturan CORS agar Frontend React bisa memanggil API ini
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Mulai session untuk login
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- KONFIGURASI DATABASE ---
$host = 'localhost';
$db   = 'gjmetony_sood'; 
$user = 'gjmetony_sood';  
$pass = 'm(7;Sp0PA3aD8d'; 
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Koneksi Database Gagal: ' . $e->getMessage()]);
    exit;
}

// Helper untuk mengirim response JSON
function sendResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}
?>