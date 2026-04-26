const cards = document.querySelectorAll('.card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchCount = 0;
let timer;
let seconds = 0;

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        document.getElementById('time').textContent = seconds;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer); // Clear the timer interval to stop it
}

const imageUrls = [
    "https://images-ng.pixai.art/images/orig/29b53a47-ac50-47cc-88b1-ee35feb6af13",
    "https://images-ng.pixai.art/images/orig/e76cbc9c-f3c0-4c4e-a930-f2cbf165a64f",
    "https://upload-os-bbs.hoyolab.com/upload/2023/02/05/103958874/0726c488d423f53a876e4a6165ec368d_1523837634534957685.png",
    "https://cdnb.artstation.com/p/assets/images/images/063/260/299/large/avetetsuya-studios-raiden-shogun.jpg?1685100799",
    "https://m.media-amazon.com/images/I/61jFoyIwtuL._AC_UF894,1000_QL80_.jpg",
    "https://s1.zerochan.net/Nahida.600.3992290.jpg",
    "https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24162431/GenshinImpact_2022_11_02_01_24_43.jpg?quality=90&strip=all&crop=18.75,0,62.5,100",
    "https://images.gamebanana.com/img/ss/mods/6626af5a9493d.jpg"
];

const shuffledImages = [...imageUrls, ...imageUrls].sort(() => Math.random() - 0.5);

cards.forEach((card, index) => {
    const img = document.createElement('img');
    img.src = shuffledImages[index];
    img.alt = `Card image ${index + 1}`;
    img.style.display = 'none';
    card.appendChild(img);
    card.dataset.location = shuffledImages[index];
});

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    if (seconds === 0) startTimer();

    this.classList.add('flipped');
    this.querySelector('img').style.display = 'block';

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.location === secondCard.dataset.location;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchCount++;

    if (matchCount === 8) {
        stopTimer(); // Stop the timer when all pairs are matched
        document.getElementById('game-end-message').style.display = 'block';
        document.getElementById('game-end-message').textContent = `Congratulations! You finished the game in ${seconds} seconds.`;
        document.getElementById('play-again').style.display = 'inline-block'; // Show Play Again button
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.querySelector('img').style.display = 'none';
        secondCard.classList.remove('flipped');
        secondCard.querySelector('img').style.display = 'none';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    matchCount = 0;
    seconds = 0;
    document.getElementById('time').textContent = seconds;
    document.getElementById('game-end-message').style.display = 'none'; // Hide game end message
    document.getElementById('play-again').style.display = 'none'; // Hide Play Again button

    // Reset all cards and re-enable clicking
    cards.forEach(card => {
        card.classList.remove('flipped');
        card.querySelector('img').style.display = 'none';
        card.addEventListener('click', flipCard);
    });

    // Shuffle images and reassign them
    const reshuffledImages = [...imageUrls, ...imageUrls].sort(() => Math.random() - 0.5);
    cards.forEach((card, index) => {
        card.querySelector('img').src = reshuffledImages[index];
        card.dataset.location = reshuffledImages[index];
    });
}
