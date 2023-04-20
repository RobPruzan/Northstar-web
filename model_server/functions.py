import pandas as pd
from collections import Counter
from typing import List, Tuple, Dict
from bertopic import BERTopic
from bertopic.representation import KeyBERTInspired
from bertopic.vectorizers import ClassTfidfTransformer
from hdbscan import HDBSCAN
from nltk.tokenize import sent_tokenize, word_tokenize
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import CountVectorizer
from umap import UMAP
import nltk
from nltk.corpus import stopwords
import string
import csv
import string
import json
import sys
import logging
import argparse
from transformers import (
    DistilBertTokenizer,
    BertForSequenceClassification,
    AutoTokenizer,
)
from typing import List
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from nltk.tokenize import sent_tokenize
from nltk.sentiment import SentimentIntensityAnalyzer
import torch
import gensim.downloader as api
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import nltk
import numpy as np
import pandas as pd
import seaborn as sns
import torch
import torch.nn.functional as F
from nltk.corpus import stopwords
from nltk.corpus import wordnet as wn
from nltk.tokenize import word_tokenize
from sklearn.metrics.pairwise import cosine_similarity
from transformers import DistilBertTokenizer
from transformers import pipeline
from transformers import BertTokenizer
from transformers import AutoTokenizer, BertForSequenceClassification

topic_model = BERTopic.load("colab_topic_model")
# with open("colab_topic_model", "rb") as f:
#     topic_model = pickle.load(f)

nltk.download("stopwords")

tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
device = torch.device("cuda" if torch.cuda.is_available else "cpu")
import pickle
import io

nltk.download("vader_lexicon")

logger = logging.getLogger(__name__)
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(name)s -   %(message)s",
    datefmt="%m/%d/%Y %H:%M:%S",
    level=logging.INFO,
)
tokenizer4 = AutoTokenizer.from_pretrained("kanishka/GlossBERT")


class CPU_Unpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "torch.storage" and name == "_load_from_bytes":
            return lambda b: torch.load(io.BytesIO(b), map_location="cpu")
        else:
            return super().find_class(module, name)


# loading model
# PATH = "./pytorchBERTmodel"
# PATH = "../ml_models/pytorchBERTmodel"
model = torch.load("pytorchBERTmodel", map_location=torch.device("cpu"))
model.eval()


def calculate_ngram_freqs(
    documents: List[Tuple[str, str]], n: int
) -> Tuple[Dict[str, Dict[str, int]], Dict[str, int]]:
    """
    Calculates the frequency of each n-gram for each category from a corpra of documents.

    Returns a dictionary where the keys are the categories and the values are
    dictionaries that map n-grams to their frequency.
    """
    ngram_freqs = {}
    category_frequencies = {}
    for text, category in documents:
        if category not in ngram_freqs:
            ngram_freqs[category] = Counter()

        words = text.split()
        for i in range(len(words) - n + 1):
            ngram = " ".join(words[i : i + n])
            ngram_freqs[category][ngram] += 1
            category_frequencies[category] = category_frequencies.get(category, 0) + 1

    return ngram_freqs, category_frequencies


def weigh_ngram_freqs(
    ngram_freqs: Dict[str, Dict[str, int]], word_counts: Dict[str, int]
) -> Dict[str, Dict[str, float]]:
    """
    Weighs the resulting ngrams frequencies by how many words were procssed in the previous step

    Returns a dictionary with the same structure as the input, but with
    frequency values replaced by weighted frequency values.
    """
    weighted_freqs = {}
    for category, freqs in ngram_freqs.items():
        weighted_freqs[category] = {}
        word_count = word_counts[category]
        for ngram, freq in freqs.items():
            weighted_freqs[category][ngram] = freq / word_count

    return weighted_freqs


def find_most_common_category(
    weighted_freqs: Dict[str, Dict[str, float]]
) -> Dict[str, set]:
    """
    Given a dictionary of weighted n-gram frequencies for each category,
    it finds the category each ngram occures most frequently in

    Returns a dictionary where the keys are categories and the values are sets
    of n-grams where each n-gram occurs most frequently for the category.
    """

    ngram_category_map = {category: set() for category in weighted_freqs}
    for category, freqs in weighted_freqs.items():
        for ngram, freq in freqs.items():
            has_evaluated_ngram = False
            for word_set in ngram_category_map:
                if ngram in word_set:
                    has_evaluated_word = True

            if not has_evaluated_ngram:
                DEFAULT_MOST_FREQUENT_CATEGORY_FOR_NGRAM = {
                    "category": category,
                    "frequency": freq,
                }
                most_frequeny_category_for_ngram = (
                    DEFAULT_MOST_FREQUENT_CATEGORY_FOR_NGRAM
                )

                for comp_category, ngram_freqs in weighted_freqs.items():
                    if (
                        ngram_freqs.get(ngram, 0)
                        > most_frequeny_category_for_ngram["frequency"]
                    ):
                        most_frequeny_category_for_ngram["category"] = comp_category
                        most_frequeny_category_for_ngram["frequency"] = ngram_freqs[
                            ngram
                        ]
                ngram_category_map[most_frequeny_category_for_ngram["category"]].add(
                    ngram
                )
    return ngram_category_map


def remove_stopwords(text):
    stop_words = set(stopwords.words("english"))
    words = text.split()
    filtered_words = [word for word in words if word.lower() not in stop_words]
    return " ".join(filtered_words)


def get_topic_number(text):
    topics = topic_model.find_topics(text, top_n=1)
    return topics[0][0]


def get_representative_topic_words(text):
    """
    Gets the words which represent the topic of the word
    Args:
      text: A string to predict topic for
    Returns:
      The predicted words which represent the topic of the word
    """
    topic_number = get_topic_number(text)
    topics = topic_model.get_topic(topic_number), topic_number
    topic_names = ",".join([topic for topic, freq in topics[0]][:4])
    return topic_names


def mtld(tokens, threshold=0.72):
    ttr, factor_count, word_count = 1.0, 1, len(tokens)
    stack = []
    for token in tokens:
        stack.append(token)
        ttr = len(set(stack)) / len(stack)
        if ttr < threshold:
            stack = []
            factor_count += 1
    mtld_score = word_count / factor_count
    reversed_tokens = list(reversed(tokens))
    ttr, factor_count, word_count = 1.0, 1, len(reversed_tokens)
    stack = []
    for token in reversed_tokens:
        stack.append(token)
        ttr = len(set(stack)) / len(stack)
        if ttr < threshold:
            stack = []
            factor_count += 1
    reversed_mtld_score = word_count / factor_count
    return (mtld_score + reversed_mtld_score) / 2


def mattr(tokens, window_size):
    ttrs = []
    for i in range(len(tokens) - window_size + 1):
        window = tokens[i : i + window_size]
        ttr = len(set(window)) / window_size
        ttrs.append(ttr)
    mattr_score = sum(ttrs) / len(ttrs)
    return mattr_score


# https://github.com/jennafrens/lexical_diversity/blob/master/lexical_diversity.py


# Global trandform for removing punctuation from words
remove_punctuation = str.maketrans("", "", string.punctuation)

# HD-D internals


# x! = x(x-1)(x-2)...(1)
def factorial(x):
    if x <= 1:
        return 1
    else:
        return x * factorial(x - 1)


# n choose r = n(n-1)(n-2)...(n-r+1)/(r!)
def combination(n, r):
    r_fact = factorial(r)
    numerator = 1.0
    num = n - r + 1.0
    while num < n + 1.0:
        numerator *= num
        num += 1.0
    return numerator / r_fact


# hypergeometric probability: the probability that an n-trial hypergeometric experiment results
#  in exactly x successes, when the population consists of N items, k of which are classified as successes.
#  (here, population = N, population_successes = k, sample = n, sample_successes = x)
#  h(x; N, n, k) = [ kCx ] * [ N-kCn-x ] / [ NCn ]
def hypergeometric(population, population_successes, sample, sample_successes):
    return (
        combination(population_successes, sample_successes)
        * combination(population - population_successes, sample - sample_successes)
    ) / combination(population, sample)


# HD-D implementation
def hdd(word_array, sample_size=42.0):
    if isinstance(word_array, str):
        raise ValueError(
            "Input should be a list of strings, rather than a string. Try using string.split()"
        )
    if len(word_array) < 50:
        raise ValueError("Input word list should be at least 50 in length")

    # Create a dictionary of counts for each type
    type_counts = {}
    for token in word_array:
        token = token.translate(
            remove_punctuation
        ).lower()  # trim punctuation, make lowercase
        if token in type_counts:
            type_counts[token] += 1.0
        else:
            type_counts[token] = 1.0
    # Sum the contribution of each token - "If the sample size is 42, the mean contribution of any given
    #  type is 1/42 multiplied by the percentage of combinations in which the type would be found." (McCarthy & Jarvis 2010)
    hdd_value = 0.0
    for token_type in type_counts.keys():
        contribution = (
            1.0
            - hypergeometric(len(word_array), sample_size, type_counts[token_type], 0.0)
        ) / sample_size
        hdd_value += contribution

    return hdd_value


def get_level(word):
    with open("balanced_synonym_data.json") as f:
        word = word.strip(" ")
        data = json.loads(f.read())
        level = 0

        for k, v in data.items():
            if word in v:
                level = k
        if level == 0:
            return -4
        return level


def sliding_window(text):
    words = word_tokenize(text)
    improved_window = []
    step = 3
    for idx, text in enumerate(words):
        if idx % step == 0:
            if idx <= len(words) - 26:
                x = " ".join(words[idx : idx + 25])
                throw_away = []
                score = 0
                for idx, i in enumerate(range(idx, idx + 25)):
                    if idx == 0:
                        # what the hell
                        better_prediction = -(predict(x).item() * 1.786 + 6.4) + 10
                        score = better_prediction

                        throw_away.append((better_prediction, i))
                    else:
                        throw_away.append((score, i))

                improved_window.append(throw_away)
    average_scores = {k: 0 for k in range(len(words) - 1)}
    total_windows = {k: 0 for k in range(len(words) - 1)}
    for idx, i in enumerate(improved_window):
        for score, idx in i:
            average_scores[idx] += score
            total_windows[idx] += 1

    for k, v in total_windows.items():
        if v != 0 and average_scores[k] != 0:
            average_scores[k] /= v

    inter_scores = list(filter(lambda x: x != 0, [v for v in average_scores.values()]))

    copy_list = inter_scores.copy()

    while len(inter_scores) <= len(words) - 1:
        inter_scores.append(copy_list[-1])

    x = list(range(len(inter_scores)))
    y = inter_scores

    # shaded_areas = generate_patches(x, y, 0.42)

    mapd = []
    maxy = max(inter_scores)
    miny = min(inter_scores)
    spread = maxy - miny

    for idx, i in enumerate(words):
        mapd.append((i, (inter_scores[idx] - miny) / spread))
    # mapd.append(("", 0))

    return {
        "original": text,
        "interpretation": mapd,
        "raw_scores": inter_scores,
        "tokens": words,
    }


def text_to_diversity_per_difficulty(text, diversity_fn):
    score_map = {1: [], 2: [], 3: [], 4: []}
    diversity_map = {1: 0, 2: 0, 3: 0, 4: 0}

    def clamp(score):
        if score <= 2.5:
            return 1
        if score <= 5:
            return 2
        if score <= 7.5:
            return 3
        if score <= 10.5:
            return 4
        else:
            return 0

    sliding_window_result = sliding_window(text)

    for idx, score in enumerate(sliding_window_result["raw_scores"]):
        if idx < len(sliding_window_result["tokens"]):
            score_map[clamp(score)] += [sliding_window_result["tokens"][idx] + " "]

    for score, words in score_map.items():
        words_joined = " ".join(words)
        diversity_map[score] = diversity_fn(words_joined)
    return diversity_map


def text_to_diversity_per_topic(text, diversity_function, n):
    word_tokenized_text = word_tokenize(text)
    split_by_n_tokenized_text = []
    temp_words = []
    for idx, word in enumerate(word_tokenized_text):
        if idx % n == 0 and idx != 0:
            split_by_n_tokenized_text.append(" ".join(temp_words))
            temp_words = []
        else:
            temp_words.append(word)

    window_to_sentence = {}
    for idx, i in enumerate(split_by_n_tokenized_text):
        topic_for_sentence = get_representative_topic_words(i)
        window_to_sentence[topic_for_sentence] = {
            *window_to_sentence.get(topic_for_sentence, {}),
            idx,
        }
    diversity = {}
    total_diversity_scores = 0
    # calculate the diversity for each group
    for topic, sentence_indexes in window_to_sentence.items():
        bag_of_words = " ".join(
            [split_by_n_tokenized_text[idx] for idx in sentence_indexes]
        )
        diversity_score = diversity_function(bag_of_words)
        diversity[topic] = diversity_score
        total_diversity_scores += diversity_score

    return diversity, total_diversity_scores / len(diversity)


def ttr(text):
    tokens = word_tokenize(text)
    tokens_len = len(tokens)
    if tokens_len > 0:
        return len(set(tokens)) / tokens_len
    else:
        return 1


def predict(text, tokenizer=tokenizer):
    model.eval()
    model.to("cpu")

    def prepare_data(text, tokenizer):
        input_ids = []
        attention_masks = []

        encoded_text = tokenizer.encode_plus(
            text,
            truncation=True,
            add_special_tokens=True,
            max_length=315,
            pad_to_max_length=True,
            return_attention_mask=True,
            return_tensors="pt",
        )

        input_ids.append(encoded_text["input_ids"])
        attention_masks.append(encoded_text["attention_mask"])

        input_ids = torch.cat(input_ids, dim=0)
        attention_masks = torch.cat(attention_masks, dim=0)
        return {"input_ids": input_ids, "attention_masks": attention_masks}

    tokenized_example_text = prepare_data(text, tokenizer)
    with torch.no_grad():
        result = model(
            tokenized_example_text["input_ids"].to("cpu"),
            attention_mask=tokenized_example_text["attention_masks"].to("cpu"),
            return_dict=True,
        ).logits

    return result


def better_predict(text):
    return predict(text).item()


def docs_to_answer(docs: List[str]):
    # create empty data dictionary
    data = {
        "text": [],
        "difficulty": [],
        "diversity_per_topic": [],
        "overall_diversity": [],
        "diversity_per_difficulty": [],
        "sentiment": [],
    }
    # iterate over documents and calculate statistics
    for doc in docs:
        # get text, difficulty, and diversity scores
        text = doc
        difficulty = better_predict(text)
        diversity_per_topic, overall_diversity = text_to_diversity_per_topic(
            text, mtld, 5
        )

        diversity_per_difficulty = text_to_diversity_per_difficulty(text, mtld)

        # calculate sentiment score
        sentences = sent_tokenize(text)
        sia = SentimentIntensityAnalyzer()
        sentiment_score = sum(
            [sia.polarity_scores(s)["compound"] for s in sentences]
        ) / len(sentences)

        # add scores to data dictionary
        data["text"].append(text)
        data["difficulty"].append(difficulty)
        data["diversity_per_topic"].append(diversity_per_topic)
        data["overall_diversity"].append(overall_diversity)

        data["diversity_per_difficulty"].append(diversity_per_difficulty)

        data["sentiment"].append(sentiment_score)

    return data


class MedicalWord:
    def __init__(self, word, definitions: List[str], location):
        self.word = word
        self.definitions = definitions
        self.location = location


def construct_context_gloss_pairs(context, word: MedicalWord):
    target_start_id = word.location
    target_end_id = word.location + 1
    """
    construct context gloss pairs like sent_cls_ws
    :param context: str, a sentence
    :param target_start_id: int
    :param target_end_id: int
    :param definition: array of dicts, where the dict has a key
    :return: candidate lists
    """

    sent = tokenizer4.tokenize(context)
    assert (
        0 <= target_start_id
        and target_start_id < target_end_id
        and target_end_id <= len(sent)
    )
    target = " ".join(sent[target_start_id:target_end_id])
    if len(sent) > target_end_id:
        sent = (
            sent[:target_start_id]
            + ['"']
            + sent[target_start_id:target_end_id]
            + ['"']
            + sent[target_end_id:]
        )
    else:
        sent = (
            sent[:target_start_id] + ['"'] + sent[target_start_id:target_end_id] + ['"']
        )

    sent = " ".join(sent)

    candidate = []
    # syns = wn.synsets(target)
    definitions = word.definitions

    for definition in definitions:
        if target == definition.word:
            continue
        # because we are getting the definition, definition word == target word
        gloss = (definition, target)
        candidate.append((sent, f"{target} : {gloss}", target, gloss))

    assert (
        len(candidate) != 0
    ), f'there is no candidate sense of "{target}" in WordNet, please check'

    return candidate


class InputFeatures(object):
    """A single set of features of data."""

    def __init__(self, input_ids, input_mask, segment_ids):
        self.input_ids = input_ids
        self.input_mask = input_mask
        self.segment_ids = segment_ids


def convert_to_features(candidate, tokenizer3, max_seq_length=512):
    candidate_results = []
    features = []
    for item in candidate:
        text_a = item[0]  # sentence
        text_b = item[1]  # gloss
        candidate_results.append((item[-2], item[-1]))  # (target, gloss)

        tokens_a = tokenizer3.tokenize(text_a)
        tokens_b = tokenizer3.tokenize(text_b)
        _truncate_seq_pair(tokens_a, tokens_b, max_seq_length - 3)
        tokens = ["[CLS]"] + tokens_a + ["[SEP]"]
        segment_ids = [0] * len(tokens)
        tokens += tokens_b + ["[SEP]"]
        segment_ids += [1] * (len(tokens_b) + 1)

        input_ids = tokenizer3.convert_tokens_to_ids(tokens)

        # The mask has 1 for real tokens and 0 for padding tokens. Only real
        # tokens are attended to.
        input_mask = [1] * len(input_ids)

        # Zero-pad up to the sequence length.
        padding = [0] * (max_seq_length - len(input_ids))
        input_ids += padding
        input_mask += padding
        segment_ids += padding

        assert len(input_ids) == max_seq_length
        assert len(input_mask) == max_seq_length
        assert len(segment_ids) == max_seq_length

        features.append(
            InputFeatures(
                input_ids=input_ids, input_mask=input_mask, segment_ids=segment_ids
            )
        )

    return features, candidate_results


class Definition:
    def __init__(self, definition, id):
        self.definition = definition
        self.id = id


class MedicalWord:
    def __init__(self, word, definitions: List[Definition], location):
        self.word = word
        self.definitions = definitions
        self.location = location


def _truncate_seq_pair(tokens_a, tokens_b, max_length):
    """Truncates a sequence pair in place to the maximum length."""

    # This is a simple heuristic which will always truncate the longer sequence
    # one token at a time. This makes more sense than truncating an equal percent
    # of tokens from each, since if one sequence is very short then each token
    # that's truncated likely contains more information than a longer sequence.
    while True:
        total_length = len(tokens_a) + len(tokens_b)
        if total_length <= max_length:
            break
        if len(tokens_a) > len(tokens_b):
            tokens_a.pop()
        else:
            tokens_b.pop()


def infer(context, word: MedicalWord, args):
    target_start_id = word.location
    target_end_id = word.location + 1

    sent = tokenizer4.tokenize(context)
    assert (
        0 <= target_start_id
        and target_start_id < target_end_id
        and target_end_id <= len(sent)
    )
    target = " ".join(sent[target_start_id:target_end_id])

    device = torch.device(
        "cuda" if torch.cuda.is_available() and not args.no_cuda else "cpu"
    )

    label_list = ["0", "1"]
    num_labels = len(label_list)

    model = BertForSequenceClassification.from_pretrained(
        args.bert_model, num_labels=num_labels
    )
    model.to(device)

    examples = construct_context_gloss_pairs(context, word)
    eval_features, candidate_results = convert_to_features(examples, tokenizer4)
    input_ids = torch.tensor([f.input_ids for f in eval_features], dtype=torch.long)
    input_mask = torch.tensor([f.input_mask for f in eval_features], dtype=torch.long)
    segment_ids = torch.tensor([f.segment_ids for f in eval_features], dtype=torch.long)

    model.eval()
    input_ids = input_ids.to(device)
    input_mask = input_mask.to(device)
    segment_ids = segment_ids.to(device)
    with torch.no_grad():
        logits = model(
            input_ids=input_ids,
            token_type_ids=segment_ids,
            attention_mask=input_mask,
            labels=None,
        ).logits
    logits_ = F.softmax(logits, dim=-1)
    logits_ = logits_.detach().cpu().numpy()
    output = np.argmax(logits_, axis=0)[1]
    results = []
    for idx, i in enumerate(logits_):
        results.append((candidate_results[idx][1], i[1] * 100))
    sorted_results = sorted(results, key=lambda x: x[1], reverse=True)

    return sorted_results


def definition_validation(context: str, words: List[MedicalWord]):
    # definitions will be an an

    tokens = tokenizer4.tokenize(context)
    parser = argparse.ArgumentParser()
    parser.add_argument("--bert_model", default="kanishka/GlossBERT", type=str)
    parser.add_argument(
        "--no_cuda",
        default=False,
        action="store_true",
        help="Whether not to use CUDA when available",
    )
    args, unknown = parser.parse_known_args()
