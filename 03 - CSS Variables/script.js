const controls = document.querySelectorAll('.controls input');

const handleUpdate = ({
    target,
}) => {
    const suffix = target.dataset.sizing || '';
    document.documentElement.style.setProperty(
        `--${target.name}`,
        target.value + suffix);
};

controls.forEach(control => {
    control.addEventListener('change', handleUpdate);
    control.addEventListener('mousemove', handleUpdate);
});