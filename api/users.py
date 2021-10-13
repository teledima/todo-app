from flask import Blueprint, request, jsonify, session, redirect
import hashlib
import sqlite3 as db
import random
from string import ascii_letters, digits, punctuation

users_blueprint = Blueprint('users_blueprint', __name__, url_prefix='/users')

salt_symbols = ascii_letters + digits + punctuation

# pass:fdfsf
@users_blueprint.route('/login', methods=['POST'])
def login():
    request_data = request.json
    user_login = request_data['login']
    user_password = request_data['password']

    db_instance = db.connect('todo.db')
    cur = db_instance.cursor()

    row = cur.execute('select password, salt from users where login=:login', {"login": user_login}).fetchone()
    if row:
        if hashlib.sha512(bytes(user_password + row[1], encoding='utf-8')).hexdigest() != row[0]:
            return jsonify(ok=False, error='incorrect_login_or_password'), 200
    else:
        return jsonify(ok=False, error='incorrect_login_or_password'), 200

    session['user_login'] = user_login
    return redirect('/')


@users_blueprint.route('/register', methods=['POST'])
def register():
    request_data = request.json
    user_login = request_data['login']
    user_password = request_data['password']

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
