let gameGrid = document.getElementById("gameGrid");
let selected = [];
let wrongWords = [];
let recurringWords = [];
let correctWords = [];

// Select 5 random pairs, ensuring each pair is complete
let shuffledPairs = pairs.sort(function () { return Math.random() - 0.5; }).slice(0, 5);

// Create separate lists for Brainrot and English words
let brainrotWords = [];
let englishWords = [];

shuffledPairs.forEach(function (pair) {
    brainrotWords.push({ text: pair.brainrot, match: pair.english });
    englishWords.push({ text: pair.english, match: pair.brainrot });
});

// Shuffle each column separately
brainrotWords = brainrotWords.sort(function () { return Math.random() - 0.5; });
englishWords = englishWords.sort(function () { return Math.random() - 0.5; });

// Create two columns
const brainrotColumn = document.createElement("div");
brainrotColumn.classList.add("column");
const englishColumn = document.createElement("div");
englishColumn.classList.add("column");

// Populate Brainrot column
brainrotWords.forEach(function (word) {
    const div = document.createElement("div");
    div.classList.add("word");
    div.textContent = word.text;
    div.dataset.match = word.match;
    div.addEventListener("click", function () { selectWord(div); });
    brainrotColumn.appendChild(div);
});

// Populate English column
englishWords.forEach(function (word) {
    const div = document.createElement("div");
    div.classList.add("word");
    div.textContent = word.text;
    div.dataset.match = word.match;
    div.addEventListener("click", function () { selectWord(div); });
    englishColumn.appendChild(div);
});

// Add columns to the game grid
gameGrid.appendChild(brainrotColumn);
gameGrid.appendChild(englishColumn);

// Handles the selection of a word.
// If two words are selected, checks for a match.
function selectWord(element) {
    // If the word is already selected, unselect it
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        selected = selected.filter(function (item) { return item !== element; });
        return;
    }

    // Prevent selecting more than two words
    if (selected.length < 2) {
        selected.push(element);
        element.classList.add("selected");
    }

    // If two words are selected, check for a match
    if (selected.length === 2) {
        checkMatch();
    }
}

//Checks if the selected words match.
function checkMatch() {
    const first = selected[0];
    const second = selected[1];

    if (first.dataset.match === second.textContent) {
        // If correct, mark as matched
        first.classList.add("matched");
        second.classList.add("matched");
        correctWords.push({ brainrot: first.textContent, english: second.textContent });
    } else {
        // If incorrect, mark as wrong and track wrong words
        first.classList.add("wrong");
        second.classList.add("wrong");
        wrongWords.push({ brainrot: first.textContent, english: second.textContent });

        // Remove wrong styling after a short delay
        setTimeout(function () {
            first.classList.remove("wrong");
            second.classList.remove("wrong");
            first.classList.remove("selected");
            second.classList.remove("selected");
        }, 500);
    }

    // Reset selected words
    selected = [];

    // Check if all words are matched to reset the game
    if (document.querySelectorAll(".matched").length === 10) {
        setTimeout(resetGame, 1000);
    }
}

// Resets the game, preserving incorrect words for additional learning.
function resetGame() {
    // Clear the game grid
    gameGrid.innerHTML = "";

    // Select new words while keeping incorrect ones for another attempt
    let newPairs = pairs.sort(function () { return Math.random() - 0.5; }).slice(0, 5 - wrongWords.length);
    
    wrongWords.forEach(function (word) {
        const pair = pairs.find(function (pair) {
            return pair.brainrot === word.brainrot || pair.english === word.english;
        });

        if (pair && !newPairs.includes(pair)) {
            newPairs.push(pair);
            recurringWords.push({ ...pair, roundsLeft: 2 });
        }
    });

    // Add recurring words from previous rounds
    recurringWords = recurringWords.filter(word => word.roundsLeft > 0);
    recurringWords.forEach(function (word) {
        if (!newPairs.includes(word)) {
            newPairs.push(word);
            word.roundsLeft--;
        }
    });

    // Reset incorrect words list
    wrongWords = [];

    // Rebuild word lists
    brainrotWords = [];
    englishWords = [];

    newPairs.forEach(function (pair) {
        brainrotWords.push({ text: pair.brainrot, match: pair.english });
        englishWords.push({ text: pair.english, match: pair.brainrot });
    });

    // Shuffle words again for the new round
    brainrotWords = brainrotWords.sort(function () { return Math.random() - 0.5; });
    englishWords = englishWords.sort(function () { return Math.random() - 0.5; });

    // Recreate columns
    const brainrotColumn = document.createElement("div");
    brainrotColumn.classList.add("column");
    const englishColumn = document.createElement("div");
    englishColumn.classList.add("column");

    // Populate Brainrot column
    brainrotWords.forEach(function (word) {
        const div = document.createElement("div");
        div.classList.add("word");
        div.textContent = word.text;
        div.dataset.match = word.match;
        div.addEventListener("click", function () { selectWord(div); });
        brainrotColumn.appendChild(div);
    });

    // Populate English column
    englishWords.forEach(function (word) {
        const div = document.createElement("div");
        div.classList.add("word");
        div.textContent = word.text;
        div.dataset.match = word.match;
        div.addEventListener("click", function () { selectWord(div); });
        englishColumn.appendChild(div);
    });

    // Add new columns to the game grid
    gameGrid.appendChild(brainrotColumn);
    gameGrid.appendChild(englishColumn);

    // Check if the user has completed the module
    if (correctWords.length === pairs.length) {
        window.location.href = "homepage.html";
    }
}