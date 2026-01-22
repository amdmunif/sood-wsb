<?php
ob_start();
// Menggunakan path absolut untuk keamanan include
include_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Proteksi akses
if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

switch ($method) {
    case 'GET':
        try {
            // Join dengan subject_categories untuk sorting
            // Urutan: Kategori ASC -> Mapel (sort_order) ASC -> Mapel (ID) ASC
            $query = "
                SELECT s.id, s.name, s.sort_order, s.category_id, 
                       c.name as category_name, c.sort_order as category_sort_order
                FROM subjects s
                LEFT JOIN subject_categories c ON s.category_id = c.id
                ORDER BY c.sort_order ASC, s.sort_order ASC, s.id ASC
            ";

            $subjects = $pdo->query($query)->fetchAll();

            // Format output dan ambil modules
            foreach ($subjects as &$subject) {
                // Fetch modules
                $stmt = $pdo->prepare("SELECT id, name FROM modules WHERE subject_id = ? ORDER BY id ASC");
                $stmt->execute([$subject['id']]);
                $modules = $stmt->fetchAll();

                $subject['modules'] = $modules ? $modules : [];

                // Pastikan tipe data numerik benar
                $subject['id'] = (int) $subject['id'];
                $subject['sort_order'] = (int) $subject['sort_order'];
                $subject['category_id'] = $subject['category_id'] ? (int) $subject['category_id'] : null;
                $subject['category_sort_order'] = $subject['category_sort_order'] ? (int) $subject['category_sort_order'] : 9999; // Default sort order besar jika null
            }

            ob_clean();
            sendResponse($subjects ? $subjects : []);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal mengambil data kurikulum: ' . $e->getMessage()], 500);
        }
        break;

    case 'POST':
        if ($_SESSION['user']['role'] !== 'Super Admin') {
            ob_clean();
            sendResponse(['message' => 'Forbidden'], 403);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['name'])) {
            ob_clean();
            sendResponse(['message' => 'Nama mata pelajaran wajib diisi'], 400);
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO subjects (name, sort_order, category_id) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['sort_order'] ?? 0,
                $data['category_id'] ?? null
            ]);
            $newId = $pdo->lastInsertId();

            ob_clean();
            sendResponse([
                'id' => (int) $newId,
                'name' => $data['name'],
                'sort_order' => (int) ($data['sort_order'] ?? 0),
                'category_id' => $data['category_id'] ?? null,
                'modules' => []
            ]);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal menambah mapel: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        if ($_SESSION['user']['role'] !== 'Super Admin') {
            ob_clean();
            sendResponse(['message' => 'Forbidden'], 403);
        }
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            ob_clean();
            sendResponse(['message' => 'ID wajib diisi'], 400);
        }

        try {
            $updateFields = [];
            $params = [];

            if (isset($data['name'])) {
                $updateFields[] = "name = ?";
                $params[] = $data['name'];
            }

            if (isset($data['sort_order'])) {
                $updateFields[] = "sort_order = ?";
                $params[] = $data['sort_order'];
            }

            if (array_key_exists('category_id', $data)) {
                $updateFields[] = "category_id = ?";
                $params[] = $data['category_id'];
            }

            if (empty($updateFields)) {
                ob_clean();
                sendResponse(['message' => 'Tidak ada data yang diubah']);
            }

            $query = "UPDATE subjects SET " . implode(", ", $updateFields) . " WHERE id = ?";
            $params[] = $data['id'];

            $stmt = $pdo->prepare($query);
            $stmt->execute($params);

            ob_clean();
            sendResponse(['message' => 'Mata pelajaran diperbarui']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal update mapel: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        if ($_SESSION['user']['role'] !== 'Super Admin') {
            ob_clean();
            sendResponse(['message' => 'Forbidden'], 403);
        }
        $id = $_GET['id'];
        try {
            $stmt = $pdo->prepare("DELETE FROM subjects WHERE id = ?");
            $stmt->execute([$id]);
            ob_clean();
            sendResponse(['message' => 'Mata pelajaran dihapus']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => $e->getMessage()], 500);
        }
        break;
}
?>