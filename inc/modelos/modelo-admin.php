<?php

$accion = ($_POST['accion']);
$password = ($_POST['password']);
$usuario = ($_POST['usuario']);

if ($accion === 'crear'){
    // codiga para crear los administradores

    //hashear password
    $opciones = array(
        'cost' => 12
    );
    $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

    //importar la conexion
    include '../funciones/conexion.php';
    try {
        //realizar consukta a la bd
        $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
        $stmt->bind_param('ss', $usuario, $hash_password);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $respuesta = [
                'respuesta' => 'correcto',
                'id_insertado' => $stmt->insert_id,
                'tipo' => $accion
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
            'pass' => $e->getMessage()
        ];
    }

    echo json_encode($respuesta);
};
    
if ($accion === 'login'){
    //escribir codigo que loguee a los administradores
    include '../funciones/conexion.php';
    try {
        //seleccionar el administrador de la base de datos
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ?");
        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        // loguear usuario
        $stmt->bind_result($id_usuario, $nombre_usuario, $pass_usuario);
        $stmt->fetch();
        if($nombre_usuario){
            //el usuario existe, veririfar el password
            if(password_verify($password, $pass_usuario)){
                //iniciar la session
                session_start();
                $_SESSION['usuario'] = $usuario;
                $_SESSION['id'] = $id_usuario;
                $_SESSION['login'] = true;

                //login correcto
                $respuesta = [
                    'respuesta' => 'correcto',
                    'nombre' => $nombre_usuario,
                    'tipo' => $accion
                ];
    
            }else{
                //login incorrecto enviar error
                $respuesta = [
                    'resultado' => 'Password Incorrecto'
                ];
            }
        }else{
            $respuesta = [
                'error' => 'Usuario no existe'
            ];
        }

        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        //en caso de error, tomar la exepcion
        $respuesta = [
            'pass' => $e->getMessage()
        ];
    }
    
    echo json_encode($respuesta);
};