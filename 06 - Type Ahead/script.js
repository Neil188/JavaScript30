const endpoint =
'https://gist.githubusercontent.com/Neil188/ebfdd373e5ee99bc63ef3be9f5017f81/raw/3dc0cfe30dc9f0aec0b5b5affe07b8bc11107f72/UKCities.txt';

const cities = [];

// search for string anywhere within object
const findMatches = (wordToMatch, cities) => {
    const regex = new RegExp(wordToMatch, "gi");
    const match = place => {
        let found = false;
        // match any property of object
        Object.getOwnPropertyNames(place)
            .forEach(x => place[x].match(regex) ? found = true : null)
        return found;
    }
    return cities.filter(match);
};

const numWithCommas = x =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const dispMatches = (arr=[], regex="", highlight="") => {
    const html = arr.map(place => {
        // highlight search term in city or region
        // note population not highlighted as it breaks numwithcommas
        const cityName = place.city.replace(regex, highlight);
        const regionName = place.region.replace(regex, highlight);
        return `
            <li>
                <span class="name">${cityName}, ${regionName}</span>
                <span class="population">${numWithCommas(place.population)}</span>
            </li>
            `
    }).join('');
    suggestions.innerHTML = html;
};

const filterMatches = e => {
    const search = e.target.value;
    const matchArray = findMatches(search, cities);
    const regex = new RegExp(search, "gi");
    const highlight = `<span class="hl">${search}</span>`;
    dispMatches(matchArray, regex, highlight);
};

const searchInput = document.querySelector(".search");
const suggestions = document.querySelector(".suggestions");

// whenever search input changes rebuild list
// note the change event only fires when you leave the input
searchInput.addEventListener("change", filterMatches);
searchInput.addEventListener("keyup", filterMatches);

// fetch data
fetch(endpoint)
    .then(blob => blob.json())
    .then(data => cities.push(...data))
    .then(_ => dispMatches(cities));
