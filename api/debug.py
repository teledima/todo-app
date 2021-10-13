from flask import Blueprint, session, make_response

debug_blueprint = Blueprint('debug_blueprint', __name__, url_prefix='/debug')


@debug_blueprint.route('/clear-session')
def clear_session():
    session.clear()
    return make_response('', 200)
