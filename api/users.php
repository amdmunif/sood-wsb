<?php
include 'db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
    sendResponse(['message' => 'Unauthorized'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT u.*, p.name as pkbm_name FROM users u LEFT JOIN pkbm p ON u.pkbm_id = p.id ORDER BY u.role ASC, u.name ASC");
        sendResponse($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $hash = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, pkbm_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['name'], $data['email'], $hash, $data['role'], $data['pkbm_id'] ?? null]);
        sendResponse(['message' => 'Pengguna berhasil ditambahkan']);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "UPDATE users SET name = ?, email = ?, role = ?, pkbm_id = ? WHERE id = ?";
        $params = [$data['name'], $data['email'], $data['role'], $data['pkbm_id'] ?? null, $data['id']];
        
        if (!empty($data['password'])) {
            $sql = "UPDATE users SET name = ?, email = ?, role = ?, pkbm_id = ?, password = ? WHERE id = ?";
            $hash = password_hash($data['password'], PASSWORD_DEFAULT);
            $params = [$data['name'], $data['email'], $data['role'], $data['pkbm_id'] ?? null, $hash, $data['id']];
        }
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        sendResponse(['message' => 'Pengguna diperbarui']);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        if ($id == $_SESSION['user']['id']) sendResponse(['message' => 'Tidak bisa menghapus akun sendiri'], 400);
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['message' => 'Pengguna dihapus']);
        break;
}
?>