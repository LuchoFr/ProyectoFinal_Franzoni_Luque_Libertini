
window.onload = function () {
    const token = localStorage.getItem("token");
    if (token) {
        const username = localStorage.getItem("username");

        document.getElementById("usernameBienvenida").innerHTML = username;
    }
    else {
        window.location.href = "../";
    }
}


// Coloca aquí el código Fetch para obtener y agregar productos
function cargarProductos() {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');


    //recuperar credenciales para validar el acceso
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id
        }
    }


    //seleccionamos div del main principal
    const contenidoPrincipal = document.querySelector('.contenido-principal');

    // Elimino tabla existente si ya se creó anteriormente asi no la repite
    const tablaExistente = contenidoPrincipal.querySelector('#table-products');
    if (tablaExistente) {
        contenidoPrincipal.removeChild(tablaExistente);
    }


    //HEADERS
    const headers = ["id", "name", "description", "price", "stock"]

    // URL del endpoint para obtener productos
    //const url = `http://127.0.0.1:4500/users/${userID}/products`;

    // Agregar la tabla a #contenidoPrincipal
    //contenidoPrincipal.appendChild(table);

    fetch(`http://127.0.0.1:4500/users/${id}/products`, requestOptions)
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
                fila.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.name}</td>
                    <td>${producto.description}</td>
                    <td>${producto.price}</td>
                    <td>${producto.stock}</td>
                    <td>
                                <button onclick='editar(${producto.id})' class="small-button rounded-button edit-button">Editar</button>
                            </td>
                            <td>
                                <button onclick='eliminar(${producto.id})' class="small-button rounded-button delete-button">Eliminar</button>
                            </td>
                `;
                tbody.appendChild(fila);

            });
            // Aagrego el encabezado y el cuerpo a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // agregar la tabla al elemento "contenido-principal"
            contenidoPrincipal.appendChild(table);

            // Actualizar el título h2
            const h2Principal = document.getElementById('h2-principal');
            h2Principal.textContent = 'Productos Disponibles';
        })

}


// PARA QUE SE MANTENGA PRESIONADO CUANDO SE CLICKEA
// ESTO ES CLAVE PARA CAMBIAR CLASES A ELEMENTOS QUE COMPARTEN UNA CLASE
//QUE ANTERIORMENTE SE LE DIERON ESTILOS CON CSS
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.sidebar a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Elimina la clase "active" de todos los enlaces
            links.forEach(l => l.classList.remove('active'));

            // Agrega la clase "active" al enlace que se hizo clic
            link.classList.add('active');
        });
    });
});
