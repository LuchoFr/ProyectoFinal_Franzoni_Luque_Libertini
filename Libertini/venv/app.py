import mysql.connector
from flask_mysqldb import MySQL
from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
from config import config



app = Flask(__name__)

# Configura la conexión a la base de datos

""" app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'userFlask'
app.config['MYSQL_PASSWORD'] ='password'
app.config['MYSQL_DB'] = 'CRUD' """

#settings
app.config['SECRET_KEY'] = 'app_123'

mysql=MySQL(app)



@app.route('/')
def index():
    #return jsonify({"message": "API desarrollada con Flask"})
    return render_template('index.html')


@app.route('/productos', methods=['GET'])
def listar_productos():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM Productos')
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
        return jsonify({'mensaje':'Error'})



@app.route('/productos/<id>', methods=['GET'])
def ver_producto_por_id(id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT id, nombre, descripcion, precio, stock FROM productos WHERE id = '{0}'".format(id))
         #almacenamos una lista de productos
        data = cur.fetchone()
        #creo una lista para almacenar los productos q aextraigo de la BD
        if data != None:
            producto = {'id':data[0],
                       'nombre':data[1],
                       'descripcion':data[2],
                       'precio':data[3],
                       'stock':data[4]}
        return jsonify({"producto": producto, 'mensaje':'Producto Encontrado'})
        
    except Exception as ex:
        return jsonify({'mensaje':'Error'})




def pagina_no_encontrada(error):
    return '<h1> La Pagina que intentas acceder no existe. </h1>', 404




@app.route('/agregar_producto', methods=['POST'])
def agregar_producto():
    try:
        if request.method == 'POST':
            nombre = request.form['nombreProducto']
            descripcion = request.form['descripcionProducto']
            precio = request.form['precioProducto']
            stock = request.form['stockProducto']
            
            cur = mysql.connection.cursor()
            cur.execute('INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES (%s,%s,%s,%s)',(nombre, descripcion, precio, stock))
            mysql.connection.commit() #confirma la accion
            
            flash('Producto agregado correctamente.')

    except Exception as ex:
        return jsonify({'mensaje':'Error'})

        #return redirect('/productos')






if __name__ == '__main__':
    #configuraciones externas
    app.config.from_object(config['development'])
    #un handler manejado por una funcion
    app.register_error_handler(404, pagina_no_encontrada)
    app.run(debug=True, port=4500)