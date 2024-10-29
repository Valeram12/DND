from flask import request, flash, redirect, url_for, render_template
from flask_login import login_user, login_required, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from app.authorization import bp
from app.models.Users import *


@bp.route('/login.html', methods=("POST", "GET"))
def login():
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            flash('Логін або пароль введено невірно')
            return redirect(url_for('authorization.login'))
        login_user(user)
        return redirect(url_for("characters.charlist"))

    return render_template('auth.html')


@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('authorization.login'))


@bp.route("/registration.html", methods=("POST", "GET"))
def registration():
    if request.method == "POST":
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password != confirm_password:
            print("Паролі не збігаються")
        else:
            try:
                hash = generate_password_hash(password)
                new_user = User(username=request.form['username'], email=request.form['email'],
                                password=hash, id_user_type=1)
                db.session.add(new_user)
                db.session.flush()
                db.session.commit()
                return redirect(url_for("authorization.login"))
            except Exception as e:
                db.session.rollback()
                print("Помилка додавання в БД:", e)
    return render_template("registration.html")
