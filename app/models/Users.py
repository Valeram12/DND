from flask_login import UserMixin

from app.extensions import db


class UserType(db.Model):
    id_user_type = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_type = db.Column(db.String(50), nullable=False)


class User(UserMixin, db.Model):
    id_user = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    id_user_type = db.Column(db.Integer, db.ForeignKey(
        'user_type.id_user_type'), nullable=False)
    user_type = db.relationship('UserType', backref='users')

    def get_id(self):
        return (self.id_user)