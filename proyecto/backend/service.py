class Service:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, fila):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = fila[0]
        self._name = fila[1]
        self._description = fila[2]
        self._price = fila[3]
        self._userID = fila[4]

    def to_json(self):
        return{
            "id": self._id,
            "name": self._name,
            "description": self._description,
            "price": self._price,
            "userID": self._userID
        }    