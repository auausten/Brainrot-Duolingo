let words = [];
pairs.forEach(pair => {
    words.push({ text: pair.brainrot, match: pair.english });
    words.push({ text: pair.english, match: pair.brainrot });
});
words = words.sort(() => Math.random() - 0.5);

const gameGrid = document.getElementById("gameGrid");
let selected = [];

words.forEach(word => {
    const div = document.createElement("div");
    div.classList.add("word");
    div.textContent = word.text;
    div.dataset.match = word.match;
    div.addEventListener("click", () => selectWord(div));
    gameGrid.appendChild(div);
});

function selectWord(element) {
    if (selected.length < 2 && !selected.includes(element)) {
        selected.push(element);
        element.classList.add("selected");
    }
    if (selected.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = selected;
    if (first.dataset.match === second.textContent) {
        first.classList.add("matched");
        second.classList.add("matched");
    } else {
        first.classList.add("wrong");
        second.classList.add("wrong");
        setTimeout(() => {
            first.classList.remove("wrong");
            second.classList.remove("wrong");
        }, 500);
    }
    selected = [];
}