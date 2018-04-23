const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

let countdown;
const leadingZeroes = num => num.toString().padStart(2,'0');

const timer = seconds => {
    // clear any existing timer
    clearInterval(countdown);
    timerDisplay.classList.remove('display__time-left--finished');

    const now = Date.now();
    const then = now + seconds * 1000;

    displayTimeLeft(seconds);
    displayEndTime(then);
    
    countdown = setInterval( () => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        //exit condtion
        if (secondsLeft < 0) {
            clearInterval(countdown);
            timerDisplay.classList.add('display__time-left--finished');
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);

}

const displayTimeLeft = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const adjustedSeconds = leadingZeroes(remainderSeconds);
    const adjustedMinutes = leadingZeroes(minutes % 60);
    const display = hours > 0 ? 
          `${hours}:${adjustedMinutes}:${adjustedSeconds}`
        : `${minutes}:${adjustedSeconds}`;
    timerDisplay.textContent = display;
    document.title = seconds <= 5 ? `* ${display} *` : display;
}

const displayEndTime = timestamp => {
    const end = new Date(timestamp);
    const hours = end.getHours();
    const adjustedHours = hours > 12 ? hours - 12 : hours;
    const minutes = end.getMinutes();
    const adjustedMinutes = minutes.toString().padStart(2,'0');
    const ampm = (adjustedHours===hours && hours !== 12) ? 'AM' : 'PM'
    const displayTime = `${adjustedHours}:${adjustedMinutes} ${ampm}`
    endTime.textContent = `${endTime.dataset.mess} ${displayTime}`;
}

// event handlers

const startTimer = e => 
    timer( parseInt(e.target.dataset.time) );

const handleSubmit = e => {
    e.preventDefault();
    const mins = e.target.minutes.value;
    timer(mins * 60);
    e.target.reset();
}

// event listeners
buttons.forEach( button => button.addEventListener('click', startTimer) );
document.customForm.addEventListener('submit', handleSubmit);
