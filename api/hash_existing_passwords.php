<?php
require_once 'db.php';

echo "Memulai proses hashing password...<br>";

// Ambil semua user yang passwordnya belum di-hash (panjang < 60)
$sql = "SELECT id, password FROM users WHERE CHAR_LENGTH(password) < 60";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $plaintext_password = $row['password'];

        // Hash password menggunakan algoritma default (saat ini BCRYPT)
        $hashed_password = password_hash($plaintext_password, PASSWORD_DEFAULT);

        // Update password di database
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $hashed_password, $id);
        
        if ($stmt->execute()) {
            echo "Password untuk user ID: $id berhasil di-hash.<br>";
        } else {
            echo "GAGAL hashing password untuk user ID: $id.<br>";
        }
    }
} else {
    echo "Tidak ada password yang perlu di-hash.";
}

echo "Proses selesai.";

$conn->close();
?>