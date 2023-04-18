# from flask import Flask, jsonify, request
# from flask_cors import CORS, cross_origin

# # import main
# import functions
# import faulthandler

# faulthandler.enable()


# app = Flask(__name__)
# CORS(
#     app,
#     resources={
#         r"/api/*": {
#             "origins": [
#                 "http://localhost:3000",
#                 "https://northstar.vercel.app",
#                 "http://127.0.0.1:3000",
#             ]
#         }
#     },
# )
# # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# # app.config["CORS_HEADERS"] = "Content-Type"


# # @app.after_request
# # def add_cors_headers(response):
# #     response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
# #     response.headers.add("Access-Control-Allow-Headers", "Content-Type")
# #     response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
# #     return response


# # @cross_origin(origin="localhost:3000", headers=["Content- Type", "Authorization"])
# @app.route("/api/difficulty", methods=["POST"])
# def get_difficulty():
#     # Load your machine learning model and call the appropriate function with the request data
#     # For example:
#     # model = load_model('path/to/your/model')
#     # result = predict_difficulty(model, request.json)

#     # For now, we'll return a dummy response
#     text = request.json.get("text")
#     if text == None:
#         return jsonify({"error": "No text found"}), 400
#     # print(text)
#     response = {"difficulty": functions.reading_difficulty(text)}
#     print(response)

#     return jsonify(response)


# @app.route("/api/window_difficulty", methods=["POST"])
# def get_sliding_window_difficulty():
#     text = request.json.get("text")
#     if text == None:
#         return jsonify({"error": "No text found"}), 400
#     response = functions.sliding_window(text)
#     print("The response is", response)
#     return jsonify(response)


# def transform_stats(stats: dict) -> list:
#     num_documents = len(stats["difficulty"])

#     transformed_stats = []
#     for i in range(num_documents):
#         transformed_stats.append(
#             {
#                 "difficulty": stats["difficulty"][i],
#                 "diversity_per_difficulty": {
#                     1: stats["diversity_per_difficulty"][i][1],
#                     2: stats["diversity_per_difficulty"][i][2],
#                     3: stats["diversity_per_difficulty"][i][3],
#                     4: stats["diversity_per_difficulty"][i][4],
#                 },
#                 "diversity_per_topic": stats["diversity_per_topic"][i],
#                 "sentiment": stats["sentiment"][i],
#                 "text": stats["text"][i],
#                 "overall_diversity": stats["overall_diversity"][i],
#             }
#         )

#     return transformed_stats


# @app.route("/api/stats", methods=["POST"])
# def get_stats():
#     texts = request.json.get("texts")
#     if not texts:
#         return jsonify({"error": "No text found"}), 400
#     stats = functions.docs_to_answer(texts)
#     # shape: {'text': [], 'difficulty': [], 'diversity_per_topic': [], 'overall_diversity': [], 'diversity_per_difficulty': [], 'sentiment': []}
#     return jsonify(transform_stats(stats))


# if __name__ == "__main__":
#     app.run(debug=True, threaded=False, processes=1)
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_cors import CORS
import functions  # import your custom functions

app = Flask(__name__)
api = Api(app)

# Enable CORS for all origins
CORS(app, resources={r"/*": {"origins": "*"}})


class Difficulty(Resource):
    def post(self):
        text = request.json.get("text")
        if text is None:
            return {"error": "No text found"}, 400
        response = {"difficulty": functions.reading_difficulty(text)}
        return jsonify(response)


class WindowDifficulty(Resource):
    def post(self):
        text = request.json.get("text")
        if text is None:
            return {"error": "No text found"}, 400
        response = functions.sliding_window(text)
        return jsonify(response)


class Stats(Resource):
    def post(self):
        texts = request.json.get("texts")
        if not texts:
            return {"error": "No text found"}, 400
        stats = functions.docs_to_answer(texts)
        # shape: {'text': [], 'difficulty': [], 'diversity_per_topic': [], 'overall_diversity': [], 'diversity_per_difficulty': [], 'sentiment': []}
        response = transform_stats(stats)
        print("Response:", response)
        return jsonify(response)


def transform_stats(stats: dict) -> list:
    num_documents = len(stats["difficulty"])

    transformed_stats = []
    for i in range(num_documents):
        transformed_stats.append(
            {
                "difficulty": stats["difficulty"][i],
                "diversity_per_difficulty": {
                    1: stats["diversity_per_difficulty"][i][1],
                    2: stats["diversity_per_difficulty"][i][2],
                    3: stats["diversity_per_difficulty"][i][3],
                    4: stats["diversity_per_difficulty"][i][4],
                },
                "diversity_per_topic": stats["diversity_per_topic"][i],
                "sentiment": stats["sentiment"][i],
                "text": stats["text"][i],
                "overall_diversity": stats["overall_diversity"][i],
            }
        )

    return transformed_stats


api.add_resource(Difficulty, "/api/difficulty")
api.add_resource(WindowDifficulty, "/api/window_difficulty")
api.add_resource(Stats, "/api/stats")

if __name__ == "__main__":
    app.run(debug=True, threaded=False, processes=1)
