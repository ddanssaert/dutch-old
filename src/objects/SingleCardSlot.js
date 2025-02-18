import BaseCardSlot from "./BaseCardSlot";

export default class SingleCardSlot extends BaseCardSlot {
    constructor(game, x, y) {
        super(game, x, y);
        this.card = null;
    }

    acceptsCard() {
        return this.card === null;
    }

    hasCard() {
        return this.card !== null;
    }

    takeCard() {
        const card = this.card;
        this.card = null;
        return card;
    }

    putCard(card) {
        this.card = card;
    }
}
