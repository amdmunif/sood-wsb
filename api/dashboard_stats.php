<?php
ob_start();
include 'db.php';

if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

$user = $_SESSION['user'];
$stats = [
    'total_pkbm' => 0,
    'total_students' => 0,
    'total_users' => 0,
    'average_grade' => 0,
    'pkbm_performance' => [],
    'recent_announcements' => []
];

try {
    if ($user['role'] === 'Super Admin') {
        $stats['total_pkbm'] = (int)$pdo->query("SELECT COUNT(*) FROM pkbm")->fetchColumn();
        $stats['total_students'] = (int)$pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
        $stats['total_users'] = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $stats['average_grade'] = (float)($pdo->query("SELECT AVG(score) FROM grades")->fetchColumn() ?: 0);
        
        $stats['pkbm_performance'] = $pdo->query("
            SELECT p.name, COALESCE(AVG(g.score), 0) as score 
            FROM pkbm p 
            LEFT JOIN students s ON p.id = s.pkbm_id 
            LEFT JOIN grades g ON s.id = g.student_id 
            GROUP BY p.id 
            ORDER BY score DESC 
            LIMIT 5
        ")->fetchAll();
    } else {
        $pkbmId = $user['pkbm_id'] ?? 0;
        
        $stmtStudents = $pdo->prepare("SELECT COUNT(*) FROM students WHERE pkbm_id = ?");
        $stmtStudents->execute([$pkbmId]);
        $stats['total_students'] = (int)$stmtStudents->fetchColumn();
        
        $stmtUsers = $pdo->prepare("SELECT COUNT(*) FROM users WHERE pkbm_id = ?");
        $stmtUsers->execute([$pkbmId]);
        $stats['total_users'] = (int)$stmtUsers->fetchColumn();

        $stmtAvg = $pdo->prepare("
            SELECT AVG(g.score) 
            FROM grades g 
            JOIN students s ON g.student_id = s.id 
            WHERE s.pkbm_id = ?
        ");
        $stmtAvg->execute([$pkbmId]);
        $stats['average_grade'] = (float)($stmtAvg->fetchColumn() ?: 0);
        
        // Untuk Admin PKBM, kita tampilkan top 5 siswa dengan nilai tertinggi di unitnya
        $stmtPerf = $pdo->prepare("
            SELECT s.name, COALESCE(AVG(g.score), 0) as score
            FROM students s
            LEFT JOIN grades g ON s.id = g.student_id
            WHERE s.pkbm_id = ?
            GROUP BY s.id
            ORDER BY score DESC
            LIMIT 5
        ");
        $stmtPerf->execute([$pkbmId]);
        $stats['pkbm_performance'] = $stmtPerf->fetchAll();
    }

    $stats['recent_announcements'] = $pdo->query("SELECT id, title, created_at FROM announcements ORDER BY created_at DESC LIMIT 5")->fetchAll();

    ob_clean();
    sendResponse($stats);
} catch (Exception $e) {
    ob_clean();
    sendResponse(['message' => 'Internal Server Error: ' . $e->getMessage()], 500);
}
?>