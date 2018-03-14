// Get elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.fullscreen');

// Build functions
const togglePlay = () =>
    (video.paused) ? video.play() : video.pause();

const upDateButton = () => 
    toggle.textContent = (video.paused) ? '►' : '❚ ❚';

const skip = ({target}) =>
    video.currentTime += parseFloat(target.dataset.skip);

const handleRangeUpdate = ({target}) =>
    video[target.name] = target.value;

const handleProgress = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

const scrub = ({offsetX}) =>
    video.currentTime = (offsetX / progress.offsetWidth) * video.duration;

const goFullScreen = () =>
    (video.webkitRequestFullScreen === undefined) ?
        video.mozRequestFullScreen() :
        video.webkitRequestFullScreen();


// set up event listeners
video.addEventListener("click", togglePlay);
video.addEventListener("play", upDateButton);
video.addEventListener("pause", upDateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);

skipButtons.forEach( btn => btn.addEventListener("click", skip));

ranges.forEach( range => range.addEventListener("change", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => mousedown = true );
progress.addEventListener("mouseup", () => mousedown = false );

fullScreen.addEventListener("click", goFullScreen);
