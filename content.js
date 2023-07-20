const style = document.createElement('style');
style.textContent = `
::-webkit-scrollbar {
    width: 1rem;
}
@media (min-width: 1280px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}

@media (min-width: 1024px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}

@media (min-width: 768px) {
    * {
        max-width: unset !important;
        overflow: auto !important;
    }
}

#my-floating-button,
#my-speech-button,
#my-stop-button {
    background: white;
    padding: 10px;
    margin-right: 10px;
}
#lang-selector {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
`;
document.head.append(style);

const setIcon = (buttonId, imgPath) => {
    let img = document.createElement('img');
    img.src = chrome.runtime.getURL(imgPath);
    img.style.height = '20px';
    img.style.width = '20px';
    let button = document.getElementById(buttonId);
    button.innerHTML = '';
    button.appendChild(img);
};

// Create a new button element for copying text
let copyButton = document.createElement('button');
copyButton.id = 'my-floating-button';
copyButton.style.position = 'fixed';
copyButton.style.top = '20px';
copyButton.style.right = '250px';
copyButton.style.zIndex = '1000';
document.body.append(copyButton);
setIcon('my-floating-button', 'copy.svg');

// Add event listener for the click event
copyButton.addEventListener('click', () => {
    // Get all elements with the specified class name
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');

    // Check if there's at least one such element
    if (elements.length > 0) {
        // Get the last element
        let lastElement = elements[elements.length - 1];

        // Copy its text content to the clipboard
        navigator.clipboard.writeText(lastElement.textContent).then(function () {
            console.log('Text copied to clipboard');
        }).catch(function (err) {
            console.error('Failed to copy text: ', err);
        });
    }
});

// Create a new button for Text-to-Speech
let speechButton = document.createElement('button');
speechButton.id = 'my-speech-button';
speechButton.style.position = 'fixed';
speechButton.style.top = '20px';
speechButton.style.right = '200px';
speechButton.style.zIndex = '1000';
document.body.append(speechButton);
setIcon('my-speech-button', 'play.svg');

// Create a new button for stopping speech
let stopButton = document.createElement('button');
stopButton.id = 'my-stop-button';
stopButton.style.position = 'fixed';
stopButton.style.top = '20px';
stopButton.style.right = '200px';
stopButton.style.zIndex = '1000';
document.body.append(stopButton);
setIcon('my-stop-button', 'stop.svg');

// Initially hide the stop button
stopButton.style.display = 'none';

// Add event listener for the speech button click event
speechButton.addEventListener('click', () => {
    // Get all elements with the specified class name
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');

    // Check if there's at least one such element
    if (elements.length > 0) {
        // Get the last element
        let lastElement = elements[elements.length - 1];

        // Use speech synthesis to speak the text content
        let lang = dropdown.value;
        let msg = new SpeechSynthesisUtterance(lastElement.textContent);
        msg.lang = lang;
        window.speechSynthesis.speak(msg);
        stopButton.style.display = 'block';
        speechButton.style.display = 'none';
    }
});

// Add event listener for the stop button click event
stopButton.addEventListener('click', () => {
    // Stop speech
    window.speechSynthesis.cancel();
    stopButton.style.display = 'none';
    speechButton.style.display = 'block';
});

// Create a language selection dropdown
let dropdown = document.createElement('select');
dropdown.id = 'lang-selector';
let option1 = document.createElement('option');
option1.text = 'English';
option1.value = 'en-US';
dropdown.add(option1);

let option2 = document.createElement('option');
option2.text = 'French';
option2.value = 'fr-FR';
dropdown.add(option2);

let option3 = document.createElement('option');
option3.text = 'Arabic';
option3.value = 'ar-SA';
dropdown.add(option3);

document.body.append(dropdown);
