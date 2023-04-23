from typing import List
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_cors import CORS
import openai
import functions
import os

# TOKENIZERS_PARALLELISM=(true | false)
# TURN OFF PARLLELISM

OPENAI_API_KEY = "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"
OPEN_AI_ORG_KEY = "org-w3pzkJvfH1OVGYWqigk0JqjE"

openai.organization = OPEN_AI_ORG_KEY
openai.api_key = OPENAI_API_KEY

app = Flask(__name__)
api = Api(app)

# Enable CORS for all origins
CORS(app, resources={r"/*": {"origins": "*"}})


class Difficulty(Resource):
    def linear_transform(self, number):
        old_min = -3
        old_max = 3
        new_min = 10
        new_max = 0
        new_value = ((number - old_min) / (old_max - old_min)) * (
            new_max - new_min
        ) + new_min
        return new_value

    def post(self):
        text = request.json.get("text")
        if text is None:
            return {"error": "No text found"}, 400
        response = {"difficulty": self.linear_transform(functions.better_predict(text))}
        return jsonify(response)


class GPT(Resource):
    def query_gpt(self, prompt):
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "content": prompt,
                    "role": "assistant",
                }
            ],
        )

        return response["choices"][0]["message"]["content"]

    def post(self):
        prompt = request.json.get("prompt")
        # print("gpts prompt", prompt)
        if prompt is None:
            return {"error": "No prompt found"}, 400
        gpt_res = self.query_gpt(prompt)
        # print("gpts response", gpt_res)cd m
        return jsonify({"response": gpt_res})


class WordSense(Resource):
    def post(self):
        context, words = request.json.get("context"), request.json.get("words")
        print("THE CONTEXT IS", context)

        def get_actual_word(subword):
            actual_tokens = context.split(" ")
            for token in actual_tokens:
                if subword in token and "@" in token:
                    return token

        tokenized = functions.tokenizer4.tokenize(context.lower())
        locations = []
        offset = 0

        for idx, i in enumerate(tokenized):
            if i[0] == "@":
                offset += 1
                locations.append(
                    {
                        "location": (idx + 1) - offset,
                        "word": tokenized[(idx + 1)],
                    }
                )

        new_words = []
        print("locations god damnit", locations)
        for i in locations:
            for j in words:
                if j["word"].lower().find(i["word"].lower()) != -1:
                    new_words.append(
                        {
                            "word": get_actual_word(i["word"]),
                            "definitions": j["definitions"],
                            "location": i["location"],
                        }
                    )

        obj_list = [
            functions.MedicalWord(word["word"], word["definitions"], word["location"])
            for word in new_words
            if word["definitions"] != []
        ]
        print(
            "THE OBJECT LIST THIS IS WHAT IS OF MOST IMPORTANCE",
            [(i.word, i.definitions) for i in obj_list],
        )

        new_context = ""
        for letter in context:
            if letter != "@":
                new_context += letter
        print("new context", context)

        validated_definitions = functions.definition_validation(new_context, obj_list)
        print("The validated definitions", validated_definitions)
        return validated_definitions


class WordsDifficulty(Resource):
    # def linear_transform(self, x):
    #     input_range = 3 - (-3)
    #     output_range = 10 - 0
    #     transformed_value = (((x - (-3)) * output_range) / input_range) + 0
    #     return transformed_value
    def linear_transform(self, number):
        old_min = -3
        old_max = 3
        new_min = 10
        new_max = 0
        new_value = ((number - old_min) / (old_max - old_min)) * (
            new_max - new_min
        ) + new_min
        return new_value

    def post(self):
        words: List[int] = request.json.get("words")
        if not words:
            return {"error": "No word found"}, 400
        word_difficulties = []
        for word in words:
            difficulty = functions.better_predict(word)
            word_difficulties.append(
                {"word": word, "difficulty": self.linear_transform(float(difficulty))}
            )
        return jsonify(word_difficulties)


class GetTokens(Resource):
    def post(self):
        text = request.json.get("text")
        if text is None:
            return {"error": "No text found"}, 400
        response = functions.tokenizer4(text)
        print("Tokens:", response)
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
api.add_resource(GPT, "/api/gpt")
api.add_resource(WordsDifficulty, "/api/word_difficulty")
api.add_resource(WordSense, "/api/word_sense")
api.add_resource(GetTokens, "/api/get_tokens")

if __name__ == "__main__":
    app.run(debug=True, threaded=False, processes=1)
