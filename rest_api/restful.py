from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck, EnvironmentDump


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


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    backpagepostid = db.Column('backpagepostid', db.Integer, unique=True)
    title = db.Column('title', db.String(120))
    body = db.Column('body', db.Unicode)
    textsearch = db.Column('textsearch', db.String(80))
    


health_database_status()
bp_data = Post()
p = bp_data.query.all()


@app.route('/', methods=['GET'])
def test():
	return jsonify({'message': 'It works!'})


# @app.route('/api/backpage/posts', methods=['GET'])
# def get_posts():
# 	posts = bp_data.query.all()
# 	return jsonify({'Posts': [posts]})

# @app.route('/api/backpage/entities', methods=['GET'])
# def test1():
# 	entities = User.query.filter_by(username='entity').all()
# 	return jsonify({'Entities': [entities]})


# @app.route('/api/backpage/entities/get/<string:entity_id>', methods=['GET'])
# def test2():
# 	entity = User.query.filter_by(id=entity_id).all()
# 	return jsonify({'Entities': [entity]})


# @app.route('/api/backpage/entities/get/<string:email>', methods=['GET'])
# def test3():
# 	entity = User.query.filter(User.email.endswith(email)).all()
# 	return jsonify({'Entity': entity})


# @app.route('/api/backpage/cities/get/<string:city>', methods=['GET'])
# def test():
# 	entity = User.query.filter(User.query.filter_by(username=city).all()
# 	return jsonify({'Entity': entity})


if __name__ == "__main__":
	app.run(debug=True, port = 8000)
