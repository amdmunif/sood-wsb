<?php
require_once 'db.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Akses ditolak.']);
    exit();
}

if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $target_dir = realpath(dirname(__FILE__) . '/../uploads') . '/';
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0775, true);
    }

    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/x-icon', 'image/svg+xml', 'image/webp'];
    if (!in_array(mime_content_type($_FILES['file']['tmp_name']), $allowed_types)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Tipe file tidak diizinkan.']);
        exit();
    }
    
    $file_extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $safe_filename = uniqid('sood_', true) . '.' . strtolower($file_extension);
    
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_dir . $safe_filename)) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
        $domain = $_SERVER['HTTP_HOST'];
        $public_url = $protocol . '://' . $domain . '/uploads/' . $safe_filename;
        echo json_encode(['success' => true, 'url' => $public_url]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tidak ada file diupload atau terjadi error.']);
}
?>