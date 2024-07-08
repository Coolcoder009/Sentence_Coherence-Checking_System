from flask import Flask, request, jsonify, render_template_string, send_from_directory
from gramformer import Gramformer
import os
import time
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
model = None
workers=50
executor = ThreadPoolExecutor(max_workers=workers)  

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

def correct_sentence(sentence):
    corrected = model.correct(sentence)
    return ' '.join(corrected)

@app.route('/correct_sentence', methods=['POST'])
def correct_sentences():
    if model is None:
        return jsonify({'error': 'Model is not loaded'})

    data = request.get_json()
    sentences = data.get('sentences', [])

    if not sentences:
        return jsonify({'error': 'No sentences provided for correction'})

    start_time = time.time()  

    futures = [executor.submit(correct_sentence, sentence) for sentence in sentences]
    corrected_sentences = [future.result() for future in futures]

    end_time = time.time()  
    time_taken = end_time - start_time  

    app.logger.info(f'Time taken to process sentences: {time_taken} seconds')

    return jsonify({'corrected_sentences': corrected_sentences, 'time_taken': time_taken})

if __name__ == '__main__':
    app.run(debug=True)
