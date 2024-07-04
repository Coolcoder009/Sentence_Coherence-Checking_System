# Grammaraide

Grammaraide is a web application designed to correct sentences using a pre-trained grammar correction model Gramformer. This application allows users to either input a sentence directly or upload a `.txt` file containing the sentence to be corrected.

## Installation


 Clone the repository 
```bash 
git clone <repository-url>
cd <repository-directory>
```

To install the required dependencies, run the following command:

```bash
pip install -r requirements.txt
```
Running the Application
To start the application, run:
```bash
python app.py
``` 

This will start the Flask server, and the application will be accessible at http://127.0.0.1:5000.<br>
## How It Works
### Frontend
The frontend of the application is built using HTML, CSS, and JavaScript. It provides a simple user interface where users can:
Load the grammar correction model.
Enter a sentence directly into a text input field.
Upload a .txt file containing a sentence.

### Backend
The backend of the application is powered by Flask. The main components are:

### Model Loading:
When the user clicks the "Load Model" button, a request is sent to the /load_model endpoint, which initializes the grammar correction model using the Gramformer library.

### Sentence Correction:
Users can either enter a sentence directly or upload a .txt file. When the form is submitted, a request is sent to the /correct_sentence endpoint.
The backend checks if a sentence is provided. If not, it responds with an error message.
If a sentence is provided, the model corrects the sentence and returns the corrected version to the frontend.

### File Handling
The application allows only .txt files to be uploaded.
The uploaded file is read on the client-side using JavaScript's FileReader API, and the content is sent to the backend for correction.

### Example Usage
Loading the Model: Click the "Load Model" button. The application will indicate the status of the model loading process.

### Correcting a Sentence:
Direct Input: Enter a sentence in the input field and click "Correct Sentence".
File Upload: Upload a .txt file containing a sentence and click "Correct Sentence".
The corrected sentence will be displayed below the form.

### Technologies Used
<ul>
<li>Flask: A micro web framework for Python.</li>
<li>Gramformer: A library for grammatical error correction.</li>
<li>HTML/CSS: For structuring and styling the frontend.</li>
<li>JavaScript: For handling frontend logic and making AJAX requests to the backend.</li>
</ul>

### Note:
Make sure you have all the necessary dependencies installed by running the pip install -r requirements.txt command. The application is currently configured to run without GPU support for the Gramformer model.

