from flask import Flask, session, redirect, render_template
import sqlite3
from api import api_blueprint

app = Flask(__name__)
app.register_blueprint(api_blueprint)
app.secret_key = 'dfsfadgbdf'


@app.route('/')
def home():
    if 'user_login' in session and session['user_login']:
        db = sqlite3.connect('todo.db')
        cur = db.cursor()
        unchecked_tasks = cur.execute('select id, title, description from tasks where checked=0 and user_id = :user_id', {
            "user_id": session['user_id']
        }).fetchall()

        unchecked_tasks_dict = [dict(id=task[0], title=task[1], description=task[2]) for task in unchecked_tasks]

        checked_tasks = cur.execute('select id, title, description from tasks where checked=1 and user_id = :user_id', {
            "user_id": session['user_id']
        }).fetchall()

        checked_tasks_dict = [dict(id=task[0], title=task[1], description=task[2]) for task in checked_tasks]

        return render_template('home.html',
                               username=session['user_login'],
                               unchecked_tasks=unchecked_tasks_dict,
                               checked_tasks=checked_tasks_dict)
    else:
        # Display Log in template
        return redirect('/login')


@app.route('/login')
def login():
    if 'user_login' in session and session['user_login']:
        return redirect('/')
    else:
        return render_template('login.html')
