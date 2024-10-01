from flask import Blueprint

bp = Blueprint("characters", __name__)

from app.characters import routes
