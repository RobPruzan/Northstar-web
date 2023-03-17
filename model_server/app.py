from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

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
    data = request.json
    print(data)
    response = {"difficulty": "easy", "confidence": 0.95}

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
