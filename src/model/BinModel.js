export default class BinModel {
    constructor() {
        this.cards = [];
    }

    getTopCard() {
        if (this.cards.length > 0) {
            return this.cards[this.cards.length - 1];
        } else {
            return null;
        }
    }

    drawCard() {
        return this.cards.pop();
    }

    discardCard(card) {
        this.cards.push(card);
    }
}