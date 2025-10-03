<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    echo json_encode(['success' => false, 'message' => 'No hay sesión']);
    exit;
}
$mail_us = $_SESSION['mail_us'];

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

$nom_us = $data['nom_us'] ?? '';
$apell_us = $data['apell_us'] ?? '';
$ci_us = $data['ci_us'] ?? '';
$tel_us = $data['tel_us'] ?? '';
$direccion_us = $data['direccion_us'] ?? '';

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

$stmt = $conn->prepare("UPDATE Usuario SET nom_us=?, apell_us=?, ci_us=?, tel_us=?, direccion_us=? WHERE mail_us=?");
$stmt->bind_param("ssssss", $nom_us, $apell_us, $ci_us, $tel_us, $direccion_us, $mail_us);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar']);
}
?>