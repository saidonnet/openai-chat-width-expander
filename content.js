const style = document.createElement('style');
style.textContent = `
::-webkit-scrollbar {
    width: 1rem;
}

.flex.p-4.gap-4.text-base.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-\\[38rem\\].xl\\:max-w-3xl.md\\:py-6.lg\\:px-0.m-auto {
    max-width: unset !important;
	padding:30px 30px !important;
}
@media (min-width: 768px) {
    .flex.p-4.gap-4.text-base.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-\\[38rem\\].xl\\:max-w-3xl.md\\:py-6.lg\\:px-0.m-auto {
        max-width: unset !important;
		padding:30px 30px !important;
    }
	.md\\:max-w-3xl {
		max-width: unset !important;
		padding:30px 30px !important;
	}

}

@media (min-width: 1024px) {
    .flex.p-4.gap-4.text-base.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-\\[38rem\\].xl\\:max-w-3xl.md\\:py-6.lg\\:px-0.m-auto {
        max-width: unset !important;
		padding:30px !important;
    }
}

@media (min-width: 1280px) {
    .flex.p-4.gap-4.text-base.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-\\[38rem\\].xl\\:max-w-3xl.md\\:py-6.lg\\:px-0.m-auto {
        max-width: unset !important;
		padding:30px 30px !important;
    }
}


#my-floating-button {
    background: white;
	border-radius:10px;
	border: 1px solid blue;
    padding: 10px;
    margin-right: 10px;
}
#my-speech-button,
#my-stop-button {
	border-radius:10px;
	border: 1px solid blue;
    background: white;
    padding: 10px;
    position: fixed;
    top: 20px;
    right: 200px;
    z-index: 1000;
}
`;

document.head.append(style);

let english_dict_str = "";
let french_dict_str = "";
let arabic_dict_str = "";

let english_dict = [];
let french_dict = [];
let arabic_dict = [];

let DictionariesArePrepared = false;

async function loadDictionaries() {
    if (!DictionariesArePrepared) {
        const responseEnglish = await fetch(chrome.runtime.getURL('english_words.txt'));
        english_dict_str = await responseEnglish.text();

        const responseFrench = await fetch(chrome.runtime.getURL('french_words.txt'));
        french_dict_str = await responseFrench.text();

        const responseArabic = await fetch(chrome.runtime.getURL('arabic_words.txt'));
        arabic_dict_str = await responseArabic.text();

        english_dict = english_dict_str.split("\n");
        french_dict = french_dict_str.split("\n");
        arabic_dict = arabic_dict_str.split("\n");

        DictionariesArePrepared = true;
    }
}

async function detectLanguage(text) {
    await loadDictionaries();

    let english_count = 0;
    let french_count = 0;
    let arabic_count = 0;

    let words = text.split(/\b/);

    for (let word of words) {
        if (english_dict.includes(word)) english_count++;
        if (french_dict.includes(word)) french_count++;
        if (arabic_dict.includes(word)) arabic_count++;
    }

    if (english_count > french_count && english_count > arabic_count) {
        return 'en-US';
    } else if (french_count > english_count && french_count > arabic_count) {
        return 'fr-FR';
    } else if (arabic_count > english_count && arabic_count > french_count) {
        return 'ar-SA';
    } else {
        return 'en-US';
    }
}

const setIcon = (buttonId, imgPath) => {
    let img = document.createElement('img');
    img.src = chrome.runtime.getURL(imgPath);
    img.style.height = '20px';
    img.style.width = '20px';
    let button = document.getElementById(buttonId);
    button.innerHTML = '';
    button.appendChild(img);
};

let copyButton = document.createElement('button');
copyButton.id = 'my-floating-button';
copyButton.style.position = 'fixed';
copyButton.style.top = '20px';
copyButton.style.right = '60px';
copyButton.style.border = '1px solid blue';
copyButton.style.zIndex = '1000';
document.body.append(copyButton);
setIcon('my-floating-button', 'copy.svg');

copyButton.addEventListener('click', () => {
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');
    if (elements.length > 0) {
        let lastElement = elements[elements.length - 1];
        navigator.clipboard.writeText(lastElement.innerText).then(function () {
            Swal.fire({
				toast: true,
                title: 'Text copied to clipboard',
                showConfirmButton: false,
                timer: 1500
            });
        }).catch(function (err) {
            console.error('Failed to copy text: ', err);
        });
    }
});

let speechButton = document.createElement('button');
speechButton.id = 'my-speech-button';
speechButton.style.position = 'fixed';
speechButton.style.top = '20px';
speechButton.style.right = '20px';
speechButton.style.border = '1px solid blue';
speechButton.style.zIndex = '1000';
document.body.append(speechButton);
setIcon('my-speech-button', 'play.svg');

let stopButton = document.createElement('button');
stopButton.id = 'my-stop-button';
stopButton.style.position = 'fixed';
stopButton.style.top = '20px';
stopButton.style.right = '20px';
stopButton.style.zIndex = '1000';
stopButton.style.border = '1px solid blue';
document.body.append(stopButton);
setIcon('my-stop-button', 'stop.svg');
stopButton.style.display = 'none';

speechButton.addEventListener('click', async () => {
    let elements = document.getElementsByClassName('flex flex-grow flex-col gap-3');
    if (elements.length > 0) {
        let lastElement = elements[elements.length - 1];
        let lang = await detectLanguage(lastElement.textContent);
        let msg = new SpeechSynthesisUtterance(lastElement.textContent);
        msg.lang = lang;
        window.speechSynthesis.speak(msg);
        stopButton.style.display = 'block';
        speechButton.style.display = 'none';

        Swal.fire({
			toast: true,
            title: 'Text to speech started',
            showConfirmButton: false,
            timer: 1500
        });
    }
});

stopButton.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    stopButton.style.display = 'none';
    speechButton.style.display = 'block';

    Swal.fire({
		toast: true,
        title: 'Text to speech stopped',
        showConfirmButton: false,
        timer: 1500
    });
});
