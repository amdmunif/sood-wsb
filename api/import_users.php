<?php
ob_start();
include 'db.php';

if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
    ob_clean();
    sendResponse(['message' => 'Hanya Super Admin yang bisa mengimpor pengguna'], 403);
}

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

            if (count($data) < 4) continue;

            $name = trim($data[0] ?? '');
            $email = trim($data[1] ?? '');
            $passwordRaw = trim($data[2] ?? '');
            $role = trim($data[3] ?? '');
            $pkbmId = !empty($data[4]) ? (int)$data[4] : null;

            if (empty($name) || empty($email) || empty($passwordRaw)) continue;

            $password = password_hash($passwordRaw, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, pkbm_id) 
                                   VALUES (?, ?, ?, ?, ?) 
                                   ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), pkbm_id = VALUES(pkbm_id)");
            $stmt->execute([$name, $email, $password, $role, $pkbmId]);
            $count++;
        }
        $pdo->commit();
        ob_clean();
        sendResponse(['message' => "Berhasil mengimpor $count akun pengguna dari Excel."]);
    } catch (Exception $e) {
        $pdo->rollBack();
        ob_clean();
        sendResponse(['message' => $e->getMessage()], 500);
    }
}
?>