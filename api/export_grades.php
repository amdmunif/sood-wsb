<?php
include 'db.php';

if (!isset($_SESSION['user'])) exit("Unauthorized");

$pkbm_id = $_GET['pkbm_id'] ?? 'all';
$pkbm_filter = ($pkbm_id === 'all') ? "" : "WHERE s.pkbm_id = " . (int)$pkbm_id;

// Header untuk download CSV sederhana
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=rekap_nilai_sood.csv');

$output = fopen('php://output', 'w');
fputcsv($output, ['ID Peserta', 'Nama Peserta', 'PKBM', 'Mata Pelajaran', 'Modul', 'Nilai']);

$sql = "SELECT s.id as student_id, s.name as student_name, p.name as pkbm_name,
               sub.name as subject_name, m.name as module_name, g.score
        FROM grades g
        JOIN students s ON g.student_id = s.id
        JOIN pkbm p ON s.pkbm_id = p.id
        JOIN modules m ON g.module_id = m.id
        JOIN subjects sub ON m.subject_id = sub.id
        $pkbm_filter
        ORDER BY p.name, s.name, sub.name, m.name";

$stmt = $pdo->query($sql);
while ($row = $stmt->fetch()) {
    fputcsv($output, $row);
}
fclose($output);
exit;
?>