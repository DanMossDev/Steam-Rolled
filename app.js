//const GAMES = require('./games');

//DOM cache
const title = document.getElementById('gametitle');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const bio = document.getElementById('bio');
const swipeButton = document.getElementById('swipe');
const matchesButton = document.getElementById('matches');
// const statsButton = document.getElementById('stats');
const swipeSection = document.getElementById('swipesection');
const matchesSection = document.getElementById('matchessection');

//variables
let currentGame

swipeButton.addEventListener('click', function() {loadSwipe()})
matchesButton.addEventListener('click', function() {loadMatches()})

function loadSwipe() {
    swipeSection.style.display = 'block';
    matchesSection.style.display = 'none';
    //statsSection.style.display = 'none';
}

function loadMatches() {
    swipeSection.style.display = 'none';
    matchesSection.style.display = 'block';
    //statsSection.style.display = 'none';
}



function randomGame() { //generate a random next game that the user hasn't already seen

}


function loadNext() {
    
}