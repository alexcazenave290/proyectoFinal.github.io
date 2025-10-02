<?php
header('Content-Type: application/json');
require_once 'conexion.php';

try {
    $sql = "SELECT * FROM Mascota ORDER BY id_masc DESC";
    $stmt = $pdo->query($sql);
    $mascotas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $mascotas]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}