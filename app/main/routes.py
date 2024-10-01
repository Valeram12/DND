from flask import request, render_template
from flask_login import current_user


from app.main import bp


@bp.route('/', methods=("POST", "GET"))
def index():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    if request.method == "GET":
        text_name = request.form.get('text_name')
        email = request.form.get('email')
        text_area = request.form.get('text_area')
    return render_template('index.html', name=name)


@bp.route("/merche")
def merche():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    return render_template("merche.html", name=name)


@bp.route("/dice")
def dice():
    if current_user.is_authenticated:
        name = current_user.username
    else:
        name = None
    return render_template("dice.html", name=name)
