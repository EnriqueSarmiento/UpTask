eventListeners();

function eventListeners(){
    document.querySelector('#formulario'). addEventListener('submit', validarRegistro);
};

function validarRegistro(e){
    e.preventDefault();

    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if(usuario === "" || password === ""){
        // la validacion fallo
        Swal.fire({
            icon: 'error',
            type: 'error',
            title: 'Error',
            text: 'Ambos Campos son Obligatorios',
        })
    }else{
        // ambos campos son correctos, mandar ejecutar ajax

        // datos que se envian al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // crear el llamado a ajax
        var xhr = new XMLHttpRequest();

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

        // retorno de datos
        xhr.onload = function(){
            if(this.status === 200){
                var respuesta = JSON.parse(xhr.responseText);
                
                console.log(respuesta);
                // si la respesta es correcta
                if(respuesta.respuesta === 'correcto'){
                    //si es un nuevo usuario
                    if(respuesta.tipo === 'crear'){
                        Swal({
                            title: 'Usuario Creado',
                            text: 'El usuario se creo correctamente',
                            type: 'success',
                            icon: 'success'
                        });
                    }else if(respuesta.tipo === 'login'){
                        Swal({
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard',
                            type: 'success',
                            icon: 'success'
                        })
                        .then (resultado =>{
                            if(resultado.value){
                                window.location.href = 'index.php';
                            }
                        })
                    }
                } else{
                    // hubo un error
                    Swal.fire({
                        icon: 'error',
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error',
                    });
            
                }
            }
    }

        

        //enviar la peticion
        xhr.send(datos);

    }
}

