from flask import Blueprint

bp = Blueprint("bestiary", __name__)

from app.bestiary import routes
