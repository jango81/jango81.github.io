const button = document.querySelector(".button button");
const cardItems = document.querySelectorAll(".card_item img");

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function showRandCards() {
    for (const item of cardItems) {
        item.src = `images/cards/${getRandom(1, 53)}.jpg`;
    }
}

button.addEventListener("click", showRandCards);
