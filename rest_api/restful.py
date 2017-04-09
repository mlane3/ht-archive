from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
app.config['SQLALCHEMY_DATABASE_URI'] = 'Wherever Database is running'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# Needs to be updated for this database
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username


# Replace app.routes with desired API endpoint
# username parameter needs to be replaced with table column name
@app.route('/', methods=['GET'])
def test():
	return jsonify({'message': 'It works!'})


@app.route('/api/backpage/entities', methods=['GET'])
def test():
	entities = User.query.filter_by(username='entity').all()
	return jsonify({'Entities': [entities]})


@app.route('/api/backpage/entities/get/<string:entity_id>', methods=['GET'])
def test():
	entity = User.query.filter_by(id=entity_id).all()
	return jsonify({'Entities': [entity]})


@app.route('/api/backpage/entities/get/<string:email>', methods=['GET'])
def test():
	entity = User.query.filter(User.email.endswith(email)).all()
	return jsonify({'Entity': entity})


@app.route('/api/backpage/cities/get/<string:city>', methods=['GET'])
def test():
	entity = User.query.filter(User.query.filter_by(username=city).all()
	return jsonify({'Entity': entity})


"""
testlist = {'Test1': 'Test1 works', 'Test2': 'Test2 works', 'Test3': 'Test3 works'}
capitals = [{'name': 'Austin'}, {'name': 'Tallahassee'}, {'name': 'Sacramento'}]

TEST ROUTES
@app.route('/tests', methods=['GET'])
def returnnumbers():
	return jsonify({'Alltests': testlist})


@app.route('/lang/<string:name>', methods=['GET'])
def returncapital(name):
	capital = [capital for capital in capitals if capital['name'] == name]
	return jsonify({'capital': capital[0]})
"""


if __name__ == "__main__":
	app.run(debug=True, port = 8000)