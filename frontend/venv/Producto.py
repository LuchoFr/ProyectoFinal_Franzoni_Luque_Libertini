class Producto():
    def __init__(self, row):
        self._id = row[0]
        self._nombre = row[1]
        self._descripcion = row[2]
        self._precio = row[3]
        self._stock = row[4]
    

    def to_json(self):
        return{
            "id": self._id,
            "nombre": self._nombre,
            "descripcion": self._descripcion,
            "precio": self._precio,
            "stock": self._stock
        }