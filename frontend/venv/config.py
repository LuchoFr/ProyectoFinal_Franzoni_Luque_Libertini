class DevelopmentConfig():
    DEBUG = True
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'userFlask'
    MYSQL_PASSWORD = 'password'
    MYSQL_DB = 'CRUD'

config = {
    'development': DevelopmentConfig
}