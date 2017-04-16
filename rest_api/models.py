import restful
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck, EnvironmentDump

db = SQLAlchemy(app)

# wrap the flask app and give a heathcheck url
health = HealthCheck(app, "/healthcheck")

def health_database_status():
    is_database_working = True
    output = 'database is ok'

    try:
        session = db.session()
        session.execute('SELECT * from backpageemail')
    except Exception as e:
        output = str(e)
        is_database_working = False

    print output
    return is_database_working, output


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer, unique=True)
    title = db.Column('title', db.String(120))
    body = db.Column('body', db.Unicode)
    textsearch = db.Column('textsearch', db.String(80))
    # email = db.Column(db.String(120), unique=True)

    # def __init__(self, backpagepostid, title, body, textsearch):
    #     self.backpagepostid = backpagepostid
    #     self.title = title
    #     self.body = body
    #     self.textsearch = textsearch
