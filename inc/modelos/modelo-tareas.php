<?php 

$accion = $_POST['tipo'];
$id_proyecto = $_POST['id_proyecto']?? null;
$tarea = $_POST['tarea']?? null;
$estado = $_POST['estado']?? null;
$id_tarea = $_POST['id']?? null;

if ($accion === 'crear'){

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //realizar consukta a la bd
        $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
        $stmt->bind_param('si', $tarea, $id_proyecto);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion,
                'tarea' => $tarea
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

if($accion === 'actualizar'){

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //realizar consukta a la bd
        $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ? ");
        $stmt->bind_param('ii', $estado, $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = [
                'respuesta' => 'correcto',
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

if($accion === 'eliminar'){

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //realizar consukta a la bd
        $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ? ");
        $stmt->bind_param('i', $id_tarea);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = [
                'respuesta' => 'correcto',
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