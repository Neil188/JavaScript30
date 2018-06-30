const speed = document.querySelector('.speed');
const bar = speed.querySelector('.speed-bar');
const video = document.querySelector('.flex');

const calcRate = (percent) => {
    const min = 0.4;
    const max = 4;

    return percent * (max - min) + min;
};

const calcValues = (pageY, offsetTop, offsetHeight) => {
    const y = pageY - offsetTop;
    const percent = y / offsetHeight;

    const height = Math.round(percent * 100);
    const playbackRate = calcRate(percent);
    return {
        height,
        playbackRate,
    };
};

const setBar = (height, rate) => {
    bar.style.setProperty('--height', height);
    bar.dataset.speed = `${rate.toFixed(2)}x`;
};

const setVideoRate = (rate) => {
    video.playbackRate = rate;
}

function handleMove(e) {
    const {
        height,
        playbackRate,
    } = calcValues(e.pageY, this.offsetTop, this.offsetHeight);
    setBar(height, playbackRate);
    setVideoRate(playbackRate);
};

function handleKeyPress(e) {
    if (e.keyCode !== 38 && e.keyCode !== 40) {
        return;
    }
    const heightVarProperty = bar.style.getPropertyValue('--height') || '16.3';
    let height = Math.round(Number(heightVarProperty));
    height += e.keyCode !== 38 ? -10 : 10;
    height = height < 0 ? 0 :
        height > 100 ? 100 :
            height;
    const playbackRate = calcRate(height / 100);
    setBar(height, playbackRate);
    setVideoRate(playbackRate);

};

speed.addEventListener('mousemove', handleMove);
speed.addEventListener('keydown', handleKeyPress);