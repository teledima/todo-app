from flask import Blueprint, request, session, make_response, jsonify
import sqlite3
from pypika import Table, Query

tasks_blueprint = Blueprint('tasks_blueprint', __name__, url_prefix='/tasks')
tasks = Table('tasks')


@tasks_blueprint.route('/get-tasks', methods=['GET'])
def get_tasks():
    if 'user_id' not in session or not session['user_id']:
        return make_response('', 403)
    checked = True if request.args.get('checked') == 'true' else False

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    tasks = cur.execute('select id, title, checked from tasks where user_id = :user_id and checked = :checked',
                        {'user_id': session['user_id'], 'checked': checked}).fetchall()
    tasks_dict = [{'id': row[0], 'title': row[1], 'checked': row[2]} for row in tasks]
    return jsonify(tasks=tasks_dict), 200


@tasks_blueprint.route('/create-task', methods=['POST'])
def create_task():
    if 'user_id' not in session or not session['user_id']:
        return make_response('', 403)
    data = request.json
    title = data['title']
    description = data['description']

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    new_task_id = cur.execute(
        'insert into tasks(title, description, checked, user_id) values (:title, :description, 0, :user_id) returning id',
        {
            "title": title,
            "description": description,
            "user_id": session['user_id']
        }).fetchone()[0]
    db.commit()
    return jsonify(ok=True, id=new_task_id), 200


@tasks_blueprint.route('/delete-task', methods=['POST'])
def delete_task():
    if 'user_id' not in session or not session['user_id']:
        return make_response('', 403)
    data = request.json
    id = data['id']

    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    cur.execute('delete from tasks where id = :id and user_id = :user_id ', {"id": id, "user_id": session["user_id"]})
    db.commit()
    return jsonify(ok=True), 200


@tasks_blueprint.route('/update-task', methods=['POST'])
def update_status():
    if 'user_id' not in session or not session['user_id']:
        return make_response('', 403)
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
    return make_response(jsonify(ok=True), 200)


@tasks_blueprint.route('/get-full-info/<int:task_id>', methods=['GET'])
def get_full_info(task_id):
    if 'user_id' not in session or not session['user_id']:
        return make_response('', 403)
        
    db = sqlite3.connect('todo.db')
    cur = db.cursor()
    task = cur.execute('select title, description from tasks where id=:task_id and user_id=:user_id', {'task_id': task_id, 'user_id': session['user_id']}).fetchone()
    if task:
        return jsonify(title=task[0], description=task[1]), 200
    else:
        return make_response('', 404)
