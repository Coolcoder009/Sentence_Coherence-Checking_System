document.getElementById('loadModelBtn').addEventListener('click', function() {
    document.getElementById('loadingSpinner').style.display = 'block';
    fetch('/load_model')
        .then(response => response.json())
        .then(data => {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('modelStatus').innerText = data.status;
            if (data.status === 'Model loaded') {
                document.getElementById('sentenceForm').style.display = 'block';
            }
        })
        .catch(error => {
            document.getElementById('loadingSpinner').style.display = 'none';
            document.getElementById('modelStatus').innerText = 'Error loading model';
        });
});

document.getElementById('sentenceForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const sentence = document.getElementById('inputSentence').value;
    const fileInput = document.getElementById('textfile');
    const file = fileInput.files[0];

    if (!sentence && !file) {
        alert('Please enter a sentence or upload a text file.');
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            sendSentenceForCorrection(text);
        };
        reader.readAsText(file);
    } else {
        sendSentenceForCorrection(sentence);
    }
});

function sendSentenceForCorrection(sentence) {
    fetch('/correct_sentence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence })
    })
    .then(response => response.json())
    .then(data => {
        const correctedSentenceDiv = document.getElementById('correctedSentence');
        if (data.error) {
            correctedSentenceDiv.innerText = data.error;
        } else {
            correctedSentenceDiv.innerText = data.corrected_sentence.join(' ');
        }
        correctedSentenceDiv.style.display = 'block';
    })
    .catch(error => {
        document.getElementById('correctedSentence').innerText = 'Error correcting sentence';
        document.getElementById('correctedSentence').style.display = 'block';
    });
}
