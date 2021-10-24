from flask import Flask
from flask_cors import CORS
from api import api_blueprint

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.register_blueprint(api_blueprint)
app.secret_key = 'dfsfadgbdf'
