<?php
include 'db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
    sendResponse(['message' => 'Unauthorized'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO modules (subject_id, name) VALUES (?, ?)");
        $stmt->execute([$data['subject_id'], $data['name']]);
        sendResponse(['id' => $pdo->lastInsertId(), 'name' => $data['name'], 'subject_id' => $data['subject_id']]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM modules WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(['message' => 'Modul berhasil dihapus']);
        break;
}
?>