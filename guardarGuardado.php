<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autenticado']);
    exit;
}
$mail_us = $_SESSION['mail_us'];
$data = json_decode(file_get_contents('php://input'), true);
$id_masc = intval($data['id_masc'] ?? 0);

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión']);
    exit;
}

// ¿Ya está guardado?
$check = $conn->prepare("SELECT id_guardado FROM Guardado WHERE mail_us=? AND id_masc=?");
$check->bind_param("si", $mail_us, $id_masc);
$check->execute();
$check->store_result();

if ($check->num_rows == 0) {
    // Guardar
    $stmt = $conn->prepare("INSERT INTO Guardado (mail_us, id_masc) VALUES (?, ?)");
    $stmt->bind_param("si", $mail_us, $id_masc);
    $stmt->execute();
    echo json_encode(['success' => true, 'saved' => true]);
} else {
    // Quitar guardado
    $del = $conn->prepare("DELETE FROM Guardado WHERE mail_us=? AND id_masc=?");
    $del->bind_param("si", $mail_us, $id_masc);
    $del->execute();
    echo json_encode(['success' => true, 'saved' => false]);
}
?>