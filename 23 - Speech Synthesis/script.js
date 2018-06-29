const msg = new SpeechSynthesisUtterance();
let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const options = document.querySelectorAll('[type="range"], [name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

msg.text = document.querySelector('[name="text"]').value;

// add all voices to voices dropdown
const populateVoices = e => {
    const createOption = ({ name, lang }) =>
        `<option value="${name}">${name} (${lang})</option>`
    const engVoices = voice => voice.lang.includes('en');

    voices = e.target.getVoices();
    voicesDropdown.innerHTML =
            voices
                .filter(engVoices)
                .map(createOption)
                .join('');
}

// get selected voice object
const setVoice = ({ target }) => {
    msg.voice = voices.find( voice => voice.name === target.value);
    toggle();
}

// cancel and restart speech
const toggle = (startOver = true) => {
    speechSynthesis.cancel();
    // add setTimeOut as there can be a slight delay for cancel to work
    startOver && setTimeout(() => speechSynthesis.speak(msg), 500);
}

const setOption = ({ target }) => {
    msg[target.name] = target.value;
    toggle();
}

// wait for voices to load, then populate voices list
speechSynthesis.addEventListener('voiceschanged', populateVoices);
voicesDropdown.addEventListener('change',setVoice);

options.forEach(opt => opt.addEventListener('change', setOption));

speakButton.addEventListener('click', toggle);
stopButton.addEventListener('click', () => toggle(false));