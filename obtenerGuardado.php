<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    echo json_encode(['saved' => false]);
    exit;
}
$mail_us = $_SESSION['mail_us'];
$id_masc = intval($_GET['id_masc'] ?? 0);

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) {
    echo json_encode(['saved' => false]);
    exit;
}

$stmt = $conn->prepare("SELECT id_guardado FROM Guardado WHERE mail_us=? AND id_masc=?");
$stmt->bind_param("si", $mail_us, $id_masc);
$stmt->execute();
$stmt->store_result();

echo json_encode(['saved' => $stmt->num_rows > 0]);
?>