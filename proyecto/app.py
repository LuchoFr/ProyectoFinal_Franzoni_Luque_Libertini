import mysql.connector
from flask_mysqldb import MySQL
from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
import jwt
import datetime
from functools import wraps
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configura la conexión a la base de datos
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'user_api_final'
app.config['MYSQL_PASSWORD'] ='pass'
app.config['MYSQL_DB'] = 'db_proyecto_final'

#settings
app.config['SECRET_KEY'] = 'app_123'

mysql=MySQL(app)


#misma para verificar los tokens verificada
def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print(kwargs)
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({"message": "Falta el token"}), 401
        
        user_id = None

        if 'user-id' in request.headers:
            user_id = request.headers['user-id']

        if not user_id:
            return jsonify({"message": "Falta el usuario"}), 401
        
        try:
            data = jwt.decode(token , app.config['SECRET_KEY'], algorithms = ['HS256'])
            token_id = data['id']

            if int(user_id) != int(token_id):
                return jsonify({"message": "Error de id"}), 401
            
        except Exception as e:
            print(e)
            return jsonify({"message": str(e)}), 401

        return func(*args, **kwargs)
    return decorated


def user_resources(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("Argumentos en user_resources: ", kwargs)
        id_user_route = kwargs['id']
        user_id = request.headers['user-id']
        if int(id_user_route) != int(user_id):
            return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        return func(*args, **kwargs)
    return decorated


#Esta tambien siempre va despues de def token_required(func)
#Esta se puede modificar para hacer con producto modificando solo la tabla 
#todas las rutas donde accedemos a un cliente por su id DELETE MODIFICAR
def client_resource(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        print("Argumentos en client_resource: ", kwargs)
        id_cliente = kwargs['id']
        cur = mysql.connection.cursor()
        cur.execute('SELECT userID FROM client WHERE id = {0}'.format(id_cliente)) 
        data = cur.fetchone()
        if data:
            id_prop = data[0]
            user_id = request.headers['user-id']
            if int(id_prop) != int(user_id):
                return jsonify({"message": "No tiene permisos para acceder a este recurso"}), 401
        return func(*args, **kwargs)
    return decorated

@app.route('/')
def index():
    return render_template("auth/login.html")

@app.route('/dashboard')
def otra_pagina():
    return render_template('index.html')

def pagina_no_encontrada(error):
    return '<h1> La Pagina que intentas acceder no existe. </h1>', 404


#actualizado con base de datos
@app.route('/login', methods=['POST'])
def loggin():
    auth = request.authorization
    
    # Comprueba si se proporcionó el usuario y la contraseña
    if not auth or not auth.username or not auth.password:
        return jsonify({"message": "No autorizado"}), 401

    # Consulta la base de datos para verificar el usuario y la contraseña
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE user = %s AND password = %s", (auth.username, auth.password))
    row = cur.fetchone()

    if not row:
        return jsonify({"message": "No autorizado"}), 401

    # En este punto, el usuario existe en la base de datos y la contraseña coincide
    token = jwt.encode({'id': row[0], 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=100), 'iss': 'your_iss_key'}, app.config["SECRET_KEY"])

    return jsonify({"token": token, "username": auth.username, "id": row[0]})


'''@app.route('/productos', methods=['GET'])
@token_required
@user_resources
def listar_productos():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM Products')
         #almacenamos una lista de productos
        data = cur.fetchall()
        #creo una lista para almacenar los productos q aextraigo de la BD
        productos = []
        for fila in data:
            producto= {'id':fila[0],
                       'nombre':fila[1],
                       'descripcion':fila[2],
                       'precio':fila[3],
                       'stock':fila[4]}
            productos.append(producto)
        return jsonify({"productos": productos, 'mensaje':'Productos Listados'})
        
    except Exception as ex:
        return jsonify({'mensaje':'Error'})'''
    





if __name__ == '__main__':
    #configuraciones externas
    #un handler manejado por una funcion
    app.register_error_handler(404, pagina_no_encontrada)
    app.run(debug=True, port=4500)