<?php
// Pengaturan CORS agar Frontend React bisa memanggil API ini
// Allow requests from any origin, but echoing back the origin is safer for credentials
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
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
// Coba load dari config.php jika ada (untuk development lokal)
if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

$host = defined('DB_HOST') ? DB_HOST : getenv('DB_HOST');
$db = defined('DB_NAME') ? DB_NAME : getenv('DB_NAME');
$user = defined('DB_USER') ? DB_USER : getenv('DB_USER');
$pass = defined('DB_PASS') ? DB_PASS : getenv('DB_PASS');
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Koneksi Database Gagal: ' . $e->getMessage()]);
    exit;
}

// Helper untuk mengirim response JSON
function sendResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}
?>