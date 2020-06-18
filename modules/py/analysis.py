"""Slack messages VADER sentiment analyzer

This script allows the user to perform certain manipulate Slack data received 
as a JSON object:
1- Clean the data from URLs
2- Tokenize messages into individual sentences
3- Perform a sentiment analysis on the sentences and aggregate the results
The results are then printed as a JSON object for node to consume"""

# -*- coding: utf-8 -*-
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk import sent_tokenize
import re
import sys
import json

analyzer = SentimentIntensityAnalyzer()


def prepareSentences(text: str) -> list:
    """Gets a slack message and prepares it by removing URLS and other special
    Slack identifiers, then tokenize message into sentences.

    """
    text = re.sub(r'<(.*?)>', "", text)
    sentences = sent_tokenize(text)
    return sentences


def analyzeIncoming(data: List) -> dict:
    """Perform a VADER sentiment analysis on individual
    sentences and returns the results as a list of dictionaries

    """
    results = []

    #print("data: ", data)
    for message in data:
        vs = analyzer.polarity_scores(message)
        #   print("{:-<65} {}".format(message, str(vs)))
        message_json = {
            'sentence': message,
            'positive': vs["pos"],
            'negative': vs["neg"],
            'neutral':  vs["neu"]
        }
        results.append(message_json)
    return results


def main():
    data = json.loads(sys.argv[1])
    #print("argv[1] = ", data)
    # print(type(data))
    sentences = []
    for paragraph in data["userMessages"]:
        # print(paragraph)
        sentences += prepareSentences(paragraph)
    results = analyzeIncoming(sentences)
    print(json.dumps(results))
    #print("python done")
    sys.stdout.flush()
    return 0


if __name__ == "__main__":
    main()
