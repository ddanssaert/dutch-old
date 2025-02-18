import GameController from '../objects/GameController.js';


export default class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload() {
        // Load card back image
        this.load.image('card-blank', '/assets/cards/blank.png');
        this.load.image('card-back', '/assets/cards/back-blue.png');
        this.load.image('card-deck-back', '/assets/cards/deck-vertical-blue.png');
        this.load.image('card-deck', '/assets/cards/deck-vertical-blank.png');

        // Load individual card images
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        suits.forEach((suit) => {
            ranks.forEach((rank) => {
                const cardName = `${suit}_${rank}`; // e.g., "hearts_2"
                this.load.image(cardName, `/assets/cards/${cardName}.png`);
            });
        });

        // Load sounds
        // this.load.audio('deal-card', '/assets/sounds/deal-card.mp3');
    }

    async create() {
        // Play sound when dealing a card
        // const dealSound = this.sound.add('deal-card');
        // dealSound.play();

        // Set the background color to #008080 (Teal)
        this.cameras.main.setBackgroundColor('#008080');

        this.game = new GameController(this);
        await this.game.dealCards();
        await this.game.showFirstPlayerCards();

    }

    update() {
        // Game logic here
    }
}