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

    const startTime = new Date().getTime(); 

    document.getElementById('correctionSpinner').style.display = 'block';
    document.getElementById('correctedSentenceWrapper').style.opacity = '0';

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            sendSentencesForCorrection(text.split('\n').filter(sentence => sentence.trim() !== ''), startTime);
        };
        reader.readAsText(file);
    } else {
        sendSentencesForCorrection([sentence], startTime);
    }
});

function sendSentencesForCorrection(sentences, startTime) {
    fetch('/correct_sentence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentences })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('correctionSpinner').style.display = 'none';
        const endTime = new Date().getTime(); 
        const timeTaken = (endTime - startTime) / 1000; 

        const correctedSentenceDiv = document.getElementById('correctedSentence');
        if (data.error) {
            correctedSentenceDiv.innerText = data.error;
        } else {
            correctedSentenceDiv.innerText = data.corrected_sentences.join('\n');
        }

        const correctedSentenceWrapper = document.getElementById('correctedSentenceWrapper');
        correctedSentenceWrapper.style.opacity = '1';

        alert(`Time taken to process: ${timeTaken} seconds`);
    })
    .catch(error => {
        document.getElementById('correctionSpinner').style.display = 'none';
        const correctedSentenceDiv = document.getElementById('correctedSentence');
        correctedSentenceDiv.innerText = 'Error correcting sentences';
        document.getElementById('correctedSentenceWrapper').style.opacity = '1';
    });
}
