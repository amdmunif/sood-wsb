<?php
include 'db.php';

if (isset($_SESSION['user'])) {
    sendResponse($_SESSION['user']);
} else {
    http_response_code(401);
    exit;
}
?>