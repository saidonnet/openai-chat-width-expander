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
}
`;
document.head.append(style);

const buttonStyle = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;  // Ensure the button is above other elements
    padding: 10px 20px;
    cursor: 'pointer';
    border: none;
    border-radius: '4px';
    box-shadow: '0 2px 5px rgba(0, 0, 0, 0.3)'; // Material Design box shadow
`;

const setIcon = (buttonId, imgPath) => {
    let img = document.createElement('img');
    img.src = chrome.runtime.getURL(imgPath);
    img.style.height = '20px';
    img.style.width = '20px';
    let button = document.getElementById(buttonId);
    button.innerHTML = '';
    button.appendChild(img);
};

// Create a new button element
let button = document.createElement('button');
button.id = 'my-floating-button';
button.style = buttonStyle;
document.body.append(button);
setIcon('my-floating-button', 'copy.svg');

// Add event listener for the click event
button.addEventListener('click', () => {
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
speechButton.style = buttonStyle;
document.body.append(speechButton);
setIcon('my-speech-button', 'play.svg');

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

// Create a new button for stopping speech
let stopButton = document.createElement('button');
stopButton.id = 'my-stop-button';
stopButton.style = buttonStyle;
document.body.append(stopButton);
setIcon('my-stop-button', 'stop.svg');

// Add event listener for the stop button click event
stopButton.addEventListener('click', () => {
    // Stop speech
    window.speechSynthesis.cancel();
    stopButton.style.display = 'none';
    speechButton.style.display = 'block';
});

// Initially hide the stop button
stopButton.style.display = 'none';
