from flask import Blueprint, request, session, make_response, jsonify
import sqlite3
from pypika import Table, Query

tasks_blueprint = Blueprint('tasks_blueprint', __name__, url_prefix='/tasks')
tasks = Table('tasks')


@tasks_blueprint.route('/create-task', methods=['POST'])
def create_task():
    data = request.json
    title = data['title']
    description = data['description']

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    new_task_id = cur.execute('insert into tasks(title, description, checked, user_id) values (:title, :description, 0, :user_id) returning id', {
        "title": title,
        "description": description,
        "user_id": session['user_id']
    }).fetchone()[0]
    db.commit()
    return jsonify(id=new_task_id), 200


@tasks_blueprint.route('/delete-task', methods=['POST'])
def delete_task():
    data = request.json
    id = data['id']

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    cur.execute('delete from tasks where id = :id', {"id": id})
    db.commit()
    return make_response('', 200)


@tasks_blueprint.route('/update-task', methods=['POST'])
def update_status():
    data = request.json
    id = data['id']
    title = data['title'] if 'title' in data else None
    description = data['description'] if 'description' in data else None
    status = data['status'] if 'status' in data else None

    update_stmt = Query.update(tasks)
    if title is not None:
        update_stmt = update_stmt.set('title', title)
    if description is not None:
        update_stmt = update_stmt.set('description', description)
    if status is not None:
        update_stmt = update_stmt.set('checked', status)
    update_stmt = update_stmt.where(tasks.id == id)

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    cur.execute(update_stmt.get_sql())
    db.commit()
    return make_response(jsonify(), 200)


@tasks_blueprint.route('/get-full-info/<int:task_id>', methods=['GET'])
def get_full_info(task_id):
    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    task = cur.execute('select title, description, user_id from tasks where id = :id', {'id': task_id}).fetchone()
    task_dict = dict(title=task[0], description=task[1], user_id=task[2])

    if task_dict['user_id'] == session['user_id']:
        return jsonify(title=task_dict['title'], description=task_dict['description']), 200
    else:
        return make_response('', 403)
