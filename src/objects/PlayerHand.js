export default class PlayerHand {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.placedCard = null;
    }

    setCard(placedCard) {
        this.placedCard = placedCard;
    }

    removeCard() {
        let placedCard = this.placedCard;
        this.placedCard = null;
        return placedCard;
    }

    hasCard() {
        return this.placedCard != null;
    }

    // Method to handle click events
    onClick(callback) {
        this.on('pointerdown', () => callback(this));
    }
}
