from flask import Blueprint, request, jsonify, session, redirect, make_response
import hashlib
import sqlite3 as db
import random
from string import ascii_letters, digits, punctuation

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')

salt_symbols = ascii_letters + digits + punctuation


@users_blueprint.route('/login', methods=['POST'])
def login():
    request_data = request.json
    user_login = request_data['login']
    user_password = request_data['password']
    
    if not user_login or not user_password:
        return jsonify(ok=False, error='empty_data'), 200

    db_instance = db.connect('todo.db')
    cur = db_instance.cursor()

    row = cur.execute('select id, password, salt from users where login=:login', {"login": user_login}).fetchone()
    if row:
        if hashlib.sha512(bytes(user_password + row[2], encoding='utf-8')).hexdigest() != row[1]:
            return jsonify(ok=False, error='incorrect_login_or_password'), 200
    else:
        return jsonify(ok=False, error='incorrect_login_or_password'), 200

    session['user_login'] = user_login
    session['user_id'] = row[0]
    return jsonify(ok=True), 200


@users_blueprint.route('/register', methods=['POST'])
def register():
    request_data = request.json
    user_login = request_data['login']
    user_password = request_data['password']
    
    if not user_login or not user_password:
        return jsonify(ok=False, error='empty_data'), 200

    db_instance = db.connect('todo.db')
    cur = db_instance.cursor()

    salt = ''.join(random.choice(salt_symbols) for _ in range(10))
    password = hashlib.sha512(bytes(user_password + salt, encoding='utf-8')).hexdigest()

    try:
        cur.execute('insert into users(login, password, salt) values (:login, :password, :salt)',
                    {'login': user_login, 'password': password, 'salt': salt})
        db_instance.commit()
    except db.IntegrityError:
        return jsonify(ok=False, error='user_exist'), 200

    return jsonify(ok=True), 200


@users_blueprint.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify(ok=True), 200


@users_blueprint.route('/get-user-info', methods=['GET'])
def get_user_info():
    if 'user_login' in session and session['user_login']:
        return jsonify(id=session['user_id'], login=session['user_login']), 200
    else:
        return jsonify(id=None, login=None), 200
