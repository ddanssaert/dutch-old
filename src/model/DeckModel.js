import CardModel from "./CardModel";

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = Array.from({ length: 13 }, (_, i) => i + 1);


export default class DeckModel {
    constructor() {
        this.cards = suits.flatMap((suit) =>
            ranks.map((rank) => (new CardModel(
                Math.floor(Math.random() * 1000000),
                suit,
                rank,
                true,
            )))
        );
        this.shuffle();
    }

    shuffle() {
        this.cards.sort(() => Math.random() - 0.5);
    }

    drawCard() {
        return this.cards.pop();
    }

    getCardsCount() {
        return this.cards.length;
    }
}