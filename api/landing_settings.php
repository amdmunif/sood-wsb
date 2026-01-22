<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Mengambil pengaturan (Dapat diakses publik)
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM landing_page_settings LIMIT 1");
    $settings = $stmt->fetch();
    if (!$settings) {
        $settings = [
            'hero_title' => 'Sekolah Online Orang Dewasa',
            'hero_subtitle' => 'Pemerintah Kabupaten Wonosobo',
            'hero_cta_text' => 'Lihat Daftar PKBM',
            'hero_cta_url' => '/pkbm'
        ];
    }
    sendResponse($settings);
}

// Menyimpan pengaturan (Hanya Super Admin)
if ($method === 'POST') {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
        sendResponse(['message' => 'Akses ditolak. Anda bukan Super Admin.'], 403);
    }

    $data = $_POST;
    $uploads_dir = '../uploads';
    if (!is_dir($uploads_dir)) {
        mkdir($uploads_dir, 0755, true);
    }

    $fields_to_update = [];
    $params = [];

    $text_fields = [
        'hero_title', 'hero_subtitle', 'hero_cta_text', 'hero_cta_url', 
        'about_title', 'about_content', 'contact_address', 
        'contact_email', 'contact_phone', 'tutorial_video_url'
    ];
    
    foreach ($text_fields as $f) {
        if (isset($data[$f])) {
            $fields_to_update[] = "$f = ?";
            $params[] = $data[$f];
        }
    }

    $files = [
        'logo_file' => 'logo_url',
        'favicon_file' => 'favicon_url',
        'hero_image_file' => 'hero_image_url',
        'tutorial_pdf_file' => 'tutorial_pdf_url'
    ];

    foreach ($files as $key => $db_field) {
        if (isset($_FILES[$key]) && $_FILES[$key]['error'] === UPLOAD_ERR_OK) {
            $ext = pathinfo($_FILES[$key]['name'], PATHINFO_EXTENSION);
            $filename = $db_field . '_' . time() . '.' . $ext;
            $dest = $uploads_dir . '/' . $filename;
            
            if (move_uploaded_file($_FILES[$key]['tmp_name'], $dest)) {
                $fields_to_update[] = "$db_field = ?";
                $params[] = '/uploads/' . $filename;
            }
        }
    }

    if (!empty($fields_to_update)) {
        // Pastikan baris pertama ada
        $check = $pdo->query("SELECT id FROM landing_page_settings WHERE id = 1")->fetch();
        if (!$check) {
            $pdo->query("INSERT INTO landing_page_settings (id) VALUES (1)");
        }
        
        $sql = "UPDATE landing_page_settings SET " . implode(', ', $fields_to_update) . " WHERE id = 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    sendResponse(['message' => 'Pengaturan website berhasil disimpan']);
}
?>