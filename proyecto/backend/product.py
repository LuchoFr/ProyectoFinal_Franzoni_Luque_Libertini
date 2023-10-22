class Product:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, id,codeProduct,name,description,price, stock, userID):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = id
        self._codeProduct = codeProduct
        self._name = name
        self._description = description
        self._price = price
        self._stock = stock
        self._userID = userID


    def to_json(self):
        return{
            "id": self._id,
            "codeProduct": self._codeProduct,
            "name": self._name,
            "description": self._description,
            "price": self._price,
            "stock" : self._stock,
            "userID" : self._userID
        }    