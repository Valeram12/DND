from flask import Blueprint

bp = Blueprint("authorization", __name__)

from app.authorization import routes
