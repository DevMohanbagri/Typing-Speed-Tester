from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

sample_texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Python is a versatile programming language used for web development.",
    "Typing fast and accurately can improve productivity.",
    "Flask is a lightweight web framework for Python."
]

@app.route('/')
def index():
    text = random.choice(sample_texts)
    return render_template('index.html', text=text)

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    if not data or 'original_text' not in data or 'typed_text' not in data or 'time_taken' not in data:
        return jsonify({'wpm': 0, 'accuracy': 0})

    original_text = data['original_text'].strip()
    typed_text = data['typed_text'].strip()
    time_taken = max(data['time_taken'] / 1000, 0.01)

    words = typed_text.split()
    word_count = len(words)
    minutes = time_taken / 60
    wpm = round(word_count / minutes) if minutes > 0 else 0

    original_words = original_text.split()
    typed_words = typed_text.split()
    correct_words = sum(1 for o, t in zip(original_words, typed_words) if o == t and len(original_words) == len(typed_words))
    accuracy = round((correct_words / len(original_words)) * 100) if original_words else 0

    print(f"Debug - WPM: {wpm}, Accuracy: {accuracy}, Time: {time_taken}, Words: {word_count}")
    return jsonify({'wpm': wpm, 'accuracy': accuracy})

if __name__ == '__main__':
    app.run(debug=True)
