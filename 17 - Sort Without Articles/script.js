const bands = ['The Plot in You', 'The Devil Wears Prada', 'Pierce the Veil', 'Norma Jean', 'The Bled', 'Say Anything', 'The Midway State', 'We Came as Romans', 'Counterparts', 'Oh, Sleeper', 'A Skylit Drive', 'Anywhere But Here', 'An Old Dog'];

const bandList = document.querySelector('#bands');
const sortButton = document.querySelector('#sort');

const buildList = list => {
    bandList.innerHTML = '';

    const withoutArticle = sentence =>
        sentence.replace( /^(a|an|the)\b/i,'').trim();

    const sortedBands = list.sort( (a,b) =>
        withoutArticle(a) < withoutArticle(b) ? -1 : 1 );

    sortedBands.forEach( band => {
        const listEntry = document.createElement('li');
        listEntry.textContent = band;
        bandList.appendChild(listEntry);
    })
};

const getBands = () => {
    const newList = [];
    [...bandList.children].forEach( child => newList.push(child.textContent))
    buildList(newList);
}

// resort list when button clicked
sortButton.addEventListener('click', getBands);

// Build initial list
buildList(bands);
