eventListeners();
//lista proyecto
var listaProyectos = document.querySelector('ul#proyectos');

function eventListeners(){
    //Document ready
    document.addEventListener('DOMContentLoaded', function(){
        actualizarProgreso();
    })

    //boton para crear proyecto
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    //boton para una nueva tarea
    document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);

    //botones para las acciones de las tareas
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e){
    e.preventDefault();
    
    //crea un <input para el nombre del nuevo proyecto
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    //seleccion el ID con el nuevoProyecto
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

    //al presionar enter crear el nuevo proyecto
    inputNuevoProyecto.addEventListener('keypress', function(e){
        var tecla = e.which || e.keyCode;

        if(tecla === 13){
            guardarProyectoDB(inputNuevoProyecto.value);
            listaProyectos.removeChild(nuevoProyecto);
        };
    });
};

function guardarProyectoDB(nombreProyecto){
    //crear llamado ajax
    var xhr = new XMLHttpRequest();

    //enviar datos por formdata
    var datos = new FormData();
    datos.append('proyecto', nombreProyecto);
    datos.append('tipo', 'crear');
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    //en la carga
    xhr.onload = function(){
        if(this.status === 200){
            //obtener datos de la respuesta
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_insertado,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            //comprobar la inserccion
            if(resultado === 'correcto'){
                //fue exitoso
                if(tipo === 'crear'){
                    //se creo un nuevo proyecto
                    //inyectar en el html
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_respuesta=${id_proyecto}" id="proyecto:${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;

                    //agregar al html
                    listaProyectos.appendChild(nuevoProyecto);
                    //enviar alerta
                    Swal({
                        title: 'Proyecto Creado',
                        text: 'El proyecto: ' + proyecto + ' se creo correctamente',
                        type: 'success',
                        icon: 'success'
                    })

                    .then(resultado => {
                        //redireccionar a la nueva url
                        if(resultado.value){
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        };
                    });

                }else{
                    // se actualizo o elimino
                }
            }else{
                //hubo un error 
                Swal.fire({
                    icon: 'error',
                    type: 'error',
                    title: 'Error',
                    text: 'Hubo un error',
                });

            }
        }
    }

    //enviar el request
    xhr.send(datos);


    // inyectar el html
    // var nuevoProyecto = document.createElement('li');
    // nuevoProyecto.innerHTML = `
    //     <a href="#">
    //         ${nombreProyecto}
    //     </a>
    // `;
    // listaProyectos.appendChild(nuevoProyecto);
}

//agregar una nueva tarea al proycto actual
function agregarTarea(e){
    e.preventDefault();
    
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    // validar que el campo tenga algo escrito
    if(nombreTarea === ''){
        Swal.fire({
            icon: 'error',
            type: 'error',
            title: 'Error',
            text: 'Una tarea no puede estar vacia'
        });
    }else{
        // la tarea tiene algo, insertar en PHP

        //crear llamado AJAX
        var xhr = new XMLHttpRequest();

        //crear form data
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('tipo', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        //abrir la conexion
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        //ejecutarlo y respuesta
        xhr.onload = function(){
            if(this.status === 200){
                //todo correcto
                var respuesta = JSON.parse(xhr.responseText);
 
                //asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;

                if (respuesta.respuesta === 'correcto'){
                    //se agrego correctamente
                    if(tipo === 'crear'){
                        //lanzar alerta
                        Swal.fire({
                            icon: 'success',
                            type: 'success',
                            title: 'Tarea Creada',
                            text: 'La Tarea: ' + tarea + ' se creo correctamente'
                        });
                        
                        //seleccionar el parrafo con la lista vacia
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if(parrafoListaVacia.length > 0){
                            document.querySelector('.lista-vacia').remove();
                        }


                        //construir el template
                        var nuevaTarea = document.createElement('li');

                        //agregamos el ID
                        nuevaTarea.id = 'Tarea: '+ id_insertado;

                        //agregar la clase tarea
                        nuevaTarea.classList.add('tarea');

                        //insertar en el HTML
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        //agregarlo al dom
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        //limpiar el formulario
                        document.querySelector('.agregar-tarea').reset();

                        //actualizar el progreso
                        actualizarProgreso();

                    }

                } else{
                    //hubo un error 
                    Swal.fire({
                        icon: 'error',
                        type: 'error',
                        title: 'Error',
                        text: 'Hubo un error'
                    });

                }
            }
        }

        //enviar la consulta
        xhr.send(datos);

    }

}

//cambia el estado de las tareas o las eliminas
function accionesTareas(e){
    e.preventDefault();

    if(e.target.classList.contains('fa-check-circle')){
        if(e.target.classList.contains('completo')){
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
        }else{
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
        }
    }
    
    if(e.target.classList.contains('fa-trash')){
        Swal.fire({
            title: 'Seguro(a)?',
            text: "Esta accion no se puede deshacer",
            icon: 'warning',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                //borrar de la base de datos
                eliminarTareaBD(tareaEliminar);

                //borrar del html
                tareaEliminar.remove();

              Swal.fire(
                'Eliminado!',
                'La tarea ha sido eliminada con exito.',
                'success'
              )
            }
          })
    }
}

//completa o descompleta una tarea
function cambiarEstadoTarea(tarea, estado){
    
    var idTarea = tarea.parentElement.parentElement.id.split(':')[1];
    // crear llamada a ajax
    var xhr = new XMLHttpRequest();

    //Informacion
    var datos = new FormData();
    datos.append('tipo', 'actualizar');
    datos.append('id', idTarea);
    datos.append('estado', estado);

    //open la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function(){
        if(this.status === 200){
            var respuesta = JSON.parse(xhr.responseText);
            actualizarProgreso();
            console.log(respuesta);
            
            
        };
    };

    //enviar la peticion
    xhr.send(datos);


};

//elimina las tareas de la base de datos
function eliminarTareaBD(tarea){
    var idTarea = tarea.id.split(':')[1];


    var xhr = new XMLHttpRequest();

    //Informacion
    var datos = new FormData();
    datos.append('tipo', 'eliminar');
    datos.append('id', idTarea);

    //open la conexion
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //on load
    xhr.onload = function(){
        if(this.status === 200){
            var respuesa = JSON.parse(xhr.responseText);

            //comprobar que haya tareas restantes
            var listaTareasRestantes = document.querySelectorAll('li .tarea');
            if(listaTareasRestantes.length === 0){
                document.querySelector('.listado-pendientes').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            //actualizar el progreso
            actualizarProgreso();

            
        };
    };

    //enviar la peticion
    xhr.send(datos);

}

//actualizar progreso de tareas
function actualizarProgreso(){
    //obetener todas las tareas
    const tareas = document.querySelectorAll('li.tarea');

    //obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    //determinar el avance
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);
    //asignar el avance a la barra
    
    const porcentaje = document.querySelector('.porcentaje');
    porcentaje.style.width = avance +"%";
}
