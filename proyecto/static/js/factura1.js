let formulario
let formularioProd

//Llevar el control de lo que se agrega a la factura. 
let totalFactura = 0

//banderas para verificacion y diccionarios de cada tabla
let clienteCargado = false;
let seAgregoElemento = false;
let seAgregoProducto = false;
const productosDict = {};
const clientsDict = {};
const serviciosDict = {};

//Elementos para cargar en la factura gobales
let clienteSeleccionado

const solicitarDatosFactura = async () => {
    try {
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
            }
        };

        ///////////////solicitar productos
        const realizarfech = await fetch(`http://127.0.0.1:4500/users/${id}/products`, requestOptions);

        if (!realizarfech.ok) {
            throw new Error('Error al realizar la solicitud.');
        }

        const data = await realizarfech.json();

        
        await Promise.all(data.map(async (producto) => { //en este caso el map es async crea una promesa por cada una del maepoe el promise.all hace que todas estas promesas se cumplan
            productosDict[producto.name] = producto;
        }));




/////////////////solicitar clientes

        const realizarfechclientes = await fetch(`http://127.0.0.1:4500/users/${id}/clients`, requestOptions);

        if (!realizarfechclientes.ok) {
            throw new Error('Error al realizar la solicitud.');
        }

        const dataclientes = await realizarfechclientes.json();

        
        await Promise.all(dataclientes.map(async (cliente) => { //en este caso el map es async crea una promesa por cada una del maepoe el promise.all hace que todas estas promesas se cumplan
            clientsDict[cliente.name] = cliente;
        }));
        
//////////////Solicitar servicios
        
        const realizarfechservicios = await fetch(`http://127.0.0.1:4500/users/${id}/services`, requestOptions);

        if (!realizarfechservicios.ok) {
            throw new Error('Error al realizar la solicitud.');
        }

        const dataServicios = await realizarfechservicios.json();


        await Promise.all(dataServicios.map(async (servicio) => { //en este caso el map es async crea una promesa por cada una del maepoe el promise.all hace que todas estas promesas se cumplan
            serviciosDict[servicio.name] = servicio;
        }));

        seAgregoElemento = false
        seAgregoProducto = false

        mostrarClientes()
        

    } catch (err) {
        console.error(err);
    }
};

function mostrarClientes() {
    
        contenidoPrincipal = document.querySelector(".contenido-principal");
        //borrar contenido
        contenidoPrincipal.innerHTML = '';

        const h2CargarCliente = document.createElement("h2");
        h2CargarCliente.textContent = "Seleccione un cliente para realizar la Factura" 
        // Agrega un menú desplegable para el cliente
        const clienteSelect = document.createElement("select");
        clienteSelect.setAttribute("name", "Clientes");

        const listaClientes = [];
        

        // Opciones para el menú desplegable de cliente
        for (const key in clientsDict) {
            if (clientsDict.hasOwnProperty(key)) {
                const cliente = clientsDict[key];
                const nombreCompleto = `${cliente.name} ${cliente.lastName} DNI:${cliente.dni}`;
                listaClientes.push({
                    key: key, // Almacena la clave del cliente
                    nombreCompleto: nombreCompleto
                });
            }
        }

    listaClientes.unshift({ key: "", nombreCompleto: "Haga click para desplegar y seleccionar el cliente" }); // Agrega la primera opción

    listaClientes.forEach((cliente) => {
        const opcion = document.createElement("option");
        opcion.value = cliente.key; // Usa la clave como valor
        opcion.text = cliente.nombreCompleto;
        clienteSelect.appendChild(opcion);
    });

    // Agrega un botón "Aceptar"
    const aceptarButton = document.createElement("button");
    aceptarButton.textContent = "Aceptar";
    aceptarButton.classList.add("rounded-button");

    contenidoPrincipal = document.querySelector(".contenido-principal");
    contenidoPrincipal.appendChild(h2CargarCliente)
    contenidoPrincipal.appendChild(clienteSelect);
    contenidoPrincipal.appendChild(aceptarButton);

    // Variable para almacenar el cliente seleccionado
    let keyClienteSeleccionado = null;

    // Agrega un evento para obtener el cliente seleccionado
    clienteSelect.addEventListener("change", function () {
        keyClienteSeleccionado = clienteSelect.value; // Almacena la clave del cliente seleccionado
    });

    // Agrega un evento al botón "Aceptar"
    aceptarButton.addEventListener("click", function () {
        // Comprueba si se ha seleccionado un cliente antes de continuar
        if (keyClienteSeleccionado) {
            // Puedes utilizar clienteSeleccionado (clave del cliente) para acceder a los datos del cliente en clientsDict
            clienteSeleccionado = clientsDict[keyClienteSeleccionado];
            mostrarFactura(clienteSeleccionado);
        } else {
            alert("Debe seleccionar un cliente para crear la factura.");
        }
    });
    

}



function mostrarFactura(clienteSeleccionado) {

    // Verificar si el div con clase "contenido-principal" ya ha sido creado
    contenidoPrincipal = document.querySelector(".contenido-principal");
    contenidoPrincipal.innerHTML = "";
    let facturaContainer; // Cambio a variable let

    if (contenidoPrincipal) {
        // Verificar si la facturaContainer ya ha sido creada
        facturaContainer = document.getElementById("facturaContainer");

        if (!facturaContainer) {
            facturaContainer = document.createElement("div");
            facturaContainer.setAttribute("id", "facturaContainer");

            const h2 = document.createElement("h2");
            h2.textContent = `Factura para ${clienteSeleccionado.name} ${clienteSeleccionado.lastName} DNI:${clienteSeleccionado.dni}`;

            
            const h2total = document.createElement("h2");
            h2total.textContent = "TOTAL: $"

            const totalFacturaSpan = document.createElement("span")
            totalFacturaSpan.textContent = 0
            totalFacturaSpan.setAttribute("id","totalFacturaSpan")
            h2total.appendChild(totalFacturaSpan)

            const table = document.createElement("table");
            table.setAttribute("id", "facturaTable");

            const thead = document.createElement("thead");
            const tr = document.createElement("tr");
            const th1 = document.createElement("th");
            th1.textContent = "Producto";
            const th2 = document.createElement("th");
            th2.textContent = "Precio";
            const th3 = document.createElement("th");
            th3.textContent = "Cantidad";
            const th4 = document.createElement("th");
            th4.textContent = "Total";

            tr.appendChild(th1);
            tr.appendChild(th2);
            tr.appendChild(th3);
            tr.appendChild(th4);
            thead.appendChild(tr);

            const tbody = document.createElement("tbody");
            tbody.setAttribute("id", "facturaBody");

            // Crea un div para los botones
            const divBotones = document.createElement("div");
            divBotones.classList.add("botonesFactura");

            const agregarServicioButton = document.createElement("button");
            agregarServicioButton.setAttribute("id", "agregarServicio");
            agregarServicioButton.textContent = "Agregar Servicio";
            agregarServicioButton.classList.add("rounded-button")

            const agregarProductoButton = document.createElement("button");
            agregarProductoButton.setAttribute("id", "agregarProducto");
            agregarProductoButton.textContent = "Agregar Producto";
            agregarProductoButton.classList.add("rounded-button")

            const finalizarBoleta = document.createElement("button");
            finalizarBoleta.setAttribute("id", "finalizarBoleta");
            finalizarBoleta.textContent = "Cargar boleta";
            finalizarBoleta.classList.add("rounded-button")
            finalizarBoleta.classList.add("edit-button")
            finalizarBoleta.addEventListener("click", cargarBoleta);

            divBotones.appendChild(agregarServicioButton);
            divBotones.appendChild(agregarProductoButton);
            divBotones.appendChild(finalizarBoleta);

            facturaContainer.appendChild(h2);
            facturaContainer.appendChild(h2total);
            facturaContainer.appendChild(table);
            table.appendChild(thead);
            table.appendChild(tbody);
            facturaContainer.appendChild(divBotones);
 
            contenidoPrincipal.appendChild(facturaContainer);

            agregarServicioButton.addEventListener("click", agregarServicio);

            asignarEventoClick(agregarProductoButton);
            

        }

    }
}

function asignarEventoClick(agregarProductoButton) {
    agregarProductoButton.onclick = function () {
        // Código a ejecutar cuando se hace clic en el botón
        CargarFormulario(); // Llama a tu función personalizada aquí
    };
}



function CargarFormulario() {
    formulario = document.getElementById("servicioForm");
    formularioProd = document.getElementById("productoForm");
    if (formulario || formularioProd) {
        try{
            contenidoPrincipal.removeChild(formulario);
        }
        catch(e){
            console.log("")
            contenidoPrincipal.removeChild(formularioProd)
        }
    }

    formulario = document.createElement("form");
    formulario.setAttribute("id", "productoForm");

    // Agrega un menú desplegable para el producto
    const productoSelect = document.createElement("select");
    productoSelect.setAttribute("name", "producto");


    // Opciones para el menú desplegable de producto
    const listaNombreProducto = Object.keys(productosDict);
    listaNombreProducto.unshift("Haga click para desplegar y seleccionar un producto"); //agrego en el primer valor de la tabla para mostrarlo como selec.
    listaNombreProducto.forEach((producto) => {
        const opcion = document.createElement("option");
        opcion.value = producto;
        opcion.text = producto;
        productoSelect.appendChild(opcion);
    });


    // Agrega un campo de entrada para el precio
    const precioInput = document.createElement("input");
    precioInput.setAttribute("type", "text");
    precioInput.setAttribute("placeholder", "Precio");
    precioInput.setAttribute("name", "precio");
    precioInput.setAttribute("readonly", "readonly"); // Hace que el campo sea de solo lectura

    const stockInput = document.createElement("input");
    stockInput.setAttribute("type", "text");
    stockInput.setAttribute("placeholder", "Stock");
    stockInput.setAttribute("name", "stock");
    stockInput.setAttribute("readonly", "readonly"); // Hace que el campo sea de solo lectura


    // Agrega un campo de entrada para la cantidad
    const cantidadInput = document.createElement("input");                             
    cantidadInput.setAttribute("type", "number");
    cantidadInput.setAttribute("placeholder", "Cantidad");
    cantidadInput.setAttribute("name", "cantidad");

    // Agrega un botón para enviar el formulario
    const enviarButton = document.createElement("button");
    enviarButton.setAttribute("type", "submit");
    enviarButton.textContent = "Agregar";

    // Agrega los elementos al formulario
    formulario.appendChild(productoSelect);
    formulario.appendChild(precioInput);
    formulario.appendChild(stockInput);
    formulario.appendChild(cantidadInput);
    formulario.appendChild(enviarButton);

    // Agrega el formulario al contenedor principal
    contenidoPrincipal.appendChild(formulario);

    // Agrega un evento de cambio al menú desplegable de productos
    productoSelect.addEventListener("change", function () {

        const productoSeleccionado = productoSelect.value;

        if (productoSeleccionado != "Haga click para desplegar y seleccionar un producto") {
            const precio = productosDict[productoSeleccionado].price; 
            const stock = productosDict[productoSeleccionado].stock;

            // Actualiza el campo de precio y stock
            precioInput.value = `Precio: $ ${precio}`;
            stockInput.value = `N° Stock: ${stock} Un.`
        }
        else{
            precioInput.value = ""
            stockInput.value = ""
        }
    });

    // Agrega un evento al botón "Agregar" en el formulario
    enviarButton.addEventListener("click", function (event) {
                
        const productoSeleccionado = productoSelect.value;

        if (cantidadInput && cantidadInput.value>0)  {
            event.preventDefault(); // Evita que el formulario se envíe

            // Obtiene los valores del formulario
            const productoSeleccionado = productoSelect.value;
            const precio = productosDict[productoSeleccionado].price;
            let stock = productosDict[productoSeleccionado].stock; // Obtiene el stock del producto

            const cantidad = parseInt(cantidadInput.value, 10);

            // Verifica si hay suficiente stock para la cantidad seleccionada
            if (cantidad > stock) {
                alert("No hay suficiente stock para la cantidad seleccionada.");
                return; // No se procede si no hay suficiente stock
            }

            stock -= cantidad;

            // Actualiza el stock en el diccionario del producto
            productosDict[productoSeleccionado].stock = stock;
            // Calcula el total
            const total = precio * cantidad;

            // Crea una nueva fila de tabla
            const newRow = document.createElement("tr");

            // Crea las celdas de la fila
            const cellProducto = document.createElement("td");
            const cellPrecio = document.createElement("td");
            const cellCantidad = document.createElement("td");
            const cellTotal = document.createElement("td");

            // Asigna los valores a las celdas
            cellProducto.textContent = productoSeleccionado;
            cellPrecio.textContent = `$ ${precio}`;
            cellCantidad.textContent = cantidad;
            cellTotal.textContent = `$ ${total.toFixed(2)}`;

            // Agrega las celdas a la fila
            newRow.appendChild(cellProducto);
            newRow.appendChild(cellPrecio);
            newRow.appendChild(cellCantidad);
            newRow.appendChild(cellTotal);

            // Agrega la fila a la tabla
            const facturaTable = document.getElementById("facturaTable");
            const tbody = facturaTable.querySelector("tbody");
            tbody.appendChild(newRow);

            // Limpia el formulario
            productoSelect.selectedIndex = 0;
            cantidadInput.value = "";

            // Actualiza el campo de precio y stock en el formulario
            precioInput.value = "";
            stockInput.value = "";
            totalFactura += total
            totalFacturaModificar = document.getElementById("totalFacturaSpan")
            totalFacturaModificar.textContent = totalFactura.toFixed(2)   
            seAgregoProducto = true; 

    } else {
        event.preventDefault(); // Evita que el formulario se envíe
        if (productoSeleccionado === "Haga click para desplegar y seleccionar un producto") {
            event.preventDefault(); // Evita que el formulario se envíe
            alert("Debes seleccionar un producto antes de agregarlo a la factura.");
            return;
        }
        event.preventDefault(); // Evita que el formulario se envíe
        alert("La cantidad de productos para cargar debe ser mayor a 0.");
        return;
    }
    })
}

function agregarServicio() {
    formulario = document.getElementById("servicioForm");
    formularioProd = document.getElementById("productoForm");
    if (formulario || formularioProd) {
        try{
            contenidoPrincipal.removeChild(formulario);
        }
        catch(e){
            contenidoPrincipal.removeChild(formularioProd)
            console.log("")
        }
    }

    formulario = document.createElement("form");
    formulario.setAttribute("id", "servicioForm");

    // Agrega un menú desplegable para el servicio
    const servicioSelect = document.createElement("select");
    servicioSelect.setAttribute("name", "servicio");

    // Opciones para el menú desplegable de servicios
    const listaNombreServicio = Object.keys(serviciosDict);
    listaNombreServicio.unshift("Haga click para desplegar y seleccionar un servicio"); // Agrego el primer valor para mostrar como selección.
    listaNombreServicio.forEach((servicio) => {
        const opcion = document.createElement("option");
        opcion.value = servicio;
        opcion.text = servicio;
        servicioSelect.appendChild(opcion);
    });

    // Agrega un campo de entrada para el precio
    const precioInput = document.createElement("input");
    precioInput.setAttribute("type", "text");
    precioInput.setAttribute("placeholder", "Precio");
    precioInput.setAttribute("name", "precio");
    precioInput.setAttribute("readonly", "readonly"); // Hace que el campo sea de solo lectura

    // Agrega un botón para enviar el formulario
    const enviarButtonServ = document.createElement("button");
    enviarButtonServ.setAttribute("type", "button");
    enviarButtonServ.textContent = "Agregar";

    // Agrega los elementos al formulario
    formulario.appendChild(servicioSelect);
    formulario.appendChild(precioInput);
    formulario.appendChild(enviarButtonServ);

    // Agrega el formulario al contenedor principal
    contenidoPrincipal.appendChild(formulario);

    // Agrega un evento de cambio al menú desplegable de servicios
    servicioSelect.addEventListener("change", function () {
        const servicioSeleccionado = servicioSelect.value;

        if (servicioSeleccionado !== "Haga click para desplegar y seleccionar un servicio") {
            const precio = serviciosDict[servicioSeleccionado].price;

            // Actualiza el campo de precio
            precioInput.value = `Precio: $ ${precio}`;
        } else {
            precioInput.value = "";
        }
    });

    enviarButtonServ.addEventListener("click", function (event) {
        // Obtiene el servicio seleccionado
        const servicioSeleccionado = servicioSelect.value;

        if (servicioSeleccionado !== "Haga click para desplegar y seleccionar un servicio") {
            const precio = serviciosDict[servicioSeleccionado].price;

            // Calcula el total del servicio (siempre con cantidad 1)
            const total = precio * 1;

            // Crea una nueva fila de tabla para el servicio
            const newRow = document.createElement("tr");

            // Crea las celdas de la fila
            const cellServicio = document.createElement("td");
            const cellPrecio = document.createElement("td");
            const cellCantidad = document.createElement("td");
            const cellTotal = document.createElement("td");

            // Asigna los valores a las celdas
            cellServicio.textContent = servicioSeleccionado;
            cellPrecio.textContent = `$ ${precio}`;
            cellCantidad.textContent = 1; // Cantidad siempre es 1
            cellTotal.textContent = `$ ${total.toFixed(2)}`;

            // Agrega las celdas a la fila
            newRow.appendChild(cellServicio);
            newRow.appendChild(cellPrecio);
            newRow.appendChild(cellCantidad);
            newRow.appendChild(cellTotal);

            // Agrega la fila a la tabla de servicios
            const facturaTable = document.getElementById("facturaTable");
            const tbody = facturaTable.querySelector("tbody");
            tbody.appendChild(newRow);

            // Limpia el formulario de servicio
            servicioSelect.selectedIndex = 0;

            // Actualiza el total en el span
            totalFactura += total;
            const totalFacturaModificar = document.getElementById("totalFacturaSpan");
            totalFacturaModificar.textContent = totalFactura.toFixed(2);
            seAgregoElemento = true;

        } else {
            alert("Debe seleccionar un servicio antes de agregarlo a la factura.");
        }
    });
}

function cargarBoleta() {
    if(seAgregoElemento == true || seAgregoProducto == true){

    // Datos para stock
    const productosArray = Object.values(productosDict); // Obtener un array con los valores de 'productosDict'
    const productoListoEnv = {
        products: productosArray
    };

    // Datos para factura
    const fechaBoleta = new Date();
    const fecha = `${fechaBoleta.getFullYear()}-${(fechaBoleta.getMonth() + 1).toString().padStart(2, '0')}-${fechaBoleta.getDate().toString().padStart(2, '0')}`;

    const totalFacturaEnviar = document.getElementById("totalFacturaSpan");
    const totalFact = totalFacturaEnviar.textContent;

    const dicFactura = {
        date: fecha,
        price: totalFact,
        userID: userID,
        clientID: clienteSeleccionado.id
    };



    if(seAgregoProducto=true){
        const requestOptionsStock = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': userID
            },
            body: JSON.stringify(productoListoEnv)
        }
        fetch('http://127.0.0.1:4500/products/update/stock', requestOptionsStock)
        .then(response => response.json())
        .then(data => {
            if (data.message === "Stock actualizado correctamente") {
                alert("Stock de productos Actualizado")
            } 
        })
        .catch(error => {
            console.error("Error al actualizar el stock:", error);
        });
    }

    const requestOptionsFactura = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': userID
        },
        body: JSON.stringify(dicFactura)
    };

    fetch('http://127.0.0.1:4500/bills', requestOptionsFactura)
        .then(response => response.json())
        .then(data => {
            if (data.message === "Factura agregada con éxito") {
                alert("Factura agregada con éxito");
                formulario.remove();
                solicitarDatosFactura();
            } else {
                alert("No se pudo crear la factura");
            }
        })
        .catch(error => {
            console.error("Error al cargar la factura:", error);
        });
}else {
    alert("No agregado ningun producto o servicio a la boleta")
}
} 