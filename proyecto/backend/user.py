class User:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, id, companyName,address, cuit, email, user, password):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = id
        self._companyName = companyName
        self._address = address
        self._cuit = cuit
        self._email = email
        self._user = user
        self._password = password

    def to_json(self):
        return{
            "id": self._id,
            "companyName": self._companyName,
            "address": self._address,
            "cuit": self._cuit,
            "email":self._email,
            "user" : self._user,
            "password": self._password
        }    
