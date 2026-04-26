// Set up basic variables
let score = 0;
let missed = 0;
let combo = 0;  // Combo counter
let multiplier = 1;  // Multiplier for scoring
const maxMisses = 5;
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const missesDisplay = document.getElementById('misses');
const comboDisplay = document.getElementById('combo');  // Combo display
const multiplierDisplay = document.getElementById('multiplier');  // Multiplier display
const gameOverDisplay = document.getElementById('game-over');
const playAgainButton = document.getElementById('play-again');  // Play Again button
const countdownDisplay = document.getElementById('countdown');
const startButton = document.getElementById('start-button');
const arrows = ['up', 'down', 'left', 'right'];
const songChoice = document.getElementById('song-choice');
const backgroundMusic = document.getElementById('background-music');


const songBPMs = {
    'songs/song2.mp3': 144, // 
    'songs/song.mp3': 128,  // 
    'songs/song3.mp3': 160,  // 
    'songs/seasons.mp3': 60, // 
    'songs/only.mp3': 123,  // 
    'songs/silhouette.mp3' : 160,
    'songs/samidare.mp3' : 112,
    'songs/birdsofafeather.mp3' : 105,
    'songs/oshinoko.mp3' : 166,
    'songs/cupid.mp3' : 288,
    'songs/apt.mp3' : 149,
    'songs/kororon.mp3' : 125,
    'songs/adospyxfamily.mp3' : 188,
    'songs/NoOneNoticed.mp3' : 196,
    'songs/staywithme.mp3' : 108,
    'songs/diewithasmile.mp3' : 158
};


// Make beatInterval let instead of const so it can be dynamically updated
let beatInterval = getBeatInterval(songBPMs[songChoice.value]);  // Initial interval based on the default song

let arrowInterval;

// Create arrow element
function createArrow(direction) {
    const arrow = document.createElement('div');
    arrow.classList.add('arrow', direction);
    arrow.style.top = '0px'; // Start at the top
    arrow.style.left = (arrows.indexOf(direction) * 100) + 'px'; // Position based on arrow type
    arrow.dataset.hit = "false"; // Add a flag to track if the arrow was successfully hit
    gameArea.appendChild(arrow);
    moveArrow(arrow);
}

// Move arrow down the screen and clear the interval when arrow is removed
function moveArrow(arrow) {
    // Calculate how long the arrow should take to fall based on the BPM
    const fallDuration = beatInterval * 4;  // Adjust this multiplier based on how many beats the arrow should take to fall (4 beats in this case)

    // Set the starting time and initial position
    const startTime = Date.now();

    const moveInterval = setInterval(() => {
        // Calculate the time elapsed since the arrow started falling
        let elapsedTime = Date.now() - startTime;

        // Calculate the new position of the arrow (it should move from 0px to 600px in fallDuration)
        let arrowTop = (elapsedTime / fallDuration) * 600;  // 600px is the bottom of the screen

        if (arrowTop >= 600) {  // If the arrow reaches the bottom
            clearInterval(moveInterval);  // Stop the movement interval
            if (arrow.dataset.hit === "false") {  // If the arrow wasn't hit, count it as a miss
                arrow.remove();
                missed += 1;
                missesDisplay.textContent = 'Misses: ' + missed;
                resetCombo();  // Reset combo when an arrow is missed
                if (missed >= maxMisses) {  // Trigger game over if too many misses
                    endGame();
                }
            }
        } else {
            arrow.style.top = `${arrowTop}px`;  // Update the arrow's position
        }
    }, 20);  // Update every 20ms for smooth movement
}



// Function to display feedback for hits (Perfect, Great, Ok)
// Test feedback creation
function displayHitFeedback(result) {
    console.log('Displaying feedback:', result); // Check if this log is shown

    const feedback = document.createElement('div');
    feedback.textContent = result;
    feedback.classList.add('hit-feedback');

    // Apply different styles based on result
    if (result === 'Perfect!') {
        feedback.classList.add('perfect');
    } else if (result === 'Great!') {
        feedback.classList.add('great');
    } else if (result === 'Ok!') {
        feedback.classList.add('ok');
    }

    gameArea.appendChild(feedback);
    console.log('Appended feedback to game area.'); // Ensure it's appended

    // Remove the feedback after animation
    setTimeout(() => {
        feedback.remove();
        console.log('Removed feedback from game area.'); // Ensure it's removed
    }, 600); // Remove after the glow animation ends
}

function getBeatInterval(bpm) {
    return (60 / bpm) * 1000; // Convert BPM to milliseconds
}

function updateSong() {
    const selectedSong = songChoice.value; // Get the selected song file
    backgroundMusic.src = selectedSong;    // Update the audio source
    backgroundMusic.load();                // Reload the audio element to apply the new source

    // Update the beat interval based on the selected song's BPM
    const bpm = songBPMs[selectedSong];    // Get the BPM for the selected song
    beatInterval = getBeatInterval(bpm);   // Calculate the beat interval

    // Update dancer animation timing
    updateDancerAnimation(bpm);            // Adjust the dance to match the BPM
}

function updateDancerAnimation(bpm) {
    // Calculate how long the animation should take based on the BPM
    const danceDuration = (60 / bpm) * 4;  // Dance should match 4 beats (1 cycle every 4 beats)

    // Update the dancer's animation duration
    document.querySelectorAll('#left-scara, #right-scara').forEach(scara => {
        scara.style.animationDuration = `${danceDuration}s`; // Adjust animation duration for left and right dancers
    });
}

songChoice.addEventListener('change', updateSong);
const comboThresholdForMissReduction = 10;

// Combo update
function updateCombo() {
    combo += 1;
    comboDisplay.textContent = 'Combo: ' + combo;  // Update the combo display
    
    // Update multiplier every 10 hits
    if (combo % 10 === 0) {
        multiplier += 1;
        multiplierDisplay.textContent = 'Multiplier: x' + multiplier;  // Update the multiplier display
    }
    // Check if combo reaches the threshold and reduce misses
    if (combo % comboThresholdForMissReduction === 0) {
        console.log('Combo reached the threshold: ' + combo);  // Log combo reaching the threshold

        if (missed > 0) {
            missed -= 1;  // Reduce misses by 1
            missesDisplay.textContent = 'Misses: ' + missed;  // Update the misses display
            console.log('Miss reduced! Current misses: ' + missed);  // Log the miss reduction
        } else {
            console.log('Misses not reduced. Current misses: ' + missed);  // Log if there are no misses to reduce
        }
    }
}

// Reset the combo and multiplier
function resetCombo() {
    combo = 0;
    comboDisplay.textContent = 'Combo: ' + combo;
    resetMultiplier();
}

function resetMultiplier() {
    multiplier = 1;
    multiplierDisplay.textContent = 'Multiplier: x' + multiplier;  // Reset multiplier
}

// Handle key presses
document.addEventListener('keydown', (event) => {
    const keyPressed = event.key.replace('Arrow', '').toLowerCase();
    console.log("Key pressed:", keyPressed);
    const currentArrows = document.getElementsByClassName('arrow ' + keyPressed);

    if (currentArrows.length > 0) {
        let arrow = currentArrows[0];
        let arrowTop = parseInt(arrow.style.top);
        console.log("Arrow position (top):", arrowTop);
        
        // Define hit ranges for Perfect, Great, Ok (narrower ranges to make the game harder)
        if (arrowTop >= 485 && arrowTop <= 515) {
            console.log("Perfect hit!");
            score += 20 * multiplier;  // Apply multiplier to score
            updateCombo();  // Increment combo for successful hit
            displayHitFeedback('Perfect!');
        } else if (arrowTop >= 470 && arrowTop <= 530) {
            console.log("Great hit!");
            score += 10 * multiplier;  // Apply multiplier to score
            updateCombo();  // Increment combo for successful hit
            displayHitFeedback('Great!');
        } else if (arrowTop >= 450 && arrowTop <= 550) {
            console.log("Ok hit!");
            score += 5 * multiplier;  // Apply multiplier to score
            updateCombo();  // Increment combo for successful hit
            displayHitFeedback('Ok!');
        } else {
            return; // Don't remove the arrow if it's not in the hit range
        }
        
        arrow.dataset.hit = "true"; // Mark the arrow as successfully hit
        arrow.remove(); // This will trigger the 'remove' event and clear the interval
        scoreDisplay.textContent = 'Score: ' + score;
    }
});

function resetGame() {
    // Reset game state
    score = 0;
    missed = 0;
    combo = 0;
    multiplier = 1;

    // Reset displays
    scoreDisplay.textContent = 'Score: ' + score;
    comboDisplay.textContent = 'Combo: ' + combo;
    multiplierDisplay.textContent = 'Multiplier: x' + multiplier;
    missesDisplay.textContent = 'Misses: ' + missed;

    // Hide the game-over text and play again button
    gameOverDisplay.style.display = 'none';
    playAgainButton.style.display = 'none';

    // Reset the background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;  // Start the music from the beginning

    // Clear any existing intervals for arrow spawning
    clearInterval(arrowInterval);

    // Remove all arrows currently on the screen
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => {
        arrow.remove();  // Remove all arrows from the game area
    });

    // Ensure no movement intervals are still running for individual arrows
    const moveIntervals = document.querySelectorAll('.arrow');
    moveIntervals.forEach(interval => clearInterval(interval.dataset.moveInterval));

    // Start the game again
    startGame();
}





// Get references to the Scaramouche dancers
const leftScara = document.getElementById('left-scara');
const rightScara = document.getElementById('right-scara');

// Function to show the Scaramouche dancers
function showDancers() {
    leftScara.style.display = 'block';
    rightScara.style.display = 'block';
}

// Modify the startGame function to show the dancers when the song starts
function startGame() {
    arrowInterval = setInterval(() => {
        if (missed >= maxMisses) {
            clearInterval(arrowInterval);
        } else {
            const randomDirection = arrows[Math.floor(Math.random() * arrows.length)];
            createArrow(randomDirection);
        }
    }, beatInterval);  // Use the dynamic beatInterval based on the song's BPM

    backgroundMusic.play();  // Play the selected song
    showDancers();           // Show the dancers as soon as the song starts

    // Add an event listener to end the game when the song finishes
    backgroundMusic.addEventListener('ended', () => {
        endGame();  // Call endGame when the song finishes
    });
}




// Start the game with a countdown
function startWithCountdown() {
    let countdown = 3;
    countdownDisplay.style.display = 'block';
    startButton.style.display = 'none'; // Hide the start button during countdown

    const countdownInterval = setInterval(() => {
        countdownDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none'; // Hide countdown
            startGame(); // Start the game when countdown reaches 0
        }
        countdown--;
    }, 1000); // Update countdown every second
}

// Proper game-over handling
function endGame() {
    console.log("Game Over!");

    // Stop the background music
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;  // Reset the music to the beginning

    // Clear the arrow spawning interval
    clearInterval(arrowInterval);

    // Remove any existing arrows and stop their movement
    const arrows = document.querySelectorAll('.arrow'); // Get all active arrows
    arrows.forEach(arrow => {
        arrow.remove();  // Remove all arrows from the game area
    });

    // Show the "Game Over" text and the "Play Again" button
    gameOverDisplay.style.display = 'block';
    playAgainButton.style.display = 'block';

    // Optionally, hide the dancers at the end of the game
    leftScara.style.display = 'none';
    rightScara.style.display = 'none';
}



// Set up start button to begin the game
startButton.addEventListener('click', () => {
    startWithCountdown();
});

// Set up Play Again button to reset the game
playAgainButton.addEventListener('click', () => {
    resetGame(); // Reset the game when the Play Again button is clicked
});

