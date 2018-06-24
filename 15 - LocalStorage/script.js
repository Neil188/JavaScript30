const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.plates');
const checkAll = document.querySelector('.checkAll');
const clearAll = document.querySelector('.clearAll');

let items = [];
let storeAllowed = true;

// get items from localStorage
try {
    items = JSON.parse(localStorage.getItem('items')) || []
} catch (e) {
    storeAllowed = false;
    console.log('LocalStorage not allowed')
};

const addItem = e => {
    e.preventDefault();
    const text = (e.target.querySelector('[name=item]')).value;
    const item = {
        text,
        done: false,
    };

    items.push(item);
    populateList(items, itemsList);
    storeAllowed && localStorage.setItem('items', JSON.stringify(items));
    e.target.reset();
}

const populateList = (plates = [], platesList) =>
    platesList.innerHTML = plates.map((plate, i) => `
        <li>
            <input type="checkbox" data-index=${i} id="item${i}" ${plate.done ? 'checked' : ''}/>
            <label for="item${i}">${plate.text}</label>
        </li>
    `).join('');

const toggleDone = e => {
    if (!e.target.matches('input')) return; // only process input elements
    const el = e.target;
    const index = el.dataset.index;
    items[index].done = !items[index].done;
    storeAllowed && localStorage.setItem('items', JSON.stringify(items));
    populateList(items, itemsList);
}

const updateAll = (checked) => {
    items.forEach(item => item.done = checked);
    storeAllowed && localStorage.setItem('items', JSON.stringify(items));
    populateList(items, itemsList);
}

addItems.addEventListener('submit', addItem);
itemsList.addEventListener('click', toggleDone);
checkAll.addEventListener('click', () => updateAll(true));
clearAll.addEventListener('click', () => updateAll(false));

// load items list (populated from localstorage)
populateList(items, itemsList);