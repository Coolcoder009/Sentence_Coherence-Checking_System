from flask import Flask, request, jsonify, render_template_string, send_from_directory
from gramformer import Gramformer
import os

app = Flask(__name__)
model = None

@app.route('/')
def index():
    with open("index.html") as f:
        return render_template_string(f.read())

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory('.', path)

@app.route('/load_model', methods=['GET'])
def load_model():
    global model
    try:
        model = Gramformer(models=1, use_gpu=False)
        return jsonify({'status': 'Model loaded'})
    except Exception as e:
        return jsonify({'status': 'Failed to load model', 'error': str(e)})


@app.route('/correct_sentence', methods=['POST'])
def correct_sentence():
    if model is None:
        return jsonify({'error': 'Model is not loaded'})
    
    data = request.get_json()
    sentence = data.get('sentence', '')

    if not sentence:
        return jsonify({'error': 'No sentence provided for correction'})

    corrected_sentence = model.correct(sentence)    
    corrected_sentence_list = list(corrected_sentence)
    return jsonify({'corrected_sentence': corrected_sentence_list})



if __name__ == '__main__':
    app.run(debug=True)
