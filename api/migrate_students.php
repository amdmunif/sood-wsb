<?php
include 'db.php';

try {
    $pdo->exec("ALTER TABLE students ADD COLUMN nik VARCHAR(20) NULL AFTER email");
    echo "Added NIK column.<br>";
} catch (Exception $e) {
    echo "NIK column might already exist or error: " . $e->getMessage() . "<br>";
}

try {
    $pdo->exec("ALTER TABLE students ADD COLUMN nis VARCHAR(20) NULL AFTER nik");
    echo "Added NIS column.<br>";
} catch (Exception $e) {
    echo "NIS column might already exist or error: " . $e->getMessage() . "<br>";
}

// Add index for faster lookup if needed
try {
    $pdo->exec("CREATE INDEX idx_student_pkbm ON students(pkbm_id)");
    echo "Added index on pkbm_id.<br>";
} catch (Exception $e) {
    // Ignore if exists
}
?>