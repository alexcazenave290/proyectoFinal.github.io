<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mail_us = $_POST['mail_us'] ?? '';
    $contrasena_us = $_POST['contrasena_us'] ?? '';
    $nom_us = $_POST['nom_us'] ?? '';
    $apell_us = $_POST['apell_us'] ?? '';
    $ci_us = $_POST['ci_us'] ?? '';
    $tel_us = $_POST['tel_us'] ?? '';
    $direccion_us = $_POST['direccion_us'] ?? '';
    $adoptante = 1;
    $donante = 0;

    $conn = new mysqli("localhost", "root", "", "Conexion");
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Error de conexión']);
        exit;
    }

    // Verifica si ya existe el usuario
    $stmt = $conn->prepare("SELECT mail_us FROM Usuario WHERE mail_us=?");
    $stmt->bind_param("s", $mail_us);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
        exit;
    }

    // Inserta el usuario
    $stmt = $conn->prepare("INSERT INTO Usuario (mail_us, contrasena_us, ci_us, nom_us, apell_us, tel_us, direccion_us, adoptante, donante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssii", $mail_us, $contrasena_us, $ci_us, $nom_us, $apell_us, $tel_us, $direccion_us, $adoptante, $donante);

    if ($stmt->execute()) {
        $_SESSION['mail_us'] = $mail_us;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar usuario']);
    }
}
?>