const triggers = document.querySelectorAll('a');
const highlight = document.createElement('span');

highlight.classList.add('highlight');
highlight.classList.add('highlight-hide');
document.body.append(highlight);

let highlightLink = e => {
    highlightLink = ({ target }) => {
        // get target size
        const linkCoords = target.getBoundingClientRect();
        const coords = {
            width: linkCoords.width,
            height: linkCoords.height,
            top: linkCoords.top + window.scrollY,
            left: linkCoords.left + window.scrollX,
        };
        // update highlight to target size
        highlight.style.width = `${coords.width}px`;
        highlight.style.height = `${coords.height}px`;
        // move to target location
        highlight.style.transform =
            `translate(${coords.left}px, ${coords.top}px)`;
    };
    // for first call highlightLink is redefined, so need to recall
    highlightLink(e);
    // when first called remove the highlight-hide class
    highlight.classList.remove('highlight-hide');
};

triggers.forEach(a => a.addEventListener('mouseenter', highlightLink));
