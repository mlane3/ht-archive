from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck, EnvironmentDump
from models import *


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://localhost:5432/crawler"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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


health_database_status()


@app.route('/', methods=['GET'])
def test():
	return jsonify({'message': 'It works!'})


@app.route('/api/backpage/content/<int:backpage_content_id>', methods=['GET'])
def get_content(backpage_content_id):
    contents = (Backpagecontent.query.filter_by(id=backpage_content_id).all())

    return jsonify({'data': [
        dict(id=c.id, postId=c.backpagepostid, title=c.title)
        for c in contents
    ]})


@app.route('/api/backpage/cities/', methods=['GET'])
def get_all_cities():
    cities = (Backpagesite.query.all())
    # In case we want only names without id's 
    citynames = [c.name for c in cities]

    return jsonify({'data': [
        dict(id=c.id, city=c.name)
        for c in cities
    ]})


@app.route('/api/backpage/phone/', methods=['GET'])
def get_all_numbers():
    numbers = (Backpagephone.query.all())

    return jsonify({'data': [
        dict(backpagepostid=n.backpagepostid, number=n.number)
        for n in numbers
    ]})


@app.route('/api/backpage/phone/<int:backpagepost_id>', methods=['GET'])
def get_number(backpagepost_id):
    numbers = (Backpagephone.query.filter_by(backpagepostid=backpagepost_id).all())

    return jsonify({'numbers': [n.number for n in numbers]})


@app.route('/api/backpage/phone/<string:number>', methods=['GET'])
def getid_from_number(number):
    ids = (Backpagephone.query.filter_by(number=number).all())

    return jsonify({'backpagepost_ids': [i.backpagepostid for i in ids]})


@app.route('/api/backpage/email/<int:backpagepost_id>', methods=['GET'])
def get_email(backpagepost_id):
    emails = (Backpageemail.query.filter_by(backpagepostid=backpagepost_id).all())

    return jsonify({'Emails': [i.email for i in emails]})


@app.route('/api/backpage/email/<string:email>', methods=['GET'])
def getid_from_mail(email):
    ids = (Backpageemail.query.filter_by(email=email).all())

    return jsonify({'backpagepost_ids': [i.backpagepostid for i in ids]})





if __name__ == "__main__":
	app.run(debug=True, port = 8000)
