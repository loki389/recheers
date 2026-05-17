from flask import Blueprint, jsonify, request

from auth_utils import get_current_user
from extensions import db
from models import SurveySample


survey_bp = Blueprint("survey", __name__, url_prefix="/api/survey")


REQUIRED_FIELDS = ["age", "gender", "region", "freq", "cost", "flavor", "alcohol", "tool", "ingredient"]


def as_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        return value.strip().lower() in {"true", "1", "yes", "y", "含酒精"}
    return False


@survey_bp.get("/samples")
def list_samples():
    samples = SurveySample.query.order_by(SurveySample.created_at.asc()).all()
    return jsonify({"samples": [sample.to_dict() for sample in samples]})


@survey_bp.post("/samples")
def create_sample():
    payload = request.get_json(silent=True) or {}
    missing = [field for field in REQUIRED_FIELDS if payload.get(field) in (None, "")]
    if missing:
        return jsonify({"error": f"缺少字段：{', '.join(missing)}"}), 400

    try:
        freq = float(payload["freq"])
        cost = float(payload["cost"])
    except (TypeError, ValueError):
        return jsonify({"error": "freq 和 cost 必须是数字"}), 400

    user = get_current_user()
    sample = SurveySample(
        user_id=user.id if user else None,
        age=str(payload["age"]).strip(),
        gender=str(payload["gender"]).strip(),
        region=str(payload["region"]).strip(),
        freq=freq,
        cost=cost,
        flavor=str(payload["flavor"]).strip(),
        alcohol=as_bool(payload["alcohol"]),
        tool=str(payload["tool"]).strip(),
        ingredient=str(payload["ingredient"]).strip(),
    )
    db.session.add(sample)
    db.session.commit()
    return jsonify({"sample": sample.to_dict()}), 201


@survey_bp.delete("/samples")
def delete_samples():
    SurveySample.query.delete()
    db.session.commit()
    return jsonify({"success": True})
