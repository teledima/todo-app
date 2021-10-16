from flask import Blueprint
from api.users import users_blueprint
from api.debug import debug_blueprint
from api.tasks import tasks_blueprint

api_blueprint = Blueprint('api_blueprint', __name__, url_prefix='/api')
api_blueprint.register_blueprint(users_blueprint)
api_blueprint.register_blueprint(debug_blueprint)
api_blueprint.register_blueprint(tasks_blueprint)
