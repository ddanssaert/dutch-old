export default class CardModel {
    constructor(id, rank, value, isFaceDown) {
        this.id = id;
        this.rank = rank;
        this.value = value;
        this.isFaceDown = isFaceDown;
    }

    flip () {
        this.isFaceDown = !this.isFaceDown;
    }
}