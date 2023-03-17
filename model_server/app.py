from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from main import reading_difficulty

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
# app.config["CORS_HEADERS"] = "Content-Type"


# @cross_origin(origin="localhost:3000", headers=["Content- Type", "Authorization"])
@app.route("/api/difficulty", methods=["POST"])
def get_difficulty():
    # Load your machine learning model and call the appropriate function with the request data
    # For example:
    # model = load_model('path/to/your/model')
    # result = predict_difficulty(model, request.json)

    # For now, we'll return a dummy response
    text = request.json.get("excerpt")
    if text == None:
        return jsonify({"error": "No text found"}), 400
    # print(text)
    response = {"difficulty": reading_difficulty(text)}
    print(response)

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
