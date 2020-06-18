# -*- coding: utf-8 -*-
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk import sent_tokenize
import re
import sys
import json

analyzer = SentimentIntensityAnalyzer()


def prepareSentences(text):
    # remove URLs and other escaped hyperlinks between "< >"
    # print(text)
    text = re.sub(r'<(.*?)>', "", text)
    sentences = sent_tokenize(text)
    return sentences


def analyzeIncoming(data):
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
