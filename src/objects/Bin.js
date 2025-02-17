import Card from './Card.js';

export default class Bin extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'card-blank');
        this.scene = scene;
        this.x = x;
        this.y = y;

        scene.add.existing(this);
        this.setInteractive();

        this.cards = [];
    }

    hadCard() {
        return this.cards.length > 0;
    }

    addCard(card) {
        this.cards.push(card);
        this.setTexture(card.texture);
    }

    drawCard() {
        if (this.cards.length == 0) {
            return null;
        }
        let drawnCard = this.cards.pop();
        if (this.cards.length > 0) {
            let topCard = this.cards[0];
            this.setTexture(topCard.texture);
        } else {
            this.setTexture('card-blank');
        }
        return drawnCard;
    }

    // Method to handle click events
    onClick(callback) {
        this.on('pointerdown', () => callback(this));
    }
}
