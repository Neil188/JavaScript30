// get all the links
const triggers = document.querySelectorAll('.cool > li');
const keyboardTriggers = document.querySelectorAll('.cool > li > a');
// Get the drop down
const background = document.querySelector('.dropdownBackground');
const nav = document.querySelector('.top');
let timeout;
let lastThis = null;

function handleLeave() {
    clearTimeout(timeout);
    lastThis.classList.remove('trigger-enter', 'trigger-enter-active');
    background.classList.remove('open');
    lastThis = null;
}

function handleEnter() {
    // if we have a lastThis then call handleLeave to clear the
    // previous focus.    This happens when switching between
    // keyboard and mouse
    !!lastThis && handleLeave();

    this.classList.add('trigger-enter');
    timeout = setTimeout(() =>
        this.classList.contains('trigger-enter') &&
               this.classList.add('trigger-enter-active'), 150)
    background.classList.add('open');

    const dropdown = this.querySelector('.dropdown');
    const dropdownCoords = dropdown.getBoundingClientRect();
    const navCoords = nav.getBoundingClientRect();

    const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top - navCoords.top,
        left: dropdownCoords.left - navCoords.left,
    }

    background.style.setProperty('width', `${coords.width}px`);
    background.style.setProperty('height', `${coords.height}px`);

    background.style.setProperty(
        'transform',
        `translate(${coords.left}px, ${coords.top}px)`
    );
    lastThis = this;
}

/*
    For keyboard navigation, focus/blur will be triggered on the <a>
    elements we need to call handleEnter/handleLeave with the parent
    <li> node as 'this'
*/
function handleFocus() {
    handleEnter.call(this.parentNode);
}

function handleBlur() {
    handleLeave.call(this.parentNode);
}

// trigger on mouse enter and mouse leave on the links
triggers.forEach(trigger =>
    trigger.addEventListener('mouseenter', handleEnter));
triggers.forEach(trigger =>
    trigger.addEventListener('mouseleave', handleLeave));

// Handle keyboard navigation
keyboardTriggers.forEach(trigger =>
    trigger.addEventListener('focus', handleFocus));
keyboardTriggers.forEach(trigger =>
    trigger.addEventListener('blur', handleBlur));