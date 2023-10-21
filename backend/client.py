class Client:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, id,name,lastName,address, dni, email,userID):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = id
        self._name = name
        self._lastName = lastName
        self._address = address
        self._dni = dni
        self._email = email
        self._userID = userID


    def to_json(self):
        return{
            "id": self._id,
            "name": self._name,
            "surname": self._lastName,
            "address": self._address,
            "dni" : self._dni,
            "email": self._email,
            "userID": self._userID
        }    