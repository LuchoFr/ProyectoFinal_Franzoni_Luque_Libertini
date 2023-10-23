//Borrramos todo el localStorage para evitar que se pueda iniciar secion si se entro y volvi para atras
window.onload = function () {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
}

function iniciarSesion() {
    const username = document.getElementById("in-username").value; //recibo usuario
    const password = document.getElementById("in-password").value; //recibo usuario

    const requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(username + ":" + password) // btoa encripta en bat64 para mandarlo al back
        }
    }
    fetch("http://127.0.0.1:4500/login", requestOption)
        .then(
            res => { return res.json() } //con la respuesta que consiga me quedo con el json
        )
        .then(
            resp => {
                console.log(resp)
                if (resp.token) {
                    localStorage.setItem("token", resp.token) //uso para guardar las variables
                    localStorage.setItem("username", resp.username)
                    localStorage.setItem("id", resp.id);
                    window.location.href = "../dashboard/"+resp.id;
                }
                else {
                    document.getElementById("message").innerHTML = "Usuario o Contraseña incorrecto"; //resp.message;
                }
            } //con esto capturo la respuesta de then anterior
        )
}