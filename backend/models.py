import json
from datetime import datetime

from extensions import db


def iso(dt: datetime | None) -> str | None:
    return dt.isoformat(timespec="seconds") if dt else None


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, index=True)
    phone = db.Column(db.String(32), nullable=True, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone or "",
        }


class SurveySample(db.Model):
    __tablename__ = "survey_samples"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    age = db.Column(db.String(32), nullable=False)
    gender = db.Column(db.String(32), nullable=False)
    region = db.Column(db.String(64), nullable=False)
    freq = db.Column(db.Float, nullable=False, default=0)
    cost = db.Column(db.Float, nullable=False, default=0)
    flavor = db.Column(db.String(64), nullable=False)
    alcohol = db.Column(db.Boolean, nullable=False, default=True)
    tool = db.Column(db.String(64), nullable=False)
    ingredient = db.Column(db.String(80), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "age": self.age,
            "gender": self.gender,
            "region": self.region,
            "freq": self.freq,
            "cost": self.cost,
            "flavor": self.flavor,
            "alcohol": bool(self.alcohol),
            "tool": self.tool,
            "ingredient": self.ingredient,
            "createdAt": iso(self.created_at),
        }


class CommunityPost(db.Model):
    __tablename__ = "community_posts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(160), nullable=False)
    body = db.Column(db.Text, nullable=False)
    tags = db.Column(db.Text, nullable=False, default="[]")
    recipe = db.Column(db.String(255), nullable=False, default="清爽 · 低度 · 易复刻")
    heat = db.Column(db.String(32), nullable=False, default="0")
    copies = db.Column(db.String(32), nullable=False, default="0")
    likes = db.Column(db.String(32), nullable=False, default="0")
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = db.relationship("User", lazy="joined")

    @property
    def tag_list(self) -> list[str]:
        try:
            value = json.loads(self.tags or "[]")
            return value if isinstance(value, list) else []
        except json.JSONDecodeError:
            return [tag.strip() for tag in self.tags.split(",") if tag.strip()]

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "author": self.user.name if self.user else "匿名用户",
            "badge": "创作者",
            "bio": "分享自调酒配方与复刻心得",
            "title": self.title,
            "body": self.body,
            "recipe": self.recipe,
            "heat": self.heat,
            "copies": self.copies,
            "likes": self.likes,
            "replies": [],
            "tags": self.tag_list,
            "createdAt": iso(self.created_at),
        }


class SMSCode(db.Model):
    __tablename__ = "sms_codes"

    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(32), nullable=False, index=True)
    code = db.Column(db.String(12), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=True)
    used = db.Column(db.Boolean, nullable=False, default=False)
