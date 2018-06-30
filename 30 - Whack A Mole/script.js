const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const title = document.querySelector('h1');
const moles = document.querySelectorAll('.mole');
const table = document.querySelector('.topscores');
let lastHole;
let timeUp = false;
let score = 0;
let topScores;

const getTopScores = () => {
    const scores = JSON.parse(localStorage.getItem('top-scores'));
    return (scores) || [];
}

const storeTopScores = (scores) =>
    localStorage.setItem('top-scores', JSON.stringify(scores));

const randTime = (min, max) =>
    Math.round(Math.random() * (max - min) + min);

const randHole = allHoles => {
    const idx = Math.floor(Math.random() * allHoles.length);
    const hole = allHoles[idx];
    if (hole === lastHole) {
        return randHole(allHoles);
    }
    lastHole = hole;
    return hole;
};

const displayMole = () => {
    const time = randTime(200, 1000);
    const hole = randHole(holes);
    hole.classList.add('up');
    setTimeout(() => {
        hole.classList.remove('up');
        !timeUp && requestAnimationFrame(displayMole);
    }, time);

};

const refreshTopScores = (scores) => {
    const newTableBody = document.createElement("tbody");
    const old = table.querySelector("tbody")
    scores.forEach(x => {
        const row = document.createElement("tr");
        const name = document.createElement("td");
        const nameContent = document.createTextNode(x.name);
        name.appendChild(nameContent);
        const topScore = document.createElement("td");
        const topScoreContent = document.createTextNode(x.score);
        topScore.appendChild(topScoreContent);
        row.appendChild(name);
        row.appendChild(topScore);
        newTableBody.appendChild(row);
    });
    table.replaceChild(newTableBody, old);

}

const newTopScores = (topTen, current, name) =>
    [
        ...topTen,
        {
            name,
            score: current,
        },
    ]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

const endGame = () => {
    timeUp = true;
    title.classList.add('end');
    if (score > 0 &&
        (topScores.length < 10 || topScores[9].score < score)) {
        const name = prompt('New Top score!    Enter name:') || 'Anonymous'
        topScores = newTopScores(topScores, score, name);
        storeTopScores(topScores);
        refreshTopScores(topScores);
    } else {
        scoreBoard.classList.add('fail');
    }
}

const startGame = () => {
    score = 0;
    scoreBoard.textContent = 0;
    timeUp = false;
    displayMole();
    setTimeout(endGame, 10000);
};

const handleClick = e => {
    if (!e.isTrusted) return;
    !timeUp && score++;
    scoreBoard.textContent = score;
    e.target.parentElement.classList.remove('up');
}

const removeEnd = () => {
    title.classList.remove('end');
    scoreBoard.classList.remove('fail');
}

moles.forEach(mole =>
    mole.addEventListener('click', handleClick));
title.addEventListener('transitionend', removeEnd);
topScores = getTopScores();
refreshTopScores(topScores);