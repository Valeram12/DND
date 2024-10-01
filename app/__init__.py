from flask import Flask
from flask_login import LoginManager

from app.models.Users import User
from config import Config
from app.extensions import db

from flask_migrate import Migrate

migrate = Migrate()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from app.authorization import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/auth')

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.characters import bp as characters_bp
    app.register_blueprint(characters_bp, url_prefix='/characters')

    from app.bestiary import bp as bestiary_bp
    app.register_blueprint(bestiary_bp, url_prefix='/bestiary')

    return app
