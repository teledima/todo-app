from flask import Flask, session, redirect, render_template, make_response
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


@app.route('/tasks/<int:task_id>', methods=['GET'])
def show_full_info(task_id):
    if 'user_id' in session:
        db = sqlite3.connect('todo.db')
        cur = db.cursor()
        task = cur.execute('select title, description, user_id from tasks where id = :id', {'id': task_id}).fetchone()
        task_dict = dict(title=task[0], description=task[1], user_id=task[2])
        if task_dict['user_id'] == session['user_id']:
            return render_template('full_info.html', title=task_dict['title'], description=task_dict['description'])
        else:
            return make_response('', 403)
    else:
        return redirect('/login')
