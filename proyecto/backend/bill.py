class Bill:
     # Constructor de la clase (método especial llamado al crear una instancia)
    def __init__(self, id,date,userID,clientID):
        # Atributos de instancia (propiedades específicas de cada instancia)
        self._id = id
        self._date = date
        self._userID = userID
        self._clientID = clientID

    def to_json(self):
        return{
            "id": self._id,
            "date": self._date,
            "userID":self._userID,
            "clientID":self._clientID
        }    