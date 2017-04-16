from models import Post, db

health_database_status()
py = Post()
p = py.query.all()

@app.route('/', methods=['GET'])
def test():
	return jsonify({'message': 'It works!'})


@app.route('/api/backpage/posts', methods=['GET'])
def get_posts():
	posts = User.query.all()
	return jsonify({'Posts': [posts]})


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
