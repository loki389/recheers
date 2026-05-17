from datetime import datetime, timedelta
from secrets import token_urlsafe

from flask import Blueprint, current_app, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from auth_utils import create_token
from extensions import db
from models import SMSCode, User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def json_payload() -> dict:
    return request.get_json(silent=True) or {}


def auth_response(user: User):
    return jsonify({"user": user.to_dict(), "token": create_token(user)})


@auth_bp.post("/register")
def register():
    payload = json_payload()
    name = str(payload.get("name") or "").strip()
    phone = str(payload.get("phone") or "").strip()
    password = str(payload.get("password") or "")

    if not name:
        return jsonify({"error": "name 不能为空"}), 400
    if not password:
        return jsonify({"error": "password 不能为空"}), 400
    if User.query.filter_by(name=name).first():
        return jsonify({"error": "该账号已注册"}), 409
    if phone and User.query.filter_by(phone=phone).first():
        return jsonify({"error": "该手机号已注册"}), 409

    user = User(name=name, phone=phone or None, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return auth_response(user), 201


@auth_bp.post("/login")
def login():
    payload = json_payload()
    name = str(payload.get("name") or "").strip()
    password = str(payload.get("password") or "")
    if not name or not password:
        return jsonify({"error": "用户名和密码不能为空"}), 400

    user = User.query.filter_by(name=name).order_by(User.id.asc()).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "用户名或密码错误"}), 401
    return auth_response(user)


@auth_bp.post("/logout")
def logout():
    return jsonify({"success": True})


@auth_bp.post("/sms/send")
def send_sms():
    payload = json_payload()
    phone = str(payload.get("phone") or "").strip()
    if not phone:
        return jsonify({"error": "phone 不能为空"}), 400

    code = current_app.config.get("SMS_DEV_CODE", "123456")
    sms = SMSCode(
        phone=phone,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        used=False,
    )
    db.session.add(sms)
    db.session.commit()

    response = {"message": "验证码已发送"}
    if current_app.config.get("RETURN_SMS_DEV_CODE", True):
        response["devCode"] = code
    return jsonify(response)


@auth_bp.post("/sms/login")
def sms_login():
    payload = json_payload()
    phone = str(payload.get("phone") or "").strip()
    code = str(payload.get("code") or "").strip()
    if not phone or not code:
        return jsonify({"error": "phone 和 code 不能为空"}), 400

    dev_code = current_app.config.get("SMS_DEV_CODE", "123456")
    latest = (
        SMSCode.query.filter_by(phone=phone, used=False)
        .order_by(SMSCode.created_at.desc())
        .first()
    )
    valid_by_record = latest and latest.code == code and (latest.expires_at is None or latest.expires_at >= datetime.utcnow())
    if code != dev_code and not valid_by_record:
        return jsonify({"error": "验证码错误或已过期"}), 401

    if latest:
        latest.used = True

    user = User.query.filter_by(phone=phone).first()
    if not user:
        suffix = phone[-7:] if len(phone) >= 7 else phone
        user = User(
            name=f"用户{suffix}",
            phone=phone,
            password_hash=generate_password_hash(token_urlsafe(16)),
        )
        db.session.add(user)

    db.session.commit()
    return auth_response(user)
