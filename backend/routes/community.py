import json

from flask import Blueprint, jsonify, request

from auth_utils import login_required
from extensions import db
from models import CommunityPost


community_bp = Blueprint("community", __name__, url_prefix="/api/community")


@community_bp.get("/posts")
def list_posts():
    posts = CommunityPost.query.order_by(CommunityPost.created_at.desc()).all()
    return jsonify({"posts": [post.to_dict() for post in posts]})


@community_bp.post("/posts")
@login_required
def create_post(user):
    payload = request.get_json(silent=True) or {}
    title = str(payload.get("title") or "").strip()
    body = str(payload.get("body") or "").strip()
    tags = payload.get("tags") or []
    if not title:
        return jsonify({"error": "title 不能为空"}), 400
    if not body:
        return jsonify({"error": "body 不能为空"}), 400
    if not isinstance(tags, list):
        return jsonify({"error": "tags 必须是数组"}), 400

    clean_tags = [str(tag).strip() for tag in tags if str(tag).strip()]
    recipe = " · ".join(clean_tags[:3]) if clean_tags else "清爽 · 低度 · 易复刻"
    post = CommunityPost(
        user_id=user.id,
        title=title,
        body=body,
        tags=json.dumps(clean_tags, ensure_ascii=False),
        recipe=recipe,
        heat="0",
        copies="0",
        likes="0",
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({"post": post.to_dict()}), 201
