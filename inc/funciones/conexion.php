<?php

$conn = new mysqli('Localhost', 'root', '', 'uptask');

if($conn->connect_error){
    echo $conn->connect_error;
};

$conn->set_charset('utf8'); // necesario para mostrar los acentos y la e;es.

