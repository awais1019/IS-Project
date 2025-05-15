from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("mrm8488/bert-tiny-finetuned-fake-news-detection")
model = AutoModelForSequenceClassification.from_pretrained("mrm8488/bert-tiny-finetuned-fake-news-detection")

@app.route('/classify', methods=['POST'])
def classify():
    news_text = request.json.get('news_text', '')
    if not news_text:
        return jsonify({"error": "No news text provided"}), 400

    # Tokenize input text
    inputs = tokenizer(news_text, return_tensors="pt", padding=True, truncation=True, max_length=512)

    # Perform inference
    with torch.no_grad():
        outputs = model(**inputs)

    # Get the predicted label
    logits = outputs.logits
    predicted_class_id = torch.argmax(logits, dim=1).item()
    label = "FAKE" if predicted_class_id == 1 else "REAL"

    return jsonify({"label": label, "logits": logits.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
