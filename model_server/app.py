from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

# import main
import functions
import faulthandler

faulthandler.enable()


app = Flask(__name__)
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:3000",
                "https://northstar.vercel.app",
                "http://127.0.0.1:3000",
            ]
        }
    },
)
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# app.config["CORS_HEADERS"] = "Content-Type"


# @app.after_request
# def add_cors_headers(response):
#     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
#     response.headers.add("Access-Control-Allow-Headers", "Content-Type")
#     response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
#     return response


# @cross_origin(origin="localhost:3000", headers=["Content- Type", "Authorization"])
@app.route("/api/difficulty", methods=["POST"])
def get_difficulty():
    # Load your machine learning model and call the appropriate function with the request data
    # For example:
    # model = load_model('path/to/your/model')
    # result = predict_difficulty(model, request.json)

    # For now, we'll return a dummy response
    text = request.json.get("text")
    if text == None:
        return jsonify({"error": "No text found"}), 400
    # print(text)
    response = {"difficulty": functions.reading_difficulty(text)}
    print(response)

    return jsonify(response)


@app.route("/api/window_difficulty", methods=["POST"])
def get_sliding_window_difficulty():
    text = request.json.get("text")
    if text == None:
        return jsonify({"error": "No text found"}), 400
    response = functions.sliding_window(text)
    print("The response is", response)
    return jsonify(response)


@app.route("/api/stats", methods=["POST"])
def get_stats():
    texts = request.json.get("texts")
    if not texts:
        return jsonify({"error": "No text found"}), 400
    stats = functions.docs_to_answer(texts)
    # shape: {'text': [], 'difficulty': [], 'diversity_per_topic': [], 'overall_diversity': [], 'diversity_per_difficulty': [], 'sentiment': []}
    return jsonify(stats)


if __name__ == "__main__":
    app.run(debug=True, threaded=False, processes=1)
