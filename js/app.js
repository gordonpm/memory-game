'use strict';

const icons = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
let moves = 0;
let countMatches = 0;
let rating = 3;
let totalSeconds = 0;
let iconArray = [];
let turn = []; // will hold the pair of cards in a move
let intervalId;

const deck = document.querySelector(".deck");
const movesSpan = document.querySelector(".moves");
const stars = document.querySelector(".stars");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
const time = document.querySelector(".time");

initialize();
startGame();

function initialize() {
    // build a new array which has 2 icons of each type
    for (const icon of icons) {
        iconArray.push(icon);
        iconArray.push(icon);
    }

    // add the listener to the deck which in turn listens to card clicks
    deck.addEventListener("click", respondToCardClick);

    const playBtn = document.querySelector(".playBtn");
    playBtn.addEventListener("click", function(){
        document.querySelector(".modal").style.display = "none";
        restartGame();
    });

    const restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", restartGame);
}

function restartGame() {
    totalSeconds = 0;
    stopTimer();
    clearTimer();
    startGame();
}

/**
 * This function will be called when a new game begins. Performs the following:
 * 1) remove cards from previous game
 * 2) add deck of shuffled cards
 * 3) reset moves counter, match counter and rating
 */
function startGame() {
    moves = 0;
    countMatches = 0;
    rating = 3;
    
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    iconArray = shuffle(iconArray);
    addCardsToDeck(iconArray);
    movesSpan.innerHTML = moves;    

    while (stars.firstChild) {
        stars.removeChild(stars.firstChild);
    }

    for (let i = 0; i < 3; i++) {
        let liElement = document.createElement("li");
        liElement.classList.add("fa", "fa-star");
        stars.appendChild(liElement);
    }
}

/**
 * This function will be called when a card is clicked. It will check if the 2 cards match.
 * After all cards are matched, it will display modal.
 */
function respondToCardClick(event) {
    let card = event.target;
    
    if (moves === 0 && turn.length === 0) { // start timer after first card is clicked
        intervalId = setInterval(setTime, 1000);
    }

    if (card.nodeName != "UL") { // check if same card is not clicked again
        turn.push(card);
        openCard(card);
        makeUnclickable(card);
    }

    if (turn.length === 2) {
        // check if cards match, keep both cards open
        if (checkIfCardsMatch(turn)) {
            countMatches++;
            applyMatchStyle(turn);
        }
        // else reset both cards
        else {
            resetCards(turn);
            makeClickable(turn);
        }
        
        //increment moves counter, update rating. if all cards matched, display modal.
        turn = [];
        moves++;
        movesSpan.innerHTML = moves;    
        updateRating();
        if (countMatches === 8) { // all cards are matched, display modal
            stopTimer();
            if (minutes.textContent === "00") { // if time is less than a minute, only display seconds.
                time.innerHTML = seconds.textContent + "s";    
            }
            else {
                time.innerHTML = minutes.textContent + "m" + " " + seconds.textContent + "s";
            }
            document.querySelector(".modal").style.display = "block";
            document.querySelector(".movesCounter").textContent = moves;
            document.querySelector(".rating").textContent = rating;
        }
    }
}

/**
 * Gets the class(icon) of a given card which helps in determining whether 2 cards match. 
 * For eg., for a given card like <li class="card"><i class="fa fa-cube"></i></li>
 * this function will return fa-cube
 */
function getCardImage(card) { 
    const nodes = card.children;
    for (let i = 0; i < nodes.length; i++) {
        let classList = nodes[i].classList;
        return classList[1];
    }
}

/**
 * This function will shuffle the classes(icons) within a given array.
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * This function will add the shuffled cards to the deck. 
 */
function addCardsToDeck(iconArray) {
    for (let icon of iconArray) {
        const liElement = document.createElement("li");
        liElement.classList.add("card");
        const iconElement = document.createElement("i");
        iconElement.classList.add("fa", icon);
        //iconElement.classList.add(icon);
        liElement.appendChild(iconElement);
        deck.appendChild(liElement);
    }
}

/**
 * Check if the cards(icons) in a single turn(move) match. A turn consists of opening 2 cards sequentially.
 */
function checkIfCardsMatch(turn) {
    return getCardImage(turn[0]) === getCardImage(turn[1]);
}

function openCard(card) {
    card.classList.add("open", "show");
}

/**
 * This function will be called when the 2 cards dont match. It will apply the nomatch style,
 * will disable clicking other cards until nomatch transition is complete.
 */
function resetCards(turn) {
    for (let card of turn) {
        card.classList.add("nomatch");
    }
    
    setTimeout(function() {
        for (let card of turn) {
            card.classList.remove("open", "show", "nomatch");
        }
    }, 1000);

    setTimeout(function() {
        deck.removeEventListener("click", respondToCardClick);
    }, 0);

    setTimeout(function() {
        deck.addEventListener("click", respondToCardClick);
    }, 1000);
}

/**
 * This function will update the rating in terms of stars as follows:
 * if total moves <= 16, rating = 3 stars. This is the default.
 * if total moves between 16 and 24, rating = 2 stars.
 * if total moves more than 24, rating = 1 star
 */
function updateRating() {
    if (moves > 16 && moves <= 24) {
        // replace 3rd li with empty star icon if not already there
        if (!stars.children[2].classList.contains("fa-star-o")) {
            modifyStars(stars.children[2], 2);
        }
    }
    else if (moves > 24) {
        // replace 2nd li so that there will be 1 full and 2 empty stars
        if (!stars.children[1].classList.contains("fa-star-o")) {
            modifyStars(stars.children[1], 1);
        }
    }
}

function modifyStars(item, number) {
    stars.removeChild(item);
    let liElement = document.createElement("li");
    liElement.classList.add("fa", "fa-star-o");
    stars.appendChild(liElement);
    rating = number;
}

function clearTimer() {
    minutes.innerHTML = "00";
    seconds.innerHTML = "00";
}

function makeUnclickable(card) {
    card.classList.add('unclickable');
}

function makeClickable(turn) {
    for (let card of turn) {
        card.classList.remove('unclickable');
    }
}

function applyMatchStyle(turn) {
    for (let card of turn) {
        card.classList.add("match");
    }
}

/**
 * This function will pad '0' to sec or min value if needed.
 */
function pad(val) {
    const valString = val.toString();
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
}

function stopTimer() {
    clearInterval(intervalId);
  }

function setTime() {
    ++totalSeconds;
    seconds.innerHTML = pad(totalSeconds % 60);
    minutes.innerHTML = pad(parseInt(totalSeconds / 60));
}