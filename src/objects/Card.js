export default class Card {
    constructor(suit, rank, texture) {
        // Store card properties
        this.suit = suit;
        this.rank = rank;
        this.texture = texture;
    }

    getValue() {
        if (this.rank == 'A')
            return 1;
        else if (this.rank == 'J')
            return 11;
        else if (this.rank == 'Q')
            return 12;
        else if (this.rank == 'K')
            return 13;
        else
            return Number.parseInt(this.rank);
    }
}
