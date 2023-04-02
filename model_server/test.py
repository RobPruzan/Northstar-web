# from flask import Flask, jsonify, request
# from flask_cors import CORS, cross_origin
# import os
# import openai


# openai.organization = "YOUR ORG KEY HERE"
# openai.api_key = "YOUR API KEY HERE"


# app = Flask(__name__)
# CORS(
#     app,
#     resources={
#         r"/api/*":
#         #  allow all
#         {"origins": "*"}
#     },
# )


# def query_chatgpt(prompt):
#     print("prompt inside of func", prompt)
#     response = openai.ChatCompletion.create(
#         model="gpt-4", messages=[{"content": prompt, "role": "assistant"}]
#     )
#     return response["choices"][0]["message"]["content"]


# @app.route("/api/test", methods=["POST"])
# def make_test():
#     text = request.json.get("text")
#     prompt = (
#         "Please provide the answer to the following text to the best of your ability, only write the answer: \n"
#         + text
#     )
#     gpt_res = query_chatgpt(prompt)
#     response = {"server_res": gpt_res}
#     print(response)
#     return response


# if __name__ == "__main__":
#     app.run(debug=True)
print("not important")
