let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "red", "purple", "green"];
let started = false;
let level = 0;

const h2 = document.querySelector('h2'); // Reference to the level display element
const btnElements = document.querySelectorAll('.btn'); // Select all buttons

// Listen for keypress to start the game
document.addEventListener("keypress", function () {
    if (!started) {
        console.log("game is started");
        started = true;
        levelUp();
    }
});

// Function to flash a button
function btnFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 1000); // Flash lasts for 1 second
}

// Function to handle the user's click on a button
function handleUserClick(color) {
    userSeq.push(color);
    let clickedBtn = document.querySelector(`.${color}`);
    btnFlash(clickedBtn);

    checkUserSequence();
}

// Function to check the user's sequence
function checkUserSequence() {
    // Check if user's sequence matches game sequence so far
    for (let i = 0; i < userSeq.length; i++) {
        if (userSeq[i] !== gameSeq[i]) {
            // Incorrect sequence
            gameOver();
            return;
        }
    }

    // If user has matched the full sequence
    if (userSeq.length === gameSeq.length) {
        userSeq = []; // Reset user sequence
        setTimeout(() => {
            levelUp(); // Go to the next level after a correct sequence
        }, 1000);
    }
}

// Game over function to reset the game
function gameOver() {
    h2.innerText = "Game Over! Press any key to restart";
    gameSeq = []; // Reset the game sequence
    userSeq = []; // Reset the user sequence
    started = false; // Game is not started anymore
    level = 0; // Reset the level
}

// Function to increase the level and add a new color to the sequence
function levelUp() {
    level++;
    h2.innerText = `Level ${level}`; // Update the level text

    let ranIdx = Math.floor(Math.random() * btns.length); // Get a random button color
    let randColor = btns[ranIdx]; // Get the random color from btns array
    gameSeq.push(randColor); // Add to the game sequence

    // Flash the selected button
    let randBtn = document.querySelector(`.${randColor}`);
    btnFlash(randBtn);
}

// Add event listeners for each button
btnElements.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (started) {
            let color = btn.classList[1]; // Get the color of the clicked button
            handleUserClick(color);
        }
    });
});
