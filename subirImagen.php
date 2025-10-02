<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['imagen'])) {
        echo json_encode(['success' => false, 'error' => 'No hay imagen']);
        exit;
    }
    
    $file = $_FILES['imagen'];
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'error' => 'Error al subir']);
        exit;
    }
    
    $tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $tiposPermitidos)) {
        echo json_encode(['success' => false, 'error' => 'Tipo no permitido']);
        exit;
    }
    
    $carpeta = 'img/';
    if (!file_exists($carpeta)) {
        mkdir($carpeta, 0777, true);
    }
    
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $nombreArchivo = 'mascota_' . time() . '_' . uniqid() . '.' . $extension;
    $rutaCompleta = $carpeta . $nombreArchivo;
    
    if (move_uploaded_file($file['tmp_name'], $rutaCompleta)) {
        echo json_encode(['success' => true, 'ruta' => $rutaCompleta]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
}