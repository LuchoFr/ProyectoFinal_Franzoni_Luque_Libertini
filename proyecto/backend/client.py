class Client:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, fila):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = fila[0]
        self._name = fila[1]
        self._lastName = fila[2]
        self._address = fila[3]
        self._dni = fila[4]
        self._cuit = fila[5]
        self._email = fila[6]
        self._userID = fila[7]


    def to_json(self):
        return{
            "id": self._id,
            "name": self._name,
            "surname": self._lastName,
            "address": self._address,
            "dni" : self._dni,
            "cuit" :self._cuit,
            "email": self._email,
            "userID": self._userID
        }    