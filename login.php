<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mail_us = $_POST['mail_us'] ?? '';
    $contrasena_us = $_POST['contrasena_us'] ?? '';

    $conn = new mysqli("localhost", "root", "", "Conexion");
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión']);
        exit;
    }

    $stmt = $conn->prepare("SELECT mail_us FROM Usuario WHERE mail_us=? AND contrasena_us=?");
    $stmt->bind_param("ss", $mail_us, $contrasena_us);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $_SESSION['mail_us'] = $mail_us; // <--- ¡IMPORTANTE!
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
    }
}
?>