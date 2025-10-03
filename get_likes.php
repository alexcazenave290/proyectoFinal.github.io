<?php
session_start();
if (!isset($_SESSION['mail_us'])) {
    echo json_encode([]);
    exit;
}
$mail_us = $_SESSION['mail_us'];
$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) { die("Error DB: " . $conn->connect_error); }

$res = $conn->query("SELECT id_publ FROM Interacion WHERE mail_us='$mail_us' AND forma_int='Like'");
$likes = [];
while ($row = $res->fetch_assoc()) {
    $likes[] = $row['id_publ'];
}
echo json_encode($likes);
?>