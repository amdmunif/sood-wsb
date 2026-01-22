<?php
include 'db.php';

if (!isset($_SESSION['user']))
    sendResponse(['message' => 'Unauthorized'], 401);
$user = $_SESSION['user'];
$type = $_GET['type'] ?? '';

switch ($type) {
    case 'pkbm':
        if ($user['role'] !== 'Super Admin')
            sendResponse(['message' => 'Forbidden'], 403);
        $sql = "SELECT p.id, p.name, 
                       (SELECT COUNT(*) FROM students WHERE pkbm_id = p.id) as student_count,
                       COALESCE((SELECT AVG(g.score) FROM grades g JOIN students s ON g.student_id = s.id WHERE s.pkbm_id = p.id), 0) as average_score
                FROM pkbm p ORDER BY average_score DESC";
        sendResponse($pdo->query($sql)->fetchAll());
        break;

    case 'student':
        $pkbm_filter = ($user['role'] === 'Super Admin') ? "" : "WHERE s.pkbm_id = " . (int) $user['pkbm_id'];
        $sql = "SELECT s.id, s.name, p.name as pkbm_name,
                       (SELECT COUNT(*) FROM grades WHERE student_id = s.id) as modules_completed,
                       COALESCE((SELECT AVG(score) FROM grades WHERE student_id = s.id), 0) as average_score
                FROM students s 
                JOIN pkbm p ON s.pkbm_id = p.id 
                $pkbm_filter 
                ORDER BY average_score DESC";
        sendResponse($pdo->query($sql)->fetchAll());
        break;

    case 'subject':
        $pkbm_join = ($user['role'] === 'Super Admin') ? "" : "JOIN students s ON g.student_id = s.id";
        $pkbm_where = ($user['role'] === 'Super Admin') ? "" : "AND s.pkbm_id = " . (int) $user['pkbm_id'];

        $sql = "SELECT sub.id, sub.name,
                       COALESCE((SELECT AVG(g.score) 
                        FROM grades g 
                        JOIN modules m ON g.module_id = m.id 
                        $pkbm_join
                        WHERE m.subject_id = sub.id $pkbm_where), 0) as average_score
                FROM subjects sub ORDER BY sub.name ASC";
        sendResponse($pdo->query($sql)->fetchAll());
        break;

    case 'matrix':
        $pkbm_id = $_GET['pkbm_id'] ?? 'all';
        $pkbm_filter = ($pkbm_id === 'all') ? "" : "WHERE s.pkbm_id = " . (int) $pkbm_id;
        if ($user['role'] !== 'Super Admin' && $pkbm_id == 'all') {
            $pkbm_filter = "WHERE s.pkbm_id = " . (int) $user['pkbm_id'];
        }

        // 1. Ambil Struktur Mapel & Modul
        $subjects = $pdo->query("SELECT s.*, c.name as category_name, c.sort_order as cat_order 
                                 FROM subjects s 
                                 LEFT JOIN subject_categories c ON s.category_id = c.id 
                                 ORDER BY c.sort_order ASC, s.sort_order ASC, s.id ASC")->fetchAll();
        foreach ($subjects as &$sub) {
            $stmt = $pdo->prepare("SELECT id, name FROM modules WHERE subject_id = ? ORDER BY id ASC");
            $stmt->execute([$sub['id']]);
            $sub['modules'] = $stmt->fetchAll();
        }

        // 2. Ambil Peserta
        $students_stmt = $pdo->query("SELECT s.id, s.name, p.name as pkbm_name FROM students s JOIN pkbm p ON s.pkbm_id = p.id $pkbm_filter ORDER BY s.name ASC");
        $students = $students_stmt->fetchAll();

        // 3. Ambil Semua Nilai untuk filter ini
        $grades_sql = "SELECT g.student_id, g.module_id, g.score 
                       FROM grades g 
                       JOIN students s ON g.student_id = s.id 
                       $pkbm_filter";
        $grades_stmt = $pdo->query($grades_sql);
        $grades_raw = $grades_stmt->fetchAll();

        $matrix = [];
        foreach ($students as $student) {
            $student_grades = [];
            foreach ($grades_raw as $g) {
                if ($g['student_id'] == $student['id']) {
                    $student_grades[$g['module_id']] = (int) $g['score'];
                }
            }
            $matrix[] = [
                'id' => $student['id'],
                'name' => $student['name'],
                'pkbm' => $student['pkbm_name'],
                'grades' => $student_grades
            ];
        }

        sendResponse([
            'subjects' => $subjects,
            'matrix' => $matrix
        ]);
        break;

    default:
        sendResponse(['message' => 'Tipe laporan tidak valid'], 400);
}
?>