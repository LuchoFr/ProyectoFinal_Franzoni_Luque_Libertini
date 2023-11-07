//seleccionamos div del main principal
var contenidoPrincipal = document.querySelector('.contenido-principal');


window.onload = function () {
    const token = localStorage.getItem("token");
    if (token) {
        //TOMAMOS EL USERNAME PARA EL SALUDO
        const username = localStorage.getItem("username");
        const usernameBienvenida = document.getElementById("usernameBienvenida")
        usernameBienvenida.textContent = username;
        const diaDeHOy = document.getElementById('diaDeHoy');
        const currentDate = new Date();

        //TOMAMOS EL DIA DE HOY
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        diaDeHOy.value = formattedDate;
    }
    else {
        window.location.href = "login.html";
    }
}

usernameBienvenida.style.textTransform = 'uppercase'; // Convierte el texto a mayúsculas
usernameBienvenida.style.color = '#ff7782';


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



//VARIABLES GLOBALES
var userID = localStorage.getItem('id');
var token = localStorage.getItem('token');


/////////////////////////////////////////////////PRODUCTOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function cargarProductos() {

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


    //FUNCION PARA AGREGAR BOTON DE AGREGAR PRODUCTO Y FORMULARIO
    // Boton "Agregar PRODUCTO" 
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar Producto';
    addButton.className = 'rounded-button';
    addButton.addEventListener('click', () => {
        if (formularioVisible) {

            mostrarFormularioProductos();
        }
    });

    // Crea un div para los botones
    const divBotones = document.createElement("div");
    divBotones.classList.add("facturaContainer");


    // Agrego el botón al "contenido-principal"
    divBotones.appendChild(addButton);
    contenidoPrincipal.appendChild(divBotones);


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
        fetch(`http://127.0.0.1:4500/users/${userID}/deleteProduct/${id}`, {
            method: 'PUT',
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



///POST DE PRODUCTOS

function mostrarFormularioProductos() {
    // Creo formulario
    const formularioProducto = document.createElement('form');
    formularioProducto.id = 'servicioForm';

    formularioProducto.innerHTML = `
        <input type="text" id="nombre" placeholder="Nombre" required>
        <input type="text" id="descripcion" placeholder="Descripcion" required>
        <input type="number" id="precio" placeholder="Precio" required>
        <input type="number" id="stock" placeholder="Stock" required>
        <button type="button" onclick="guardarProducto()" class='small-button rounded-button add-button'> Guardar </button>
        <button type="button" onclick="cancelarProducto()" class='small-button rounded-button cancel-button'> Cancelar </button>
        `;

    //agrego el formulario
    contenidoPrincipal.appendChild(formularioProducto);

}

//FUNCION CANCELAR PRODUCTO
function cancelarProducto() {
    // Elimina el formulario
    const formulario = document.getElementById('servicioForm');
    if (formularioVisible) { // Revisar si el formulario está visible, no es necesario invertir la condición
        // Elimina el formulario
        formularioVisible = true; // Actualiza el estado para indicar que el formulario no está visible
        formulario.remove();
    }

}


//FUNCION GUARDAR PRODUCTO
function guardarProducto() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const stock = document.getElementById('stock').value;


    // Crear un objeto con los datos del Producto
    const nuevoProducto = {
        name: nombre,
        description: descripcion,
        price: precio,
        stock: stock,

    };


    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        },
        body: JSON.stringify(nuevoProducto)  // Convierte el objeto a JSON
    };


    fetch(`http://127.0.0.1:4500/users/${userID}/products`, requestOptions)
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            //console.log(data);
            // Si la respuesta es igual al mensaje del back, mensaje de éxito 
            if (data.message === "Producto creado exitosamente") {
                alert("Producto agregado con éxito");
                cargarProductos(); //para eliminar el formulario cuando se agrega
                const formulario = document.getElementById('servicioForm');
                if (formulario) {
                    formulario.remove();
                }

            } else {
                alert("No se pudo crear el Producto");
                // Maneja otros casos aquí si es necesario
            }
        })
        .catch(error => {
            // Manejar errores de la solicitud al servidor
            console.error(error);
        });
}


///FIN DE POST PRODUCTOS
/////////////////////////////////////////////FIN DE PRODUCTOS///////////////////////////////////////


/////////////////////////////////////////////////SERVICIOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function cargarServicios() {

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

    //FUNCION PARA AGREGAR BOTON DE AGREGAR SERVICIO Y FORMULARIO
    // Boton "Agregar SERVICIO" 
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar Servicio';
    addButton.className = 'rounded-button';
    addButton.addEventListener('click', () => {
        if (formularioVisible) {
            mostrarFormularioServicio();
        }
    });

    // Crea un div para los botones
    const divBotones = document.createElement("div");
    divBotones.classList.add("facturaContainer");


    // Agrego el botón al "contenido-principal"
    divBotones.appendChild(addButton);
    contenidoPrincipal.appendChild(divBotones);

}

//POST SERVICES ---------------------------------------

function mostrarFormularioServicio() {
    // Creo formulario
    const formularioServicio = document.createElement('form');
    formularioServicio.id = 'servicioForm';

    formularioServicio.innerHTML = `
        <input type="text" id="nombre" placeholder="Nombre" required>
        <input type="text" id="descripcion" placeholder="Descripcion" required>
        <input type="number" id="precio" placeholder="Precio" required>
        <button type="button" onclick="guardarServicio()" class='small-button rounded-button add-button'> Guardar </button>
        <button type="button" onclick="cancelarServicio()" class='small-button rounded-button cancel-button'> Cancelar </button>
        `;

    //agrego el formulario
    contenidoPrincipal.appendChild(formularioServicio);

}

//FUNCION CANCELAR Servicio
function cancelarServicio() {
    // Elimina el formulario
    const formulario = document.getElementById('servicioForm');
    if (formularioVisible) { // Revisar si el formulario está visible, no es necesario invertir la condición
        // Elimina el formulario
        formularioVisible = true; // Actualiza el estado para indicar que el formulario no está visible
        formulario.remove();
    }

}


//FUNCION GUARDAR Servicio
function guardarServicio() {
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;


    // Crear un objeto con los datos del Servicio
    const nuevoServicio = {
        name: nombre,
        description: descripcion,
        price: precio,

    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        },
        body: JSON.stringify(nuevoServicio)  // Convierte el objeto a JSON
    };


    fetch(`http://127.0.0.1:4500/users/${userID}/services`, requestOptions)
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            //console.log(data);
            // Si la respuesta es igual al mensaje del back, mensaje de éxito 
            if (data.message === "Servicio creado exitosamente") {
                alert("Servicio agregado con éxito");
                cargarServicios(); //para eliminar el formulario cuando se agrega
                const formulario = document.getElementById('servicioForm');
                if (formulario) {
                    formulario.remove();
                }

            } else {
                alert("No se pudo crear el Servicio");
                // Maneja otros casos aquí si es necesario
            }
        })
        .catch(error => {
            // Manejar errores de la solicitud al servidor
            console.error(error);
        });
}

//FIN POST SERVICES -----------------------------------



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
        fetch(`http://127.0.0.1:4500/users/${userID}/deleteService/${id}`, {
            method: 'PUT',
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

// Variable de estado para controlar si el formulario está visible
let formularioVisible = true;


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



    //FUNCION PARA AGREGAR BOTON DE AGREGAR CLIENTE Y FORMULARIO
    // Boton "Agregar Cliente" 
    const addButton = document.createElement('button');
    addButton.textContent = 'Agregar Cliente';
    addButton.className = 'rounded-button';
    addButton.addEventListener('click', () => {
        if (formularioVisible) {

            mostrarFormulario();
        }
    });

    // Crea un div para los botones
    const divBotones = document.createElement("div");
    divBotones.classList.add("facturaContainer");


    // Agrego el botón al "contenido-principal"
    divBotones.appendChild(addButton);
    contenidoPrincipal.appendChild(divBotones);


}


function mostrarFormulario() {
    // Creo formulario
    const formularioCliente = document.createElement('form');
    formularioCliente.id = 'servicioForm';

    formularioCliente.innerHTML = `
        <input type="text" id="nombre" placeholder="Nombre" required>
        <input type="text" id="apellido" placeholder="Apellido" required>
        <input type="text" id="direccion" placeholder="Dirección" required>
        <input type="text" id="dni" placeholder="DNI" required>
        <input type="text" id="cuit" placeholder="CUIT" required>
        <input type="text" id="email" placeholder="Email" required>
        <button type="button" onclick="guardarCliente()" class='small-button rounded-button add-button'> Guardar </button>
        <button type="button" onclick="cancelarCliente()" class='small-button rounded-button cancel-button'> Cancelar </button>
        `;

    //agrego el formulario
    contenidoPrincipal.appendChild(formularioCliente);

}


function cancelarCliente() {
    // Elimina el formulario
    const formulario = document.getElementById('servicioForm');
    if (formularioVisible) { // Revisar si el formulario está visible, no es necesario invertir la condición
        // Elimina el formulario
        formularioVisible = true; // Actualiza el estado para indicar que el formulario no está visible
        formulario.remove();
    }

}


//FUNCION GUARDAR CLIENTE
function guardarCliente() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const direccion = document.getElementById('direccion').value;
    const dni = document.getElementById('dni').value;
    const cuit = document.getElementById('cuit').value;
    const email = document.getElementById('email').value;

    // Crear un objeto con los datos del cliente
    const nuevoCliente = {
        name: nombre,
        lastName: apellido,
        address: direccion,
        dni: dni,
        cuit: cuit,
        email: email
    };


    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        },
        body: JSON.stringify(nuevoCliente)  // Convierte el objeto a JSON
    };


    fetch(`http://127.0.0.1:4500/users/${userID}/clients`, requestOptions)
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor
            //console.log(data);
            // Si la respuesta es igual al mensaje del back, mensaje de éxito 
            if (data.message === "Cliente creado exitosamente") {
                alert("Cliente agregado con éxito");
                cargarClientes(); //para eliminar el formulario cuando se agrega
                const formulario = document.getElementById('servicioForm');
                if (formulario) {
                    formulario.remove();
                }

            } else {
                alert("No se pudo crear el cliente");
                // Maneja otros casos aquí si es necesario
            }
        })
        .catch(error => {
            // Manejar errores de la solicitud al servidor
            console.error(error);
        });
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
        fetch(`http://127.0.0.1:4500/users/${userID}/deleteClient/${id}`, {
            method: 'PUT',
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



/////////////////////////////////////////////////PRODUCTOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function rankingProducts() {

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
    h2Principal.textContent = 'Ranking de Productos';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/rankingProduct/${userID}`, requestOptions)
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
            <th>Cantidad Vendida</th>
            
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
                    <td>${producto.productID}</td>
                    <td>${producto.productName}</td>
                    <td>${producto.cantidad}</td>
                            
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



/////////////////////////////////////////////////PRODUCTOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function rankingServices() {

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
    h2Principal.textContent = 'Ranking de Servicios';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/rankingService/${userID}`, requestOptions)
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
            <th>Cantidad Vendida</th>
            
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
                    <td>${producto.serviceID}</td>
                    <td>${producto.serviceName}</td>
                    <td>${producto.cantidad}</td>
                            
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



/////////////////////////////////////////////////PRODUCTOS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener y agregar productos
function rankingCliente() {

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
    h2Principal.textContent = 'Ranking de Clientes';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500/rankingCliente/${userID}`, requestOptions)
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
            <th>Cuit</th>
            <th>Email</th>
            <th>Total Comprado</th>
            
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
                    <td>${producto.clientID}</td>
                    <td>${producto.clientName}</td>
                    <td>${producto.clientLastName}</td>
                    <td>${producto.clientCUIT}</td>
                    <td>${producto.clientEmail}</td>
                    <td>${producto.totalSpent}</td>
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



/////////////////////////////////////////////////HISTORIAL DE VENTAS////////////////////////////////////////////
// Coloca aquí el código Fetch para obtener HISTORIAL
function historialVentas() {

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
    h2Principal.textContent = 'Historial de Ventas';
    contenidoPrincipal.appendChild(h2Principal);

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    fetch(`http://127.0.0.1:4500//bills/${userID}`, requestOptions)
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
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>

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
                    <td>${producto.date}</td>
                    <td>${producto.client_name}</td>
                    <td>${producto.total}</td>
  
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


