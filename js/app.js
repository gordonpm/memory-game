/*
 * Create a list that holds all of your cards
 */
var icons = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-bomb", "fa-leaf", "fa-bicycle"];
var iconArray = [];

const deck = document.querySelector(".deck");
deck.addEventListener("click", respondToCardClick);

// build a new array which has 2 icons of each type
for (const icon of icons) {
    iconArray.push(icon);
    iconArray.push(icon);
}


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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var previousCard;
var moves;
const movesSpan = document.querySelector(".moves");
var countMatches;
var rating;
const stars = document.querySelector(".stars");

for (star of stars.children) {
    console.log(star.nodeName);
}
stars.removeChild(stars.children[2]);

startGame();



function respondToCardClick(event) {
    card = event.target;
    card.classList.add('open');
    card.classList.add('show');   
    card.classList.add('unclickable');
        
    let currentCardImage = getCardImage(card);
    if (previousCard != null) {
        let previousCardImage = getCardImage(previousCard);
        if (previousCardImage === currentCardImage) {
            console.log('match found');
            countMatches++;
            if (countMatches === 8) {
                console.log('Game over');
                document.querySelector(".modal").style.display = "block";
                document.querySelector(".movesCounter").textContent = moves;
                document.querySelector(".rating").textContent = rating;
                const cards = document.querySelectorAll(".card");
                cards.forEach(card => {
                    card.classList.remove('open');
                    card.classList.remove('show');
                    card.classList.remove('unclickable'); 
                });
            }
        }
        else {
            console.log('match not found');
            card.classList.remove('open');
            card.classList.remove('show');
            previousCard.classList.remove('open');
            previousCard.classList.remove('show');
            card.classList.remove('unclickable');
            previousCard.classList.remove('unclickable');
        }
        moves++;
        movesSpan.innerHTML = moves;    
        updateRating();
        previousCard = null;
    }
    else {
        previousCard = card;
    }
}

function updateRating() {
    if (moves > 8 && moves <= 16) {
        // remove last li 
        // append li with empty star icon
    }
    else if (moves > 16 && moves <= 24) {
        // remove second last li
        // replace with empty star icon so that there will be 1 full and 2 empty stars
    }
    else if (moves > 24) {
        // remove all li's and replace with 3 empty star li's
    }
}

function startGame() {
    previousCard = null;
    moves = 0;
    countMatches = 0;
    rating = 3;
    iconArray = shuffle(iconArray);
    addCardsToDeck(iconArray);
} 
 
function getCardImage(card) { // refactor to use children instead of childNodes
    const nodes = card.childNodes;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].classList != undefined) {
            let classList = nodes[i].classList;
            console.log(classList[1]);
            return classList[1];
        }
    }
}

var playBtn = document.querySelector(".playBtn");
playBtn.addEventListener("click", function(){
    document.querySelector(".modal").style.display = "none";
    startGame();
});