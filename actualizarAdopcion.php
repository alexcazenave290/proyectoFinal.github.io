<?php
header('Content-Type: application/json');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    $adoptado = $data['adoptado'] ?? false;
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
        exit;
    }
    
    try {
        $sql = "UPDATE Mascota SET estadoAdopt_masc = :adoptado WHERE id_masc = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':adoptado' => $adoptado ? 1 : 0
        ]);
        
        echo json_encode(['success' => true, 'message' => 'Estado actualizado correctamente']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Error al actualizar: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
?>