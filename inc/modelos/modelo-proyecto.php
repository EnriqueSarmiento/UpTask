<?php

$accion = $_POST['tipo'];
$proyecto = $_POST['proyecto'];

if ($accion === 'crear'){

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //realizar consukta a la bd
        $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
        $stmt->bind_param('s', $proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'nombre_proyecto' => $proyecto
            ];
        } else{
            $respuesta = [
                'respuesta' => 'error'
            ];
        };
        $stmt->close();
        $conn->close();
    } catch (Exception $e) {
        //en caso de error, tomar la exepcion
        $respuesta = [
            'error' => $e->getMessage()
        ];
    }

    echo json_encode($respuesta);
};
