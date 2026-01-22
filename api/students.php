<?php
ob_start();
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

$user = $_SESSION['user'];

switch ($method) {
    case 'GET':
        try {
            // Base query dengan alias yang konsisten untuk Frontend
            // Menggunakan LEFT JOIN agar jika PKBM bermasalah, data murid tetap bisa ditarik
            $baseSql = "SELECT s.*, p.name as pkbm_name, 
                        p.head_name as headmaster_name, 
                        p.teacher_name as homeroom_teacher_name 
                        FROM students s 
                        LEFT JOIN pkbm p ON s.pkbm_id = p.id";

            if ($user['role'] === 'Super Admin') {
                if (isset($_GET['pkbm_id']) && !empty($_GET['pkbm_id'])) {
                    $stmt = $pdo->prepare("$baseSql WHERE s.pkbm_id = ? ORDER BY s.name ASC");
                    $stmt->execute([$_GET['pkbm_id']]);
                } else {
                    $stmt = $pdo->query("$baseSql ORDER BY s.name ASC");
                }
            } else {
                $stmt = $pdo->prepare("$baseSql WHERE s.pkbm_id = ? ORDER BY s.name ASC");
                $stmt->execute([$user['pkbm_id']]);
            }

            $results = $stmt->fetchAll();
            ob_clean();
            sendResponse($results);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal mengambil data murid. Pastikan kolom head_name dan teacher_name sudah ada di tabel pkbm. Detail: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['name']))
                throw new Exception("Nama wajib diisi.");

            $pkbmId = ($user['role'] === 'Super Admin') ? ($data['pkbm_id'] ?? null) : $user['pkbm_id'];
            if (!$pkbmId)
                throw new Exception("ID Unit PKBM tidak ditemukan.");

            // Generate NIS
            // Format: YYYYPPNNN (YYYY=Tahun, PP=Kode PKBM (ID pad 2), NNN=Urut)
            $year = date('Y');
            $pkbmCode = str_pad($pkbmId, 2, '0', STR_PAD_LEFT);

            // Hitung urutan
            $stmtCount = $pdo->prepare("SELECT COUNT(*) FROM students WHERE pkbm_id = ?");
            $stmtCount->execute([$pkbmId]);
            $count = $stmtCount->fetchColumn();
            $sequence = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

            $nis = $year . $pkbmCode . $sequence;

            $stmt = $pdo->prepare("INSERT INTO students (name, email, nik, nis, pkbm_id) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['email'] ?? null,
                $data['nik'] ?? null,
                $nis,
                $pkbmId
            ]);

            ob_clean();
            sendResponse(['message' => 'Peserta didik berhasil ditambahkan', 'nis' => $nis]);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if (empty($data['id']) || empty($data['name']) || empty($data['email']))
                throw new Exception("Data tidak lengkap.");

            $stmt = $pdo->prepare("UPDATE students SET name=?, email=? WHERE id=?");
            $stmt->execute([$data['name'], $data['email'], $data['id']]);

            ob_clean();
            sendResponse(['message' => 'Data peserta didik diperbarui']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        try {
            $id = $_GET['id'] ?? null;
            if (!$id)
                throw new Exception("ID tidak valid.");
            $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
            $stmt->execute([$id]);
            ob_clean();
            sendResponse(['message' => 'Peserta didik dihapus']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => $e->getMessage()], 500);
        }
        break;
}
?>