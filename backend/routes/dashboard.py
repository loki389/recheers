from collections import Counter, defaultdict

from flask import Blueprint, jsonify

from models import SurveySample


dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


def rows(counter: Counter, limit: int | None = None) -> list[list]:
    data = [[name, count] for name, count in counter.most_common(limit)]
    return data


def build_metrics() -> dict:
    samples = SurveySample.query.order_by(SurveySample.created_at.asc()).all()
    total = len(samples)
    if total == 0:
        return {
            "total": 0,
            "avgCost": 0,
            "avgFreq": 0,
            "alcoholPct": 0,
            "regions": [],
            "genders": [],
            "ages": [],
            "flavors": [],
            "tools": [],
            "ingredients": [],
            "trend": [],
        }

    region_counts = Counter(sample.region for sample in samples)
    gender_counts = Counter(sample.gender for sample in samples)
    age_counts = Counter(sample.age for sample in samples)
    flavor_counts = Counter(sample.flavor for sample in samples)
    tool_counts = Counter(sample.tool for sample in samples)
    ingredient_counts = Counter(sample.ingredient for sample in samples)
    trend_counts = defaultdict(int)
    for sample in samples:
        trend_counts[sample.created_at.strftime("%Y-%m")] += 1

    return {
        "total": total,
        "avgCost": round(sum(sample.cost for sample in samples) / total, 2),
        "avgFreq": round(sum(sample.freq for sample in samples) / total, 2),
        "alcoholPct": round(sum(1 for sample in samples if sample.alcohol) / total * 100, 2),
        "regions": rows(region_counts),
        "genders": rows(gender_counts),
        "ages": rows(age_counts),
        "flavors": rows(flavor_counts),
        "tools": rows(tool_counts),
        "ingredients": rows(ingredient_counts, 10),
        "trend": [[month, trend_counts[month]] for month in sorted(trend_counts)],
    }


@dashboard_bp.get("/dashboard/metrics")
def dashboard_metrics():
    return jsonify(build_metrics())


@dashboard_bp.get("/metrics")
def legacy_metrics():
    return jsonify(build_metrics())
