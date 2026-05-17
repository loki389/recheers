import requests
from flask import Blueprint, current_app, jsonify, request


chat_bp = Blueprint("chat", __name__, url_prefix="/api")


ASSISTANT_SYSTEM_PROMPT = (
    "你是“酒别重逢——非遗与 AI 时代的共享经济新范式”网站的自调酒助手。"
    "请用中文回答，聚焦家庭自调酒、低门槛工具替代、配方比例、低酒精和无酒精饮品、"
    "非遗基酒搭配、健康提示与理性饮酒。建议要可操作，避免鼓励过量饮酒。"
)


@chat_bp.post("/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    api_key = current_app.config.get("DEEPSEEK_API_KEY")
    if not api_key:
        return jsonify({"error": "未配置 DEEPSEEK_API_KEY，请在 .env 中填写 DeepSeek API Key 后重试。"}), 503

    messages = payload.get("messages") or []
    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "messages 不能为空"}), 400

    requested_model = payload.get("model") or current_app.config.get("DEEPSEEK_MODEL", "deepseek-chat")
    model = requested_model if requested_model in {"deepseek-chat", "deepseek-reasoner"} else current_app.config["DEEPSEEK_MODEL"]
    temperature = payload.get("temperature", 0.7)

    outbound = {
        "model": model,
        "messages": [{"role": "system", "content": ASSISTANT_SYSTEM_PROMPT}, *messages],
        "temperature": temperature,
    }
    url = current_app.config["DEEPSEEK_BASE_URL"].rstrip("/") + "/chat/completions"

    try:
        response = requests.post(
            url,
            json=outbound,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )
        data = response.json()
    except requests.RequestException as exc:
        return jsonify({"error": f"DeepSeek 请求失败：{exc}"}), 502
    except ValueError:
        return jsonify({"error": "DeepSeek 返回了非 JSON 响应"}), 502

    if response.status_code >= 400:
        return jsonify({"error": data.get("error", {}).get("message") or data.get("message") or "DeepSeek API 调用失败"}), response.status_code

    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return jsonify({"choices": [{"message": {"content": content}}]})
