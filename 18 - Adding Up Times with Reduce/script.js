// get all entries with data-time attribute
const videos = document.querySelectorAll('[data-time]');

// Get total seconds
const sumTime = (total, current) => {
    // split into seconds, mins, hours
    const timeArray = current.dataset.time.split(':').reverse();
    const currentTime = timeArray.reduce( (t,x,i) =>
        t + Number(x) * (60 ** i),0
    );
    const newTotal = total + currentTime;
    return newTotal;
}

// display calculated total time
// NOTE: assumes less than a month long!
const showTotal = (days, hrs, min, sec) => {
    const output = document.querySelector('.total span');
    const pad = x => x > 9 ? x : `0${x}`;
    const totalHours = days > 1 ? days * 24 + hrs : hrs;
    const hours = totalHours > 0 ? `${totalHours}:` : '';
    const minutes = hours > 0 ? `${pad(min)}:` : `${min}:`;
    const seconds = `${pad(sec)}`;

    output.textContent = `${hours}${minutes}${seconds}`
}

const totalSeconds = [...videos].reduce( sumTime,0);
// use Date to calculate duration
const event = new Date(0);
event.setSeconds(totalSeconds);
showTotal(event.getDate(), event.getHours(), event.getMinutes(), event.getSeconds());
