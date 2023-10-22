class Service:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, id,codeService,name,description,price, userID):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = id
        self._codeService = codeService
        self._name = name
        self._description = description
        self._price = price
        self._userID = userID

    def to_json(self):
        return{
            "id": self._id,
            "codeService" : self._codeService,
            "name": self._name,
            "description": self._description,
            "price": self._price,
            "userID": self._userID
        }    