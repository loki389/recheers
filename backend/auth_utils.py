from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import current_app, jsonify, request

from models import User


def create_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "name": user.name,
        "exp": datetime.utcnow() + timedelta(hours=current_app.config["JWT_EXPIRES_HOURS"]),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def bearer_token() -> str | None:
    header = request.headers.get("Authorization", "")
    if not header.lower().startswith("bearer "):
        return None
    return header.split(" ", 1)[1].strip()


def get_current_user() -> User | None:
    token = bearer_token()
    if not token:
        return None
    try:
        payload = jwt.decode(token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"])
        return User.query.get(int(payload["sub"]))
    except Exception:
        return None


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "请先登录"}), 401
        return fn(user, *args, **kwargs)

    return wrapper
