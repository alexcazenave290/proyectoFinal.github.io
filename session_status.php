<?php
session_start();
header('Content-Type: application/json');
if (isset($_SESSION['mail_us'])) {
    echo json_encode(['logged' => true, 'mail_us' => $_SESSION['mail_us']]);
} else {
    echo json_encode(['logged' => false]);
}
?>