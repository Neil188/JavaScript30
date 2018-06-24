const panels = document.querySelectorAll(".panel");

function toggleOpen() {
    this.classList.toggle('open');
}

// the transitionend event will trigger for every transition
// so we need to check which transition has ended
// the event properyName holds the name of the transition
// note not all browsers report this as 'flex-grow', Safari returns 'flex'
// so check to see if property name includes flex, instead of equals 'flex-grow'
function toggleActive(e) {
    e.propertyName.includes('flex') &&
    this.classList.toggle('open-active');
}

// on click toggle the open class, which grows the flex panel
panels.forEach(panel =>
    panel.addEventListener('click', toggleOpen));
// Once the grow transition finishes toggle the open-active class
// twhich causes the top and bottom text to transition in
panels.forEach(panel =>
    panel.addEventListener('transitionend', toggleActive));