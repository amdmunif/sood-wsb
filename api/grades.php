<?php
ob_start();
include 'db.php';

if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && isset($_GET['student_id'])) {
    try {
        $stmt = $pdo->prepare("SELECT module_id, score FROM grades WHERE student_id = ?");
        $stmt->execute([$_GET['student_id']]);
        $results = $stmt->fetchAll();
        
        $grades = [];
        foreach($results as $r) {
            $grades[$r['module_id']] = (int)$r['score'];
        }
        ob_clean();
        sendResponse($grades);
    } catch (Exception $e) {
        ob_clean();
        sendResponse(['message' => $e->getMessage()], 500);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $student_id = $data['student_id'] ?? null;
    $grades = $data['grades'] ?? [];

    if (!$student_id) {
        ob_clean();
        sendResponse(['message' => 'ID Siswa diperlukan'], 400);
    }

    $pdo->beginTransaction();
    try {
        foreach($grades as $module_id => $score) {
            if ($score === null || $score === "") {
                $stmt = $pdo->prepare("DELETE FROM grades WHERE student_id = ? AND module_id = ?");
                $stmt->execute([$student_id, $module_id]);
            } else {
                $scoreInt = (int)$score;
                if ($scoreInt >= 0 && $scoreInt <= 100) {
                    $stmt = $pdo->prepare("INSERT INTO grades (student_id, module_id, score) VALUES (?, ?, ?) 
                                           ON DUPLICATE KEY UPDATE score = VALUES(score)");
                    $stmt->execute([$student_id, $module_id, $scoreInt]);
                }
            }
        }
        $pdo->commit();
        ob_clean();
        sendResponse(['message' => 'Nilai berhasil disimpan']);
    } catch (Exception $e) {
        $pdo->rollBack();
        ob_clean();
        sendResponse(['message' => $e->getMessage()], 500);
    }
}
?>