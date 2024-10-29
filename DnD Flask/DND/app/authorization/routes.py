
from flask import request, jsonify, session
from flask_login import login_user, login_required, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from app.authorization import bp
from app.models.Users import User
from app import db


@bp.route('/api/login', methods=["POST"])
def login():
    data = request.json  # очікуємо JSON на вхід
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 409

    session['id_user'] = user.id_user

    login_user(user)
    return jsonify({"username": user.username}), 200


@bp.route('/api/logout', methods=["POST"])
def logout():
    session.pop('id_user');
    return jsonify({"message": "Logout successful"}), 200


@bp.route("/api/registration", methods=["POST"])
def registration():
    data = request.json

    user_exists = User.query.filter_by(email=data['email']).first() is not None
    if user_exists:
        return jsonify({"error": "User with same email already exists"}), 409

    try:
        hash = generate_password_hash(data['password'])
        new_user = User(username=data['username'], email=data['email'], password=hash, id_user_type=1)
        db.session.add(new_user)
        db.session.flush()
        db.session.commit()
        session["user_id"] = new_user.id_user

        return jsonify(
            {"username": new_user.username}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@bp.route("/api/@me", methods=["GET"])
def get_user():
    user_id = session.get('id_user')
    if user_id is None:
        return jsonify({"error": "User not found"}), 401

    user = User.query.filter_by(id_user=user_id).first()

    return jsonify({"username": user.username}), 200
