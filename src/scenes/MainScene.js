import LocalGameController from '../controller/LocalGameController.js';


export default class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload() {
        // Load card back image
        this.load.image('card-highlight', '/assets/cards/card-highlight.png');
        this.load.image('card-deck-highlight', '/assets/cards/deck-vertical-highlight.png');
        this.load.image('card-blank', '/assets/cards/blank.png');
        this.load.image('card-back', '/assets/cards/back-blue.png');
        this.load.image('card-deck-back', '/assets/cards/deck-vertical-blue.png');
        this.load.image('card-deck', '/assets/cards/deck-vertical-blank.png');

        // Load individual card images
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = Array.from({ length: 13 }, (_, i) => i + 1);

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

        this.game = new LocalGameController(this, {
            N_PLAYERS: 2,
        });
        await this.game.init();
    }

    update() {
        // Game logic here
    }
}