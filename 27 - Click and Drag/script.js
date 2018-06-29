const slider = document.querySelector('.items');
const scale = 1;    // use to adjust how quickly the slider moves
let isDown = false;
let startX;
let scrollLeft;

// Start drag movement
const handleMouseDown = (e) => {
    isDown = true;
    slider.classList.add('active');
    // get initial click point, adjusted for slider div's position on the page
    startX = e.pageX - slider.offsetLeft;

    scrollLeft = slider.scrollLeft;
};

// stop drag motion when mouse has left the containing div
const handleMouseLeave = () => {
    isDown = false;
    slider.classList.remove('active');
};

// end drag motion
const handleMouseUp = () => {
    isDown = false;
    slider.classList.remove('active');
};

// move slider
const handleMouseMove = (e) => {
    if (!isDown) return; // stop fn from running unless mouse pressed

    e.preventDefault(); // prevent unwanted actions such as selecting text

    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * scale;    // distance travelled from initial space

    // calculate new slider position from starting point - walk value
    slider.scrollLeft = scrollLeft - walk;
};

slider.addEventListener('mousedown', handleMouseDown);
slider.addEventListener('mouseleave', handleMouseLeave);
slider.addEventListener('mouseup', handleMouseUp);
slider.addEventListener('mousemove', handleMouseMove);
