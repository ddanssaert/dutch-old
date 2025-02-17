import PlacedCard from "./PlacedCard";

const X_OFFSET = 50;
const Y_OFFSET = 70;

export default class Player {
    constructor(scene, x, y, game) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.cards = [];
        this.cardPositions = [
            {x: x - X_OFFSET, y: y + Y_OFFSET},
            {x: x + X_OFFSET, y: y + Y_OFFSET},
            {x: x - X_OFFSET, y: y - Y_OFFSET},
            {x: x + X_OFFSET, y: y - Y_OFFSET},
        ]
        this.game = game;
    }

    getNextPosition() {
        const i = this.cards.length;
        return this.getCardPosition(i);
    }

    addNextCard(placedCard) {
        this.cards.push(placedCard);
        let i = this.cards.length - 1;
        // Add click event listener
        placedCard.on('pointerdown', () => {
            this.game.onClickPlayerCard(i);
        });
    }

    getCard(i) {
        return this.cards[i];
    }

    getCardPosition(i) {
        return this.cardPositions[i];
    }

    setCard(placedCard, i) {
        this.cards[i] = placedCard;
        placedCard.on('pointerdown', () => {
            this.game.onClickPlayerCard(i);
        });
    }

    removeCard(i) {
        const card = this.cards[i];
        this.cards[i] = null;
        card.disableInteractive();
        return card;
    }

    getScore() {
        return this.cards.reduce((total, card) => total + (card.card ? card.card.getValue() : 0), 0);
    }
}