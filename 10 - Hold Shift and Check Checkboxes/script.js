let lastChecked;
let checkedOrUnchecked;
const checkBoxes = document.querySelectorAll(".inbox input[type='checkbox']");

const handleCheck = e => {
    let inBetween = false;
    checkedOrUnchecked = e.target.checked;
    // if (e.shiftKey && e.target.checked) {
    if (e.shiftKey) {
        checkBoxes.forEach(
            box => {
                if (box === e.target || box === lastChecked) {
                    inBetween = !inBetween;
                }
                if (inBetween) {
                    box.checked = checkedOrUnchecked;
                }
            }

        );
    }
    lastChecked = e.target;
}

checkBoxes.forEach(box => box.addEventListener("click", handleCheck));