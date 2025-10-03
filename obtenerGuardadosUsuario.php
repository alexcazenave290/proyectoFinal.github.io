<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['mail_us'])) {
    echo json_encode(['success' => false, 'data' => []]);
    exit;
}
$mail_us = $_SESSION['mail_us'];

$conn = new mysqli("localhost", "root", "", "Conexion");
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'data' => []]);
    exit;
}

$sql = "SELECT m.* FROM Guardado g
        JOIN Mascota m ON g.id_masc = m.id_masc
        WHERE g.mail_us = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $mail_us);
$stmt->execute();
$result = $stmt->get_result();

$mascotas = [];
while ($row = $result->fetch_assoc()) {
    $mascotas[] = $row;
}
echo json_encode(['success' => true, 'data' => $mascotas]);
?>