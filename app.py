from flask import Flask, session, redirect, render_template, make_response, Response
from api import api_blueprint

app = Flask(__name__)
app.register_blueprint(api_blueprint)
app.secret_key = 'dfsfadgbdf'


@app.route('/')
def home():
    if 'user_login' in session and session['user_login']:
        return render_template('home.html')
    else:
        # Display Log in template
        return redirect('/login')


@app.route('/login')
def login():
    if 'user_login' in session and session['user_login']:
        return redirect('/')
    else:
        return render_template('login.html')
