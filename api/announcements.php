<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM announcements ORDER BY created_at DESC");
        sendResponse($stmt->fetchAll());
        break;

    case 'POST':
        if (!isset($_SESSION['user'])) sendResponse(['message' => 'Unauthorized'], 401);
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO announcements (title, content) VALUES (?, ?)");
        $stmt->execute([$data['title'], $data['content']]);
        sendResponse(['message' => 'Pengumuman berhasil dibuat']);
        break;

    case 'PUT':
        if (!isset($_SESSION['user'])) sendResponse(['message' => 'Unauthorized'], 401);
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE announcements SET title = ?, content = ? WHERE id = ?");
        $stmt->execute([$data['title'], $data['content'], $data['id']]);
        sendResponse(['message' => 'Pengumuman diperbarui']);
        break;

    case 'DELETE':
        if (!isset($_SESSION['user'])) sendResponse(['message' => 'Unauthorized'], 401);
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM announcements WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['message' => 'Pengumuman dihapus']);
        break;
}
?>