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
`;
document.head.append(style);


// Create a new button element
let button = document.createElement('button');
button.textContent = 'C';
button.title = 'Copy last generated message';

// Set button styles
button.style.position = 'fixed';
button.style.top = '20px';
button.style.right = '20px';
button.style.zIndex = '1000';  // Ensure the button is above other elements
button.style.padding = '10px 20px';
button.style.fontSize = '15px';
button.style.cursor = 'pointer';

// Set additional button styles
button.style.backgroundColor = '#9c27b0'; // Violet color
button.style.border = 'none';
button.style.borderRadius = '4px';
button.style.color = 'white';
button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Material Design box shadow

// Set an id for the button
button.id = 'my-floating-button';

// Append the button to the body
document.body.append(button);

// Add event listener for the click event
button.addEventListener('click', () => {
    // Get all elements with the specified class name
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');

    // Check if there's at least one such element
    if (elements.length > 0) {
        // Get the last element
        let lastElement = elements[elements.length - 1];

        // Copy its text content to the clipboard
        navigator.clipboard.writeText(lastElement.textContent).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(err) {
            console.error('Failed to copy text: ', err);
        });
    }
});

// Create a new button for Text-to-Speech
let speechButton = document.createElement('button');
speechButton.textContent = 'S';
speechButton.title = 'Read last generated message';

// Set button styles
speechButton.style.position = 'fixed';
speechButton.style.top = '70px'; // Adjusted this line
speechButton.style.right = '20px';
speechButton.style.zIndex = '1000';  // Ensure the button is above other elements
speechButton.style.padding = '10px 20px';
speechButton.style.fontSize = '15px';
speechButton.style.cursor = 'pointer';

// Set additional button styles
speechButton.style.backgroundColor = '#9c27b0'; // Violet color
speechButton.style.border = 'none';
speechButton.style.borderRadius = '4px';
speechButton.style.color = 'white';
speechButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)'; // Material Design box shadow

// Set an id for the button
speechButton.id = 'my-speech-button';

// Append the button to the body
document.body.append(speechButton);

// Language selection dropdown
let languageDropdown = document.createElement('select');
languageDropdown.id = 'language-selection';
languageDropdown.style.position = 'fixed';
languageDropdown.style.top = '130px';
languageDropdown.style.right = '20px';
languageDropdown.style.zIndex = '1000';
let languages = ['en-US', 'fr-FR', 'ar-SA'];
for (let language of languages) {
    let option = document.createElement('option');
    option.value = language;
    option.text = language;
    languageDropdown.appendChild(option);
}
document.body.append(languageDropdown);
languageDropdown.title = 'Select language for text-to-speech';

// Create a new button for stopping speech
let stopButton = document.createElement('button');
stopButton.textContent = 'T';
stopButton.title = 'Stop reading';

// Set button styles
stopButton.style.position = 'fixed';
stopButton.style.top = '180px'; // Adjusted this line
stopButton.style.right = '20px';
stopButton.style.zIndex = '1000';
stopButton.style.padding = '10px 20px';
stopButton.style.fontSize = '15px';
stopButton.style.cursor = 'pointer';

// Set additional button styles
stopButton.style.backgroundColor = '#9c27b0';
stopButton.style.border = 'none';
stopButton.style.borderRadius = '4px';
stopButton.style.color = 'white';
stopButton.style.boxShadow = '0 2px 5px rgba(0, 0, 60, 0.3)';

// Set an id for the button
stopButton.id = 'my-stop-button';

// Hide the stop button initially
stopButton.style.display = 'none';

// Append the button to the body
document.body.append(stopButton);

// Add event listener for the speech button click event
speechButton.addEventListener('click', () => {
    // Hide the speech button and language dropdown
    speechButton.style.display = 'none';
    languageDropdown.style.display = 'none';

    // Show the stop button
    stopButton.style.display = 'block';

    // Get all elements with the specified class name
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');

    // Check if there's at least one such element
    if (elements.length > 0) {
        // Get the last element
        let lastElement = elements[elements.length - 1];

        // Use speech synthesis to speak the text content
        let msg = new SpeechSynthesisUtterance(lastElement.textContent);
        let selectedOption = languageDropdown.options[languageDropdown.selectedIndex].value;
        msg.lang = selectedOption;
        msg.onend = function (event) {
            // Speech has ended, show the speech button and language dropdown
            speechButton.style.display = 'block';
            languageDropdown.style.display = 'block';

            // Hide the stop button
            stopButton.style.display = 'none';
        }
        window.speechSynthesis.speak(msg);
    }
});

// Add event listener for the stop button click event
stopButton.addEventListener('click', () => {
    // Speech stopped, show the speech button and language dropdown
    speechButton.style.display = 'block';
    languageDropdown.style.display = 'block';

    // Hide the stop button
    stopButton.style.display = 'none';

    // Stop speech
    window.speechSynthesis.cancel();
});
