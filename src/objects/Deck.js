import Card from './Card.js';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default class Deck extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x, y, 'card-deck-back');
        this.scene = scene;
        this.x = x;
        this.y = y;

        scene.add.existing(this);
        this.setInteractive();

        this.cards = suits.flatMap((suit) =>
            ranks.map((rank) => (new Card(
                suit,
                rank,
                `${suit}_${rank}`, // Texture key for the card
            )))
        );
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    hadCard() {
        return this.cards.length > 0;
    }

    drawCard() {
        if (this.cards.length == 0) {
            this.setTexture('card-blank');
            return null;
        }
        return this.cards.pop();
    }

    flipCard() {

    }

    // Method to handle click events
    onClick(callback) {
        this.on('pointerdown', () => callback(this));
    }
}
