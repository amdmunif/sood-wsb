<?php
ob_start();
include 'db.php';

if (!isset($_SESSION['user'])) {
    ob_clean();
    sendResponse(['message' => 'Unauthorized'], 401);
}

$user = $_SESSION['user'];
$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['data']) && is_array($input['data'])) {
    $rows = $input['data'];
    $count = 0;
    $firstRow = true;

    $pdo->beginTransaction();
    try {
        foreach ($rows as $data) {
            if ($firstRow) {
                if (strtolower(trim($data[0] ?? '')) === 'nama') {
                    $firstRow = false;
                    continue;
                }
                $firstRow = false;
            }

            if (count($data) < 2) continue;

            $name = trim($data[0] ?? '');
            $email = trim($data[1] ?? '');
            $pkbmId = ($user['role'] === 'Super Admin') ? (int)($data[2] ?? 0) : (int)$user['pkbm_id'];

            if (empty($name) || empty($email)) continue;

            $stmt = $pdo->prepare("INSERT INTO students (name, email, pkbm_id) VALUES (?, ?, ?) 
                                   ON DUPLICATE KEY UPDATE name = VALUES(name), pkbm_id = VALUES(pkbm_id)");
            $stmt->execute([$name, $email, $pkbmId]);
            $count++;
        }
        $pdo->commit();
        ob_clean();
        sendResponse(['message' => "Berhasil mengimpor $count data peserta dari Excel."]);
    } catch (Exception $e) {
        $pdo->rollBack();
        ob_clean();
        sendResponse(['message' => $e->getMessage()], 500);
    }
}
?>