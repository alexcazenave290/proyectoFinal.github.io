<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit;
}
$mail_us = $_SESSION['mail_us'];
$id_publ = intval($_POST['id_publ']);

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) { die("Error DB: " . $conn->connect_error); }

$check = $conn->prepare("SELECT codigo_inte FROM Interacion WHERE id_publ=? AND mail_us=? AND forma_int='Like'");
$check->bind_param("is", $id_publ, $mail_us);
$check->execute();
$check->store_result();

if ($check->num_rows == 0) {
    $stmt = $conn->prepare("INSERT INTO Interacion (id_publ, id_con, mail_us, coment_int, forma_int, hora_int, fecha_int) VALUES (?, NULL, ?, '', 'Like', CURTIME(), CURDATE())");
    $stmt->bind_param("is", $id_publ, $mail_us);
    $stmt->execute();
    echo json_encode(['liked' => true]);
} else {
    $del = $conn->prepare("DELETE FROM Interacion WHERE id_publ=? AND mail_us=? AND forma_int='Like'");
    $del->bind_param("is", $id_publ, $mail_us);
    $del->execute();
    echo json_encode(['liked' => false]);
}
?>