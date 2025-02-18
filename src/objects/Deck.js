import Card from './Card.js';
import StackedCardSlot from './StackedCardSlot.js';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export default class Deck extends StackedCardSlot {
    constructor(game, x, y) {
        super(game, x, y, true);

        this.virtualCards = suits.flatMap((suit) =>
            ranks.map((rank) => (new Card(
                suit,
                rank,
                `${suit}_${rank}`, // Texture key for the card
            )))
        );

        this.addImage((c) => 'card-deck-back', (c) => 'card-blank', () => this.game.drawCardFromDeck());
    }

    shuffle() {
        this.virtualCards.sort(() => Math.random() - 0.5);
    }
}