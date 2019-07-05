/*
 * Create a list that holds all of your cards
 */
const icons = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
var iconArray = [];
var moves;
var turn = [];
const movesSpan = document.querySelector(".moves");
var countMatches = 0;
var rating;
const stars = document.querySelector(".stars");
const deck = document.querySelector(".deck");
const minutes = document.querySelector(".minutes");
const seconds = document.querySelector(".seconds");
var totalSeconds = 0;

initialize();
startGame();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function addCardsToDeck(iconArray) {
    for (icon of iconArray) {
        liElement = document.createElement("li");
        liElement.classList.add("card");
        iconElement = document.createElement("i");
        iconElement.classList.add("fa");
        iconElement.classList.add(icon);
        liElement.appendChild(iconElement);
        deck.appendChild(liElement);
    }
}

function initialize() {
    // build a new array which has 2 icons of each type
    for (const icon of icons) {
        iconArray.push(icon);
        iconArray.push(icon);
    }

    deck.addEventListener("click", respondToCardClick);

    var playBtn = document.querySelector(".playBtn");
    playBtn.addEventListener("click", function(){
        document.querySelector(".modal").style.display = "none";
        totalSeconds = 0;
        stopTimer();
        clearTimer();
        startGame();
    });

    var restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", function(){
        totalSeconds = 0;
        stopTimer();
        clearTimer();
        startGame();
    });
}

function clearTimer() {
    minutes.innerHTML = 00;
    seconds.innerHTML = 00;
}

function openCard(card) {
    card.classList.add('open');
    card.classList.add('show');   
}

function closeCards(turn) {
    turn[0].classList.add("nomatch");
    turn[1].classList.add("nomatch");
    setTimeout(function() {
        turn[0].classList.remove('open');
        turn[0].classList.remove('show');
        turn[0].classList.remove('nomatch');
        turn[1].classList.remove('open');
        turn[1].classList.remove('show');
        turn[1].classList.remove('nomatch');
    }, 1000);
    setTimeout(function() {
        deck.removeEventListener("click", respondToCardClick);
    }, 0);
    setTimeout(function() {
        deck.addEventListener("click", respondToCardClick);
    }, 1000);
}

function makeUnclickable(card) {
    card.classList.add('unclickable');
}

function makeClickable(card) {
    card.classList.remove('unclickable');
}

function checkIfCardsMatch(turn) {
    if (getCardImage(turn[0]) === getCardImage(turn[1])) {
        return true;
    }
    else {
        return false;
    }
}

function applyMatchStyle(turn) {
    turn[0].classList.add("match");
    turn[1].classList.add("match");
}

function pad(val) {
    var valString = val + "";
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

function respondToCardClick(event) {
    var card = event.target;
    if (moves === 0 && turn.length === 0) { // start timer after first card is clicked
        intervalId = setInterval(setTime, 1000);
    }

    if (card.nodeName != "UL") { // check if same card is not clicked again
        turn.push(card);
        openCard(card);
        makeUnclickable(card);
    }

    if (turn.length === 2) {
        // check if cards match, keep both cards open, moves++, change rating if needed. if all cards matched, display modal.
        if (checkIfCardsMatch(turn)) {
            countMatches++;
            applyMatchStyle(turn);
        }
        // else cards do not match, close both cards, moves++, change rating if needed. 
        else if (!checkIfCardsMatch(turn)){
            closeCards(turn);
            makeClickable(turn[0]);
            makeClickable(turn[1]);
        }
        
        turn = [];
        moves++;
        movesSpan.innerHTML = moves;    
        updateRating();
        if (countMatches === 8) {
            stopTimer();
            console.log('Game over');
            document.querySelector(".modal").style.display = "block";
            document.querySelector(".movesCounter").textContent = moves;
            document.querySelector(".rating").textContent = rating;
        }
    }
}

function updateRating() {
    if (moves > 16 && moves <= 24) {
        // remove last li 
        stars.removeChild(stars.children[2]);

        // append li with empty star icon
        // <li><i class="fa fa-star"></i></li>
        liElement = document.createElement("li");
        liElement.classList.add("fa", "fa-star-o");
        stars.appendChild(liElement);
        rating = 2;
    }
    else if (moves > 24) {
        // remove second last li
        stars.removeChild(stars.children[1]);
        
        // replace with empty star icon so that there will be 1 full and 2 empty stars
        liElement = document.createElement("li");
        liElement.classList.add("fa", "fa-star-o");
        stars.appendChild(liElement);
        rating = 1;
    }
}

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
        liElement = document.createElement("li");
        liElement.classList.add("fa", "fa-star");
        stars.appendChild(liElement);
    }
} 
 
function getCardImage(card) { 
    const nodes = card.children;
    for (let i = 0; i < nodes.length; i++) {
        let classList = nodes[i].classList;
        console.log(classList[1]);
        return classList[1];
    }
}