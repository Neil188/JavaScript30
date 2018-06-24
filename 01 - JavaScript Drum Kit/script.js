const keys = [...document.querySelectorAll('.key')];

const removePlaying = e => {
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
};

const playSound = (audio, key) => {
    if (!audio) return;  // no audio defined for key

    audio.currentTime = 0;  // reset current playing time (for multi keystrokes)
    audio.play();  // play sound

    key.classList.add('playing');
}

// find an audio event that matches the keystroke
const getKeySound = e => {
    const audio = document.querySelector(`audio[data-key='${e.keyCode}']`);
    const key = document.querySelector(`.key[data-key='${e.keyCode}']`);

    playSound(audio, key);
};

// find an audio event that matches the button clicked
const getClickSound = (e) => {
    const keyCode = e.target.dataset.key
                 || e.target.parentNode.dataset.key
                 || undefined;

    const audio = document.querySelector(`audio[data-key='${keyCode}']`);
    const key = document.querySelector(`.key[data-key='${keyCode}']`);

    playSound(audio, key);
};

window.addEventListener('keydown', getKeySound);
// add event listeners for clicking on object (also includes space/return when
// focus is on button).
keys.forEach(key => key.addEventListener('click', getClickSound));
// on transition end (when 'playing' animation ends) remove the playing class
keys.forEach(key => key.addEventListener('transitionend',removePlaying));
