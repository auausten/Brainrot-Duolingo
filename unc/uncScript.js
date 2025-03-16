let gameGrid = document.getElementById("gameGrid");
let selected = [];

// Select 5 random pairs, ensuring each pair is complete
let shuffledPairs = uncPairs.sort(function () { return Math.random() - 0.5; }).slice(0, 5);

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

// Checks if the selected words match.
function checkMatch() {
    const first = selected[0];
    const second = selected[1];

    if (first.dataset.match === second.textContent) {
        // If correct, mark as matched
        first.classList.add("matched");
        second.classList.add("matched");

        // Increment the score for the matched pair
        const matchedPair = uncPairs.find(pair => pair.brainrot === first.textContent && pair.english === second.textContent);
        if (matchedPair) {
            matchedPair.score += 1;
            console.log(`Score for ${matchedPair.brainrot} - ${matchedPair.english}: ${matchedPair.score}`);

            if (matchedPair.score === 2) {
                const index = uncPairs.indexOf(matchedPair);
                uncPairs.splice(index, 1);
                console.log(`Pair ${matchedPair.brainrot} - ${matchedPair.english} removed from game.`);
            }
        }

        // Remove "selected" class from matched elements
        first.classList.remove("selected");
        second.classList.remove("selected");
    } else {
        // If incorrect, mark as wrong
        first.classList.add("wrong");
        second.classList.add("wrong");

        // Decrement the score for the mismatched pair
        const mismatchedPair = uncPairs.find(pair => pair.brainrot === first.textContent || pair.english === second.textContent);
        if (mismatchedPair) {
            mismatchedPair.score -= 1;
            console.log(`Score for ${mismatchedPair.brainrot} - ${mismatchedPair.english}: ${mismatchedPair.score}`);
        }

        // Remove wrong styling after a short delay
        setTimeout(function () {
            first.classList.remove("wrong");
            second.classList.remove("wrong");
            first.classList.remove("selected");
            second.classList.remove("selected");
        }, 500);
    }

    // Clear the selected array after checking for a match or mismatch
    selected = [];

    // Check if all words are matched
    if (document.querySelectorAll(".matched").length === 10) {
        setTimeout(resetGame, 1000); // Reset the game after a short delay
    }
}

// Resets the game, keeping the game running infinitely.
function resetGame() {
    // Clear the game grid
    gameGrid.innerHTML = "";

    // Select new words
    let newPairs = uncPairs.sort(function () { return Math.random() - 0.5; }).slice(0, 5);

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
}

// Initial game setup
resetGame();