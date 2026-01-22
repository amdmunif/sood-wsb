<?php
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Proteksi: Hanya Admin yang bisa akses untuk operasi tulis
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'Super Admin') {
    if ($method !== 'GET') {
        sendResponse(['message' => 'Unauthorized'], 403);
    }
}

// Helper untuk memetakan data flat DB ke struktur nested Frontend
function mapPkbmData($row) {
    if (!$row) return null;
    return [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'npsn' => $row['npsn'],
        'email' => $row['email'],
        'address' => $row['address'],
        'classroomUrl' => $row['classroom_url'],
        'headmaster_name' => $row['head_name'] ?? '',
        'homeroom_teacher_name' => $row['teacher_name'] ?? '',
        'coords' => [
            'lat' => $row['latitude'] !== null ? (float)$row['latitude'] : null,
            'lng' => $row['longitude'] !== null ? (float)$row['longitude'] : null
        ],
        'contactPerson' => [
            'name' => $row['contact_person_name'],
            'phone' => $row['contact_person_phone']
        ]
    ];
}

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM pkbm WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $row = $stmt->fetch();
            sendResponse(mapPkbmData($row));
        } else {
            $stmt = $pdo->query("SELECT * FROM pkbm ORDER BY name ASC");
            $rows = $stmt->fetchAll();
            $mapped = array_map('mapPkbmData', $rows);
            sendResponse($mapped);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO pkbm (name, npsn, email, address, latitude, longitude, contact_person_name, contact_person_phone, classroom_url, head_name, teacher_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'], 
                $data['npsn'] ?? null, 
                $data['email'] ?? null, 
                $data['address'] ?? null, 
                $data['coords']['lat'] ?? null, 
                $data['coords']['lng'] ?? null,
                $data['contactPerson']['name'] ?? null, 
                $data['contactPerson']['phone'] ?? null,
                $data['classroomUrl'] ?? null,
                $data['headmaster_name'] ?? null,
                $data['homeroom_teacher_name'] ?? null
            ]);
            $pkbmId = $pdo->lastInsertId();

            if (isset($data['admin_email']) && !empty($data['admin_email'])) {
                $hash = password_hash($data['admin_password'], PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, pkbm_id) VALUES (?, ?, ?, 'Admin PKBM', ?)");
                $stmt->execute([$data['admin_name'], $data['admin_email'], $hash, $pkbmId]);
            }

            $pdo->commit();
            sendResponse(['message' => 'PKBM berhasil ditambahkan', 'id' => $pkbmId]);
        } catch (Exception $e) {
            $pdo->rollBack();
            sendResponse(['message' => 'Gagal menambah PKBM: ' . $e->getMessage()], 500);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        try {
            $stmt = $pdo->prepare("UPDATE pkbm SET name=?, npsn=?, email=?, address=?, latitude=?, longitude=?, contact_person_name=?, contact_person_phone=?, classroom_url=?, head_name=?, teacher_name=? WHERE id=?");
            $stmt->execute([
                $data['name'], 
                $data['npsn'] ?? null, 
                $data['email'] ?? null, 
                $data['address'] ?? null, 
                $data['coords']['lat'] ?? null, 
                $data['coords']['lng'] ?? null,
                $data['contactPerson']['name'] ?? null, 
                $data['contactPerson']['phone'] ?? null,
                $data['classroomUrl'] ?? null, 
                $data['headmaster_name'] ?? null,
                $data['homeroom_teacher_name'] ?? null,
                $data['id']
            ]);
            sendResponse(['message' => 'Data PKBM berhasil diperbarui']);
        } catch (Exception $e) {
            sendResponse(['message' => 'Gagal memperbarui PKBM: ' . $e->getMessage()], 500);
        }
        break;

    case 'DELETE':
        try {
            $id = $_GET['id'];
            $stmt = $pdo->prepare("DELETE FROM pkbm WHERE id = ?");
            $stmt->execute([$id]);
            sendResponse(['message' => 'PKBM berhasil dihapus']);
        } catch (Exception $e) {
            sendResponse(['message' => 'Gagal menghapus PKBM: ' . $e->getMessage()], 500);
        }
        break;
}
?>