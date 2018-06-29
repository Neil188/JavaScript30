const divs = document.querySelectorAll('div');

function logText(mode) {
    return function (e) {
        console.log(`${mode} ${this.classList.value}`);
        if (mode === 'Stop') {e.stopPropagation();}
    }
}

// Bubbling mode
// run in bubbling mode (ie on the way up) - returns 3 , 2 , 1
divs.forEach(div => div.addEventListener('click', logText('Bubble')));

// Capture mode
// run in capture mode (ie on the way down) - return 1, 2, 3
// note capture runs before bubbling

// divs.forEach(div => div.addEventListener('click', logText('Capture'), {
//     capture:true
// }));


// run in bubbling mode w. stop propigation (ie on the way up) - return 3

// divs.forEach(div => div.addEventListener('click', logText('Stop')));


// run in capture mode w. stop propigation (ie on the way down) - return 1

// divs.forEach(div => div.addEventListener('click', logText('Stop'), {
//     capture:true
// }));


// run in bubbling mode (ie on the way up) once - returns 3 , 2 , 1
// then unbinds itself, equivalent of running a removeEventListener

// divs.forEach(div => div.addEventListener('click', logText('Once'), {
//     once: true
// }));
