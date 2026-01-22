<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Middleware: Untuk modifikasi data (POST, PUT, DELETE), harus login sebagai Super Admin
if ($method !== 'GET') {
    if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
        sendResponse(['message' => 'Akses ditolak. Hanya Super Admin yang dapat mengubah struktur kurikulum.'], 403);
    }
}

switch($method) {
    case 'GET':
        // Ambil semua Mata Pelajaran beserta Modul di dalamnya, diurutkan berdasarkan ID
        $subjects = $pdo->query("SELECT * FROM subjects ORDER BY id ASC")->fetchAll();
        foreach($subjects as &$subject) {
            $stmt = $pdo->prepare("SELECT * FROM modules WHERE subject_id = ? ORDER BY id ASC");
            $stmt->execute([$subject['id']]);
            $subject['modules'] = $stmt->fetchAll();
        }
        sendResponse($subjects);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $type = $data['type'] ?? 'subject'; // 'subject' atau 'module'

        if ($type === 'subject') {
            $stmt = $pdo->prepare("INSERT INTO subjects (name) VALUES (?)");
            $stmt->execute([$data['name']]);
            sendResponse(['id' => $pdo->lastInsertId(), 'name' => $data['name'], 'modules' => []]);
        } else {
            // Tambah Modul ke dalam Mapel
            $stmt = $pdo->prepare("INSERT INTO modules (subject_id, name) VALUES (?, ?)");
            $stmt->execute([$data['subject_id'], $data['name']]);
            sendResponse(['id' => $pdo->lastInsertId(), 'name' => $data['name'], 'subject_id' => $data['subject_id']]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $type = $data['type'] ?? 'subject';

        if ($type === 'subject') {
            $stmt = $pdo->prepare("UPDATE subjects SET name = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['id']]);
            sendResponse(['message' => 'Mata pelajaran berhasil diperbarui']);
        } else {
            $stmt = $pdo->prepare("UPDATE modules SET name = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['id']]);
            sendResponse(['message' => 'Modul berhasil diperbarui']);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $type = $_GET['type'] ?? 'subject';

        if ($type === 'subject') {
            // Menghapus Mapel akan menghapus semua Modul di dalamnya (Cascade di Database)
            $stmt = $pdo->prepare("DELETE FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(['message' => 'Mata pelajaran dan modul terkait berhasil dihapus']);
        } else {
            $stmt = $pdo->prepare("DELETE FROM modules WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(['message' => 'Modul berhasil dihapus']);
        }
        break;
}
?>