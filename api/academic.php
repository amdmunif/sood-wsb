<?php
require_once 'db.php';

$sql = "SELECT s.id as subject_id, s.name as subject_name, m.id as module_id, m.name as module_name 
        FROM subjects s 
        JOIN modules m ON s.id = m.subject_id 
        ORDER BY s.id, m.id";
$result = $conn->query($sql);

$subjects = [];
while($row = $result->fetch_assoc()) {
    $subject_id = $row['subject_id'];
    if (!isset($subjects[$subject_id])) {
        $subjects[$subject_id] = [
            'id' => (int)$subject_id,
            'name' => $row['subject_name'],
            'modules' => []
        ];
    }
    $subjects[$subject_id]['modules'][] = [
        'id' => (int)$row['module_id'],
        'name' => $row['module_name']
    ];
}
echo json_encode(array_values($subjects));
$conn->close();
?>