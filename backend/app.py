from pathlib import Path

from flask import Flask, jsonify, send_from_directory

from config import Config
from extensions import cors, db
from routes.auth import auth_bp
from routes.chat import chat_bp
from routes.community import community_bp
from routes.dashboard import dashboard_bp
from routes.survey import survey_bp


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


def create_app() -> Flask:
    app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="")
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(chat_bp)
    app.register_blueprint(survey_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(community_bp)

    @app.get("/")
    @app.get("/index.html")
    @app.get("/index(1).html")
    def index():
        return send_from_directory(STATIC_DIR, "index.html")

    @app.get("/community.html")
    def community_page():
        return send_from_directory(STATIC_DIR, "community.html")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "接口或资源不存在"}), 404

    @app.errorhandler(500)
    def server_error(error):
        db.session.rollback()
        return jsonify({"error": "服务器内部错误"}), 500

    with app.app_context():
        import models  # noqa: F401

        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
