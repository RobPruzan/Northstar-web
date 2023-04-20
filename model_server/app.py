from typing import List
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_cors import CORS
import openai
import functions
import os


OPENAI_API_KEY = "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"
OPEN_AI_ORG_KEY = "org-w3pzkJvfH1OVGYWqigk0JqjE"

openai.organization = OPEN_AI_ORG_KEY
openai.api_key = OPENAI_API_KEY

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


class GPT(Resource):
    def query_gpt(prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "content": prompt,
                    "role": "You are an expert medical document simplifier",
                }
            ],
        )

        return response["choices"][0]["message"]["content"]

    def post(self):
        prompt = request.json.get("prompt")
        if prompt is None:
            return {"error": "No prompt found"}, 400
        return self.query_gpt(prompt)


class WordsDifficulty(Resource):
    def translate(x: int):
        return -(x * 1.786 + 6.4) + 10

    def post(self):
        words: List[int] = request.json.get("words")
        if not words:
            return {"error": "No word found"}, 400
        word_difficulties = []
        for word in words:
            difficulty = functions.get_level(word)
            word_difficulties.append({"word": word, "difficulty": difficulty})
        return self.translate(word_difficulties)


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
api.add_resource(GPT, "/api/gpt")
api.add_resource(WordDifficulty, "api/word_difficulty")

if __name__ == "__main__":
    app.run(debug=True, threaded=False, processes=1)
