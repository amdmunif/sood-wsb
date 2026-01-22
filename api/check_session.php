<?php
include 'db.php';

if (isset($_SESSION['user'])) {
    sendResponse($_SESSION['user']);
} else {
    // Return 204 No Content instead of 401 to prevent global error interceptor from redirecting
    http_response_code(204);
    exit;
}
?>