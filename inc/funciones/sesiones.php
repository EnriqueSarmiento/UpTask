<?php

function usuario_autenticado(){
    if(!revisar_usuario()){
        header('location:login.php');
        exit();
    }
}

function revisar_usuario(){
    return isset($_SESSION['usuario']);
}
// NO SE RECOMIENDAN GUARDAR PASSWORD O USUARIOS EN COOKIES. 
session_start();
usuario_autenticado();
