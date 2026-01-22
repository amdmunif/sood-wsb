<?php
ob_start();
include_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Proteksi akses - hanya login users
if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

switch($method) {
    case 'GET':
        try {
            $query = "SELECT * FROM subject_categories ORDER BY sort_order ASC, name ASC";
            $categories = $pdo->query($query)->fetchAll();
            
            // Cast to proper types
            foreach($categories as &$cat) {
                $cat['id'] = (int)$cat['id'];
                $cat['sort_order'] = (int)$cat['sort_order'];
            }
            
            ob_clean();
            sendResponse($categories ? $categories : []);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal mengambil kategori: ' . $e->getMessage()], 500);
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
            sendResponse(['message' => 'Nama kategori wajib diisi'], 400);
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO subject_categories (name, sort_order) VALUES (?, ?)");
            $stmt->execute([$data['name'], $data['sort_order'] ?? 0]);
            $newId = $pdo->lastInsertId();
            
            ob_clean();
            sendResponse([
                'id' => (int)$newId, 
                'name' => $data['name'], 
                'sort_order' => (int)($data['sort_order'] ?? 0)
            ]);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal menambah kategori: ' . $e->getMessage()], 500);
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
            sendResponse(['message' => 'ID kategori wajib diisi'], 400);
        }

        try {
            if (isset($data['name']) && isset($data['sort_order'])) {
                $stmt = $pdo->prepare("UPDATE subject_categories SET name = ?, sort_order = ? WHERE id = ?");
                $stmt->execute([$data['name'], $data['sort_order'], $data['id']]);
            } elseif (isset($data['name'])) {
                $stmt = $pdo->prepare("UPDATE subject_categories SET name = ? WHERE id = ?");
                $stmt->execute([$data['name'], $data['id']]);
            } elseif (isset($data['sort_order'])) {
                // Support update sort_order only (for drag-drop)
                $stmt = $pdo->prepare("UPDATE subject_categories SET sort_order = ? WHERE id = ?");
                $stmt->execute([$data['sort_order'], $data['id']]);
            }
            
            ob_clean();
            sendResponse(['message' => 'Kategori diperbarui']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal update kategori: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        if ($_SESSION['user']['role'] !== 'Super Admin') {
            ob_clean();
            sendResponse(['message' => 'Forbidden'], 403);
        }
        $id = $_GET['id'] ?? null;
        if (!$id) {
            ob_clean();
            sendResponse(['message' => 'ID wajib diisi'], 400);
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM subject_categories WHERE id = ?");
            $stmt->execute([$id]);
            ob_clean();
            sendResponse(['message' => 'Kategori dihapus']);
        } catch (Exception $e) {
            ob_clean();
            sendResponse(['message' => 'Gagal hapus kategori: ' . $e->getMessage()], 500);
        }
        break;
}
?>
