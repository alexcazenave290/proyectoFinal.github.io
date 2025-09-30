<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Prueba de conexión</title>
</head>
<body>
<?php
$host = "localhost";
$usuario = "root";
$password = "";
$baseDatos = "Conexion";

$conn = new mysqli($host, $usuario, $password, $baseDatos);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
} else {
    echo "✅ Conexión exitosa a la base de datos $baseDatos";
}

$conn->close();
?>
</body>
</html>
