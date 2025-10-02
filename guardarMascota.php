<?php
header('Content-Type: application/json');
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $id_inst = $data['id_inst'] ?? '';
    $mail_us = $data['mail_us'] ?? '';
    $nom_masc = $data['name'] ?? '';
    $especie_masc = $data['especie'] ?? '';
    $raza_masc = $data['raza'] ?? '';
    $tamano_masc = $data['tamano'] ?? '';
    $edad_masc = $data['edad'] ?? '';
    $salud_masc = $data['salud'] ?? '';
    $foto_masc = $data['foto_ruta'] ?? ''; // Ahora guarda la ruta, no la imagen
    $estadoAdopt_masc = 0;
    
    if (empty($nom_masc)) {
        echo json_encode(['success' => false, 'error' => 'El nombre es requerido']);
        exit;
    }
    
    try {
        $sql = "INSERT INTO Mascota 
                (id_inst, mail_us, tamano_masc, edad_masc, foto_masc, nom_masc, 
                 especie_masc, raza_masc, salud_masc, estadoAdopt_masc) 
                VALUES 
                (:id_inst, :mail_us, :tamano_masc, :edad_masc, :foto_masc, :nom_masc, 
                 :especie_masc, :raza_masc, :salud_masc, :estadoAdopt_masc)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id_inst' => $id_inst,
            ':mail_us' => $mail_us,
            ':tamano_masc' => $tamano_masc,
            ':edad_masc' => $edad_masc,
            ':foto_masc' => $foto_masc,
            ':nom_masc' => $nom_masc,
            ':especie_masc' => $especie_masc,
            ':raza_masc' => $raza_masc,
            ':salud_masc' => $salud_masc,
            ':estadoAdopt_masc' => $estadoAdopt_masc
        ]);
        
        echo json_encode([
            'success' => true, 
            'id' => $pdo->lastInsertId(),
            'message' => 'Mascota guardada correctamente'
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Error al guardar: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}
?>