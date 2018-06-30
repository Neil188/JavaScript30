const controls = document.querySelectorAll('.controls input');

const debounce = (fn, wait, immediate) => {
    let timeout;
    return (e) => {
        // console.log(args)
        const later = () => {
            timeout = null;
            if (!immediate) fn(e);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) fn(e);
    }
};

const handleUpdate = debounce(({
    target,
}) => {
    const suffix = target.dataset.sizing || '';
    document.documentElement.style.setProperty(
        `--${target.name}`,
        target.value + suffix);
}, 400);

controls.forEach(control => {
    control.addEventListener('change', handleUpdate);
    control.addEventListener('mousemove', handleUpdate);
});