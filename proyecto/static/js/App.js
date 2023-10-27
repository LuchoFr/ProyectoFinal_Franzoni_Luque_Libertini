
window.onload = function () {
    const token = localStorage.getItem("token");
    if (token) {
        const username = localStorage.getItem("username");
        const usernameBienvenida = document.getElementById("usernameBienvenida")

        usernameBienvenida.textContent = username;
    }
    else {
        window.location.href = "../";
    }
}


// PARA QUE SE MANTENGA PRESIONADO CUANDO SE CLICKEA
// ESTO ES CLAVE PARA CAMBIAR CLASES A ELEMENTOS QUE COMPARTEN UNA CLASE
//QUE ANTERIORMENTE SE LE DIERON ESTILOS CON CSS
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.sidebar a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // Elimina la clase "active" de todos los enlaces
            links.forEach(l => l.classList.remove('active'));

            // Agrega la clase "active" al enlace que se hizo clic
            link.classList.add('active');
        });
    });
});


//Funcion para que se muestre el dia DE HOY
window.onload = function () {
    const diaDeHOy = document.getElementById('diaDeHoy');
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    diaDeHOy.value = formattedDate;
}



//VARIABLES GLOBALES
var userID = localStorage.getItem('id');
var token = localStorage.getItem('token');


/////////////////////////////////////////////////PRODUCTOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function cargarProductos() {
    const userID = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    //recuperar credenciales para validar el acceso
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        }
    }

    //seleccionamos div del main principal
    const contenidoPrincipal = document.querySelector('.contenido-principal');
    contenidoPrincipal.innerHTML = '';

    // Actualizar el título h2 creando el elemento 
    //YA QUE DEJO DE ANDAR DE UNA SIMPLE FORMA QUE ERA SOLO CAMBIAR EL TEXT CONTENT
    const h2Principal = document.createElement('h2');
    h2Principal.id = 'h2-principal';
    h2Principal.textContent = 'Productos Disponibles';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/users/${userID}/products`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //creacion de tabla
            const table = document.createElement('table');
            table.id = "table-products";
            table.className = "table-products";


            //creacion de encabezado (thead)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
        `;

            //agrego los encabezados
            thead.appendChild(headerRow);

            // Crear el cuerpo (tbody)
            const tbody = document.createElement("tbody");
            tbody.id = "list-products";

            //cargamos productos a la tabla
            data.forEach(producto => {
                const fila = document.createElement('tr')

                //Me quedo con la fila
                fila.id = producto.id

                //agrego clases a los botones para activar y desactivar la edicion
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td class="edit-field">${producto.name}</td>
                    <td class="edit-field">${producto.description}</td>
                    <td class="edit-field">${producto.price}</td>
                    <td class="edit-field">${producto.stock}</td>
                    <td>
                                <button onclick='editar(${producto.id},${userID})' class="small-button rounded-button edit-button">Editar</button>
                            </td>
                            <td>
                                <button onclick='eliminar(${producto.id},${userID})' class="small-button rounded-button delete-button">Eliminar</button>
                            </td>
                            
                `;
                tbody.appendChild(fila);

            });
            // Aagrego el encabezado y el cuerpo a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // agregar la tabla al elemento "contenido-principal"
            contenidoPrincipal.appendChild(table);

        })

}



//FUNCION EDITAR
function editar(id, userID) {
    // Obtén la fila correspondiente a través del ID o de alguna otra forma que identifique la fila
    const fila = document.getElementById(id);

    // Obtwngo los campos editables de la fila
    const camposEditables = fila.querySelectorAll('td');

    // Habilita la edición de los campos de la fila
    camposEditables.forEach(campo => {
        if (campo.classList.contains('edit-field')) {
            campo.contentEditable = 'true';
        }
    });

    // Cambia el texto del botón de "Editar" a "Guardar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Guardar';

    // Cambia la función del botón a "guardarCambios"
    botonEditar.onclick = function () {
        guardarCambios(id, userID);
    };
}


// Función para guardar los cambios en una fila
function guardarCambios(id, userID) {
    // Obtén la fila correspondiente a través del ID
    const fila = document.getElementById(id);

    // Deshabilita la edición de los campos de la fila
    const camposEditables = fila.querySelectorAll('td');
    camposEditables.forEach(campo => {
        campo.contentEditable = 'false';
    });

    // Deshabilita la edición de los botones
    const botones = fila.querySelectorAll('.edit-button, .delete-button');
    botones.forEach(boton => {
        boton.contentEditable = 'false';
    });

    // Cambia el texto del botón de "Guardar" a "Editar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Editar';

    // Cambia la función del botón a "editar"
    botonEditar.onclick = function () {
        editar(id, userID);
    };


    // Objeto que contiene los datos a enviar al servidor
    const datosActualizados = {
        name: camposEditables[1].textContent, // La segunda columna es el nombre
        description: camposEditables[2].textContent, // La tercera columna es la descripción
        price: parseFloat(camposEditables[3].textContent), // La cuarta columna es el precio
        stock: parseInt(camposEditables[4].textContent) // La quinta columna es el stock
    };

    // Realizar una solicitud PUT para enviar los datos actualizados al servidor
    fetch(`http://127.0.0.1:4500/users/${userID}/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID

        },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => {
            if (response.ok) {
                // solicitud con éxito

                alert('Cambios guardados exitosamente');
            } else {
                alert('La solicitud fallo');
                // solicitud fallo
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}


// Función para eliminar una fila
function eliminar(id, userID) {
    const fila = document.getElementById(id);
    const Producto = fila.querySelector('.edit-field').textContent;

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el producto "${Producto}"?`);

    if (confirmacion) {
        // Realizar una solicitud DELETE para eliminar el producto
        fetch(`http://127.0.0.1:4500/users/${userID}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': userID
            }
        })
            .then(response => {
                if (response.ok) {
                    // La solicitud se completó con éxito
                    alert('Producto eliminado exitosamente');
                    // Eliminar la fila de la tabla
                    fila.remove();
                } else {
                    alert('La solicitud falló');
                    // La solicitud falló, maneja el error según tus necesidades
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
    }
}

/////////////////////////////////////////////FIN DE PRODUCTOS///////////////////////////////////////


/////////////////////////////////////////////////SERVICIOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function cargarServicios() {
    const userID = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    //recuperar credenciales para validar el acceso
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        }
    }

    //seleccionamos div del main principal
    const contenidoPrincipal = document.querySelector('.contenido-principal');
    contenidoPrincipal.innerHTML = '';

    // Actualizar el título h2 creando el elemento 
    //YA QUE DEJO DE ANDAR DE UNA SIMPLE FORMA QUE ERA SOLO CAMBIAR EL TEXT CONTENT
    const h2Principal = document.createElement('h2');
    h2Principal.id = 'h2-principal';
    h2Principal.textContent = 'Servicios Disponibles';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/users/${userID}/services`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //creacion de tabla
            const table = document.createElement('table');
            table.id = "table-products";
            table.className = "table-products";


            //creacion de encabezado (thead)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
        `;

            //agrego los encabezados
            thead.appendChild(headerRow);

            // Crear el cuerpo (tbody)
            const tbody = document.createElement("tbody");
            tbody.id = "list-products";

            //cargamos productos a la tabla
            data.forEach(servicio => {
                const fila = document.createElement('tr')

                //Me quedo con la fila
                fila.id = servicio.id

                //agrego clases a los botones para activar y desactivar la edicion
                fila.innerHTML = `
                    <td>${servicio.id}</td>
                    <td class="edit-field">${servicio.name}</td>
                    <td class="edit-field">${servicio.description}</td>
                    <td class="edit-field">${servicio.price}</td>
                    <td>
                                <button onclick='editarServicio(${servicio.id},${userID})' class="small-button rounded-button edit-button">Editar</button>
                            </td>
                            <td>
                                <button onclick='eliminarServicio(${servicio.id},${userID})' class="small-button rounded-button delete-button">Eliminar</button>
                            </td>
                `;
                tbody.appendChild(fila);

            });
            // Aagrego el encabezado y el cuerpo a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // agregar la tabla al elemento "contenido-principal"
            contenidoPrincipal.appendChild(table);

        })

}


//FUNCION EDITAR SERVICIOS
function editarServicio(id, userID) {
    // Obtén la fila correspondiente a través del ID o de alguna otra forma que identifique la fila
    const fila = document.getElementById(id);

    // Obtwngo los campos editables de la fila
    const camposEditables = fila.querySelectorAll('td');

    // Habilita la edición de los campos de la fila
    camposEditables.forEach(campo => {
        if (campo.classList.contains('edit-field')) {
            campo.contentEditable = 'true';
        }
    });

    // Cambia el texto del botón de "Editar" a "Guardar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Guardar';

    // Cambia la función del botón a "guardarCambios"
    botonEditar.onclick = function () {
        guardarCambiosServicio(id, userID);
    };
}


// Función para guardar los cambios en una fila
function guardarCambiosServicio(id, userID) {
    // Obtén la fila correspondiente a través del ID
    const fila = document.getElementById(id);

    // Deshabilita la edición de los campos de la fila
    const camposEditables = fila.querySelectorAll('td');
    camposEditables.forEach(campo => {
        campo.contentEditable = 'false';
    });

    // Deshabilita la edición de los botones
    const botones = fila.querySelectorAll('.edit-button, .delete-button');
    botones.forEach(boton => {
        boton.contentEditable = 'false';
    });

    // Cambia el texto del botón de "Guardar" a "Editar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Editar';

    // Cambia la función del botón a "editar"
    botonEditar.onclick = function () {
        editarServicio(id, userID);
    };


    // Objeto que contiene los datos a enviar al servidor
    const datosActualizados = {
        name: camposEditables[1].textContent, // La segunda columna es el nombre
        description: camposEditables[2].textContent, // La tercera columna es la descripción
        price: parseFloat(camposEditables[3].textContent), // La cuarta columna es el precio
        
    };

    // Realizar una solicitud PUT para enviar los datos actualizados al servidor
    fetch(`http://127.0.0.1:4500/users/${userID}/services/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID

        },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => {
            if (response.ok) {
                // solicitud con éxito

                alert('Cambios guardados exitosamente');
            } else {
                alert('La solicitud fallo');
                // solicitud fallo
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}


// Función para eliminar una fila
function eliminarServicio(id, userID) {
    const fila = document.getElementById(id);
    const Servicio = fila.querySelector('.edit-field').textContent;

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el servicio "${Servicio}"?`);

    if (confirmacion) {
        // Realizar una solicitud DELETE para eliminar el servicio
        fetch(`http://127.0.0.1:4500/users/${userID}/services/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': userID
            }
        })
            .then(response => {
                if (response.ok) {
                    // La solicitud se completó con éxito
                    alert('Servicio eliminado exitosamente');
                    // Eliminar la fila de la tabla
                    fila.remove();
                } else {
                    alert('La solicitud falló');
                    // La solicitud falló, maneja el error según tus necesidades
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
    }
}

/////////////////////////////////////////////FIN DE SERVICIOS///////////////////////////////////////


/////////////////////////////////////////////////CLIENTES////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function cargarClientes() {
    const userID = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    //recuperar credenciales para validar el acceso
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        }
    }

    //seleccionamos div del main principal
    const contenidoPrincipal = document.querySelector('.contenido-principal');
    contenidoPrincipal.innerHTML = '';

    // Actualizar el título h2 creando el elemento 
    //YA QUE DEJO DE ANDAR DE UNA SIMPLE FORMA QUE ERA SOLO CAMBIAR EL TEXT CONTENT
    const h2Principal = document.createElement('h2');
    h2Principal.id = 'h2-principal';
    h2Principal.textContent = 'Clientes Registrados';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/users/${userID}/clients`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            //creacion de tabla
            const table = document.createElement('table');
            table.id = "table-products";
            table.className = "table-products";


            //creacion de encabezado (thead)
            const thead = document.createElement("thead");
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Direccion</th>
            <th>Dni</th>
            <th>Cuit</th>
            <th>Email</th>
            <th>Acciones</th>
        `;

            //agrego los encabezados
            thead.appendChild(headerRow);

            // Crear el cuerpo (tbody)
            const tbody = document.createElement("tbody");
            tbody.id = "list-products";

            //cargamos productos a la tabla
            data.forEach(cliente => {
                const fila = document.createElement('tr')

                //Me quedo con la fila
                fila.id = cliente.id

                //agrego clases a los botones para activar y desactivar la edicion
                fila.innerHTML = `
                    <td>${cliente.id}</td>
                    <td class="edit-field">${cliente.name}</td>
                    <td class="edit-field">${cliente.lastName}</td>
                    <td class="edit-field">${cliente.address}</td>
                    <td class="edit-field">${cliente.dni}</td>
                    <td class="edit-field">${cliente.cuit}</td>
                    <td class="edit-field">${cliente.email}</td>
                    <td>
                                <button onclick='editarCliente(${cliente.id},${userID})' class="small-button rounded-button edit-button">Editar</button>
                            </td>
                            <td>
                                <button onclick='eliminarCliente(${cliente.id},${userID})' class="small-button rounded-button delete-button">Eliminar</button>
                            </td>
                `;
                tbody.appendChild(fila);

            });
            // Aagrego el encabezado y el cuerpo a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // agregar la tabla al elemento "contenido-principal"
            contenidoPrincipal.appendChild(table);

        })

}



//FUNCION EDITAR
function editarCliente(id, userID) {
    // Obtén la fila correspondiente a través del ID o de alguna otra forma que identifique la fila
    const fila = document.getElementById(id);

    // Obtwngo los campos editables de la fila
    const camposEditables = fila.querySelectorAll('td');

    // Habilita la edición de los campos de la fila
    camposEditables.forEach(campo => {
        if (campo.classList.contains('edit-field')) {
            campo.contentEditable = 'true';
        }
    });

    // Cambia el texto del botón de "Editar" a "Guardar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Guardar';

    // Cambia la función del botón a "guardarCambios"
    botonEditar.onclick = function () {
        guardarCambiosCliente(id, userID);
    };
}


// Función para guardar los cambios en una fila
function guardarCambiosCliente(id, userID) {
    // Obtén la fila correspondiente a través del ID
    const fila = document.getElementById(id);

    // Deshabilita la edición de los campos de la fila
    const camposEditables = fila.querySelectorAll('td');
    camposEditables.forEach(campo => {
        campo.contentEditable = 'false';
    });

    // Deshabilita la edición de los botones
    const botones = fila.querySelectorAll('.edit-button, .delete-button');
    botones.forEach(boton => {
        boton.contentEditable = 'false';
    });

    // Cambia el texto del botón de "Guardar" a "Editar"
    const botonEditar = fila.querySelector('.edit-button');
    botonEditar.textContent = 'Editar';

    // Cambia la función del botón a "editar"
    botonEditar.onclick = function () {
        editarCliente(id, userID);
    };


    // Objeto que contiene los datos a enviar al servidor
    const datosActualizados = {
        name: camposEditables[1].textContent, 
        lastName: camposEditables[2].textContent, 
        address: parseFloat(camposEditables[3].textContent), 
        dni: parseInt(camposEditables[4].textContent),
        cuit: parseInt(camposEditables[5].textContent),
        email: camposEditables[6].textContent,

    };

    // Realizar una solicitud PUT para enviar los datos actualizados al servidor
    fetch(`http://127.0.0.1:4500/users/${userID}/clients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID

        },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => {
            if (response.ok) {
                // solicitud con éxito

                alert('Cambios guardados exitosamente');
            } else {
                alert('La solicitud fallo');
                // solicitud fallo
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
}


// Función para eliminar una fila
function eliminarCliente(id, userID) {
    const fila = document.getElementById(id);
    const Cliente = fila.querySelector('.edit-field').textContent;

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar el cliente "${Cliente}"?`);

    if (confirmacion) {
        // Realizar una solicitud DELETE para eliminar el producto
        fetch(`http://127.0.0.1:4500/users/${userID}/clients/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': userID
            }
        })
            .then(response => {
                if (response.ok) {
                    // La solicitud se completó con éxito
                    alert('Cliente eliminado exitosamente');
                    // Eliminar la fila de la tabla
                    fila.remove();
                } else {
                    alert('La solicitud falló');
                    // La solicitud falló, maneja el error según tus necesidades
                }
            })
            .catch(error => {
                console.error('Error al realizar la solicitud:', error);
            });
    }
}


/////////////////////////////////////////////FIN DE CLIENTES///////////////////////////////////////


// Función para cerrar la sesión del usuario
function logout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //establece la cookie "token" con un valor vacío y una fecha de caducidad en el pasado, lo que efectivamente la elimina.
    localStorage.clear(); // Borra todos los datos de localStorage

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = 'login.html'; // Reemplaza con la URL real de tu página de inicio de sesión.
}