// currently speech recognition only available in Firefox,
// chrome has webkitSpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
// set recognition to pick up words when spoken instead of waiting for a break
recognition.interimResults = true;
recognition.lang = 'en-GB';

// create new paragraph to put text into
let p = document.createElement('p');
const words = document.querySelector('.words');
words.appendChild(p);

// listen for 'result' event, triggered by speech recognition
recognition.addEventListener('result', ({ results }) => {
    const transcript = Array.from(results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

    // add current text to page
    p.textContent = transcript;
    // if recognition detects an end (isFinal flag set), then
    // create a new element for the next sentence
    if (results[0].isFinal) {
        p = document.createElement('p');
        words.appendChild(p);
    }
});

// when recognition recognises an end to the current sentence
// it will stop running, so we need to restart it for each 'end' event
recognition.addEventListener('end', recognition.start);

// now start listening
recognition.start();
