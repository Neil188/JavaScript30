const secondHand = document.querySelector('.second-hand');
const minHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');
const clock = document.querySelector('.clock');

const getDegrees = (seconds, mins, hours) =>
    // Convert to degrees, and include 90deg shift to start at 12
    ({
        secondsDegrees: ((seconds / 60) * 360) + 90,
        minDegrees: ((mins / 60) * 360) + 90,
        hourDegrees: ((hours / 12) * 360) + 90,
    });

const updateHands = (secondsDegrees, minDegrees, hourDegrees) => {
    // Temporarily remove transition, so we avoid the
    // hands jumping (going backwards to 12 instead of
    // continuing forwards) every time they pass 12.
    if (secondsDegrees === 444) {
        clock.style.setProperty('--transition-second', 'unset');
    }
    if (minDegrees === 444) {
        clock.style.setProperty('--transition-min', 'unset');
    }
    if (hourDegrees === 444) {
        clock.style.setProperty('--transition-hour', 'unset');
    }

    clock.style.setProperty("--rotate-second", secondsDegrees);
    clock.style.setProperty("--rotate-min", minDegrees);
    clock.style.setProperty("--rotate-hour", hourDegrees);

    // Start transition again after passing 12
    if (secondsDegrees === 96) {
        clock.style.setProperty('--transition-second', '');
    }
    if (minDegrees === 96) {
        clock.style.setProperty('--transition-min', '');
    }
    if (hourDegrees === 96) {
        clock.style.setProperty('--transition-hour', '');
    }
}

const setDate = () => () => {
    const now = new Date();
    const seconds = now.getSeconds();
    const mins = now.getMinutes();
    const hours = now.getHours();

    // calculate new positions for hands
    const {
        secondsDegrees,
        minDegrees,
        hourDegrees,
    } = getDegrees(seconds, mins, hours);

    // update DOM
    updateHands(secondsDegrees, minDegrees, hourDegrees);
};

// run setDate every second
setInterval(setDate(secondHand, minHand, hourHand), 1000);
// Call immediately for first load
setDate(secondHand, minHand, hourHand)();