window.onload = function(){
    const token = localStorage.getItem("token");
    if (token){
        const username = localStorage.getItem("username");
        const userid = localStorage.getItem("id");
        document.getElementById("usernameBienvenida").innerHTML = username;
    }
    else{
        window.location.href = "../";
    }
}






document.addEventListener('DOMContentLoaded', () => {
    // Coloca aquí el código Fetch para obtener y agregar productos

    //el acceso a productos
    const linkProductos = document.querySelector('#link-productos');
    const tableBody = document.querySelector('#list-products');

    linkProductos.addEventListener('click', () => {

    // URL del endpoint para obtener productos
    const url = '/productos';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#table-products tbody');

            data.productos.forEach(producto => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.stock}</td>
                    <td>
                                <button class="small-button rounded-button edit-button">Editar</button>
                            </td>
                            <td>
                                <button class="small-button rounded-button delete-button">Eliminar</button>
                            </td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener productos: ', error);
        });
    })

});