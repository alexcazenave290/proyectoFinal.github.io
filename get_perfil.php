<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión']);
    exit;
}
$mail_us = $_SESSION['mail_us'];

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

$stmt = $conn->prepare("SELECT mail_us, nom_us, apell_us, ci_us, tel_us, direccion_us FROM Usuario WHERE mail_us=?");
$stmt->bind_param("s", $mail_us);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'perfil' => $row]);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}
?>