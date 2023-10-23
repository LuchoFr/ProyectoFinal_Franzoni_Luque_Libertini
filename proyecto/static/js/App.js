
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


    //el acceso a productos
    //const linkProductos = document.querySelector('#link-productos');
    //const tableBody = document.querySelector('#list-products');
    //const h2Principal = document.querySelector('#h2-principal');


    // URL del endpoint para obtener productos
    //const url = `http://127.0.0.1:4500/users/${userID}/products`;


    fetch(`http://127.0.0.1:4500/users/${id}/products`, requestOptions)
        .then(response => { return response.json() })
        .then(data => {
            console.log(data);

            data.forEach(producto => {
                mostrarProductos(producto)
            });
        })

}


function mostrarProductos(producto) {
    console.log(producto.name);

}