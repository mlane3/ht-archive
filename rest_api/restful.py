from flask import Flask, jsonify, request, render_template

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://localhost:5432/crawler"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


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
