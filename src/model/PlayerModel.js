import PlayerTurnPhase from "./PlayerTurnPhase";

export default class PlayerModel {
    constructor(id) {
        this.id = id;
        this.handCard = null;
        this.tableCards = [];
        this.playerTurnPhase = PlayerTurnPhase.IDLE;
    }

    hasCardInHand() {
        return this.handCard !== null;
    }

    getCardInHand() {
        return this.handCard;
    }

    addCardToHand(card) {
        this.handCard = card;
    }

    drawCardFromHand() {
        const card = this.handCard;
        this.handCard = null;
        return card;
    }

    getTableCardsCount() {
        return this.tableCards.length;
    }

    addCardToTable(card, index=null) {
        if (index !== null) {
            this.tableCards[index] = card;
        } else {
            this.tableCards.push(card);
        }
    }

    getCardFromTable(index) {
        return this.tableCards[index];
    }

    getIndexFromTable(cardModel) {
        return this.tableCards.indexOf(cardModel);
    }

    removeCardFromTable(index) {
        const card = this.tableCards[index];
        this.tableCards[index] = null;
        return card;
    }

    getScore() {
        let score = 0;
        for (let card of this.tableCards.values()) {
            score += card.value;
        }
        return score;
    }
}