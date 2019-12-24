
// Cards array that holds all cards element.
const cards = document.querySelectorAll('.card');

// Declare array of icons
let icons = [
    "fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"
];

// Declare arrays that holds all opened and matched cards.
let openedCards = [];
let matchedCards = [];

// Declare variable that holds all movements and failed movement.
let moveCount = 0;
let failedMoveCount = 0;

// Declare variable that holds moves elements.
const moveElement = document.querySelector('.moves');

// Declare timer variables.
let seconds = 0;
let minutes = 0;
let interval;

// Declare variable that holds timer elements.
const timerElement = document.querySelector('.timer');

// Declare varialable that hold boolean value for wheater it is first click or not.
let isInitialClick = true;

// Declare variables to hold final move, final stars and final time elements.
const finalMoveElement = document.getElementById("finalMoves");
const finalStarsElement = document.getElementById("finalStars");
const finalTimeElement = document.getElementById("finalTime");

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Adding events listener and default values upon page refresh or load.
document.addEventListener('DOMContentLoaded', initializeGame);

// Handle the initialization that needed.
function initializeGame() {
    setEventListener();
    resetGame();
}

// Add event listener for each cards.
function setEventListener() {
    cards.forEach(function (card, index) {
        card.addEventListener('click', function () {
            cardClicked(index);
            checkWinner();
        });
    });
}

// Reset game's default values
function resetGame() {
    // Re-shuffle icons and reset cards to default.
    icons = shuffle(icons);
    cards.forEach(function (card, index) {
        card.className = 'card';
        const iconElement = card.firstElementChild;
        iconElement.className = icons[index];
    });

    // Reset user movement.
    moveCount = 0;
    moveElement.textContent = moveCount;

    // Reset user fail movement and stars rating to default.
    failedMoveCount = 0;
    const stars = document.getElementsByClassName("fa-star-o");
    for (star of stars) {
        star.classList.replace('fa-star-o', 'fa-star');
    }

    // Reset timer.
    minutes = 0;
    seconds = 0;
    timerElement.textContent = "0" + minutes + ":0" + seconds;
    clearInterval(interval);
}

// Handle card clicked and check all cards open for match. if nothing is match, hide them. 
let prevoisIndex = -1;
function cardClicked(index) {
    // Check if is user first click to start timer.
    if (isInitialClick) {
        startTimer();
        isInitialClick = false;
    }

    // Check if it is the same card that just clicked. if it is, then do nothing.
    if (!(prevoisIndex === index)) {
        prevoisIndex = index;
        showCard(index);

        if (openedCards.length === 2) {
            moveCounter();
            if (openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className) {
                cardsMatch();
            }
            else {
                cardsUnMatch();
                handleStarsRate();

                // Reset index for the last card clicked.
                prevoisIndex = -1
            }
        }
    }
}

// Start game timer
function startTimer() {
    interval = setInterval(() => {
        const secondsText = seconds < 10 ? "0" + seconds : seconds;
        const minutesText = minutes < 10 ? "0" + minutes : minutes;
        timerElement.textContent = minutesText + ":" + secondsText;

        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
    }, 1000);
}

// Display card.
function showCard(index) {
    cards[index].classList.add('open', 'show');
    openedCards.push(cards[index])
}

// Mark opended cards as match and disable user interaction on them.
function cardsMatch() {
    for (openedCard of openedCards) {
        openedCard.classList.remove('show', 'open');
        openedCard.classList.add('match', 'disableCard');

        matchedCards.push(openedCard);
    };

    // Empty opened cards array.
    openedCards = [];
}

// Display unmatched cards for a moment then hide them.
function cardsUnMatch() {
    disableAllCards();
    for (openedCard of openedCards) {
        openedCard.classList.add('unmatched');
    };
    setTimeout(function () {
        for (openedCard of openedCards) {
            openedCard.classList.remove('show', 'open', 'unmatched');
        };

        // Empty opened cards array.
        openedCards = [];
        enableUnmatchedCards();
    }, 1000);
}

// Increase user movement counter.
function moveCounter() {
    moveCount++;
    moveElement.textContent = moveCount;
}

// Count failed user movement and decrease stars every five failed move.
function handleStarsRate() {
    failedMoveCount++;

    const stars = document.getElementsByClassName("fa-star");
    if (stars !== 'undefined' && stars.length > 0) {
        const lastIndex = stars.length - 1;
        if (failedMoveCount === 5 || failedMoveCount === 10 || failedMoveCount === 15) {
            stars[lastIndex].classList.replace('fa-star', 'fa-star-o');
        }
    }
}

// Disable user intercations on all cards
function disableAllCards() {
    Array.prototype.filter.call(cards, function (card) {
        card.classList.add('disableCard');
    });
}

// Enable user interaction on all cards except the match ones.
function enableUnmatchedCards() {
    Array.prototype.filter.call(cards, function (card) {
        if (!card.classList.contains('match')) {
            card.classList.remove('disableCard');
        }
    });
}

// Check if the user got all cards then display a congrations message.
function checkWinner() {
    if (matchedCards.length === 16) {
        clearInterval(interval);
        showSuccessMessage();

        // Empty match cards array.
        matchedCards = [];
    }
}

// Dispaly congrations message and fill elements text content of the modal to show final result.
function showSuccessMessage() {
    const stars = document.getElementsByClassName("fa-star");

    finalMoveElement.textContent = moveCount;
    finalStarsElement.textContent = stars.length;
    finalTimeElement.textContent = timerElement.textContent;

    $("#myModal").modal("toggle");
}

// Hide modal and reset the game.
function playAgain() {
    $("#myModal").modal("hide");
    resetGame();
}
