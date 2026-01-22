<?php
ob_start();
include 'db.php';

if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

if (!isset($_FILES['importFile']) || $_FILES['importFile']['error'] !== UPLOAD_ERR_OK) {
    ob_clean();
    sendResponse(['message' => 'Gagal mengunggah file atau file tidak ditemukan'], 400);
}

$fileName = $_FILES['importFile']['tmp_name'];
$handle = fopen($fileName, "r");

// Deteksi Delimiter (koma atau titik koma)
$firstLine = fgets($handle);
$delimiter = (strpos($firstLine, ';') !== false) ? ';' : ',';
rewind($handle);

$successCount = 0;
$rowCount = 0;
$moduleMapping = []; // Menyimpan [index_kolom => module_id]

$pdo->beginTransaction();
try {
    while (($data = fgetcsv($handle, 2000, $delimiter)) !== FALSE) {
        $rowCount++;

        // 1. PROSES HEADER (Baris Pertama)
        if ($rowCount === 1) {
            // Bersihkan BOM
            $data[0] = preg_replace('/^[\xEF\xBB\xBF]+/', '', $data[0]);
            
            // Cari kolom yang berisi ID Modul dengan format "Nama Modul (ID:123)"
            foreach($data as $index => $headerName) {
                if (preg_match('/\(ID:(\d+)\)/', $headerName, $matches)) {
                    $moduleMapping[$index] = (int)$matches[1];
                }
            }

            if (empty($moduleMapping)) {
                throw new Error("Format header tidak valid. Gunakan template yang di-download dari sistem.");
            }
            continue;
        }

        // 2. PROSES DATA SISWA
        $studentId = trim($data[0]);
        if (empty($studentId) || !is_numeric($studentId)) continue;

        // Iterasi kolom berdasarkan mapping modul yang ditemukan di header
        foreach($moduleMapping as $colIndex => $moduleId) {
            $scoreRaw = isset($data[$colIndex]) ? trim($data[$colIndex]) : "";

            if ($scoreRaw === "") {
                // Jika kosong, hapus nilai lama (opsional)
                $stmt = $pdo->prepare("DELETE FROM grades WHERE student_id = ? AND module_id = ?");
                $stmt->execute([$studentId, $moduleId]);
                continue;
            }

            if (is_numeric($scoreRaw) && $scoreRaw >= 0 && $scoreRaw <= 100) {
                $score = (int)$scoreRaw;
                $stmt = $pdo->prepare("INSERT INTO grades (student_id, module_id, score) VALUES (?, ?, ?) 
                                       ON DUPLICATE KEY UPDATE score = VALUES(score)");
                $stmt->execute([$studentId, $moduleId, $score]);
                $successCount++;
            }
        }
    }
    
    $pdo->commit();
    fclose($handle);
    
    ob_clean();
    sendResponse([
        'message' => "Proses Berhasil. Memperbarui $successCount entri nilai dari " . ($rowCount - 1) . " peserta didik.",
        'success_count' => $successCount
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    if ($handle) fclose($handle);
    ob_clean();
    sendResponse(['message' => 'Gagal memproses file: ' . $e->getMessage()], 500);
}
?>