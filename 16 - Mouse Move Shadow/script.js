const hero = document.querySelector(".hero");
const text = hero.querySelector("h1");
const walk = 400;

function shadow(e) {
    const {
        offsetWidth: width,
        offsetHeight: height,
    } = hero;
    // get x and y *within current element*
    let {
        offsetX: x,
        offsetY: y,
    } = e;

    // if target doesn't match element we are listening on
    // for nested elements we need to adjust cursor position
    if (this !== e.target) {
        // adjust x and y
        x += e.target.offsetLeft;
        y += e.target.offsetTop;
    }

    // calc distance to stretch Shadow
    const xWalk = Math.round((x / width * walk) - (walk / 2));
    const yWalk = Math.round((y / height * walk) - (walk / 2));

    // create four shadows in various directions
    text.style.textShadow =
        `
            ${xWalk}px ${yWalk}px 0 rgba(255,0,255,0.7),
            ${xWalk * -1}px ${yWalk * -1}px 0 rgba(0,255,255,0.7),
            ${yWalk}px ${xWalk}px 0 rgba(0,255,0,0.7),
            ${yWalk * -1}px ${xWalk * -1}px 0 rgba(0,0,255,0.7)
        `;
}

hero.addEventListener("mousemove", shadow);