<?php
header('Content-Type: application/json');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? 0;
    
    if ($id <= 0) {
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
        exit;
    }
    
    try {
        // Opcional: Obtener la ruta de la imagen para eliminarla del servidor
        $sqlSelect = "SELECT foto_masc FROM Mascota WHERE id_masc = :id";
        $stmtSelect = $pdo->prepare($sqlSelect);
        $stmtSelect->execute([':id' => $id]);
        $mascota = $stmtSelect->fetch(PDO::FETCH_ASSOC);
        
        // Eliminar de la base de datos
        $sql = "DELETE FROM Mascota WHERE id_masc = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        
        // Eliminar la imagen del servidor
        if ($mascota && !empty($mascota['foto_masc']) && file_exists($mascota['foto_masc'])) {
            unlink($mascota['foto_masc']);
        }
        
        echo json_encode(['success' => true, 'message' => 'Mascota eliminada correctamente']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Error al eliminar: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}