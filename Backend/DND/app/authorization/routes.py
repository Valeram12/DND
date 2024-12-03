
from flask import request, jsonify, session
from flask_login import login_user, login_required, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.authorization import bp
from app.models.Users import User
from app import db


@bp.route('/api/login', methods=["POST"])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 409

    access_token = create_access_token(identity=str(user.id_user))
    return jsonify({"access_token": access_token, "username": user.username}), 200


@bp.route('/api/logout', methods=["POST"])
@jwt_required()
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
        db.session.commit()
        
        return jsonify({
            "username": new_user.username,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@bp.route("/api/@me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()  # Отримуємо user_id як рядок
    user = User.query.filter_by(id_user=user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"username": user.username}), 200