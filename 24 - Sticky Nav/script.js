const nav = document.querySelector('#main');
const navOffsetHeight = nav.offsetHeight;
let topOfNav = nav.offsetTop;

// find top of nav bar
const setTop = () => topOfNav = nav.offsetTop;

// on scroll check if navbar should be fixed
const fixNav = () => {
    // passed top of nav?
    if (window.scrollY >= topOfNav) {
        document.documentElement.style.setProperty('--padding-top', navOffsetHeight);
        document.body.classList.add('fixed-nav');
    } else {
        document.body.classList.remove('fixed-nav');
        document.documentElement.style.setProperty('--padding-top', 0);
    }
};

window.addEventListener('scroll', fixNav);
window.addEventListener('resize', setTop);