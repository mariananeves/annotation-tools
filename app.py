import os

from flask import Flask
from flask import jsonify
from flask import render_template

from reader import load_criteria
from reader import load_tools

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or ""

# Create a directory in a known location to save files to.
uploads_dir = os.path.join(app.instance_path, 'tools')
os.makedirs(uploads_dir, exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
	return render_template('index.html')

@app.route('/data', methods=['GET', 'POST'])
def data():
	tools = load_tools()
	return jsonify([v for k, v in tools.items()])

@app.route('/criteria', methods=['GET', 'POST'])
def criteria():
	criteria = load_criteria()
	return jsonify(criteria)

@app.route('/about')
def about():
	return render_template('about.html')

@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
	return render_template('500.html'), 500
