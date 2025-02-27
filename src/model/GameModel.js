import BinModel from "./BinModel";
import DeckModel from "./DeckModel";
import PlayerModel from "./PlayerModel";
import PlayerTurnPhase from "./PlayerTurnPhase";

export default class GameModel {
    constructor() {
        this.deck = new DeckModel();
        this.bin = new BinModel();
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    initPlayers(nPlayes) {
        for (let i=0; i<nPlayes; i++) {
            this.addPlayer(new PlayerModel(i));
        }
    }

    getPlayers() {
        return this.players;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    endPlayerTurn() {
        /*this.getCurrentPlayer().playerTurnPhase = PlayerTurnPhase.IDLE;
        this.currentPlayerIndex[this.players.length-1? 0 : this.currentPlayerIndex+1];*/
        this.getCurrentPlayer().playerTurnPhase = PlayerTurnPhase.DRAW;
    }

    dealCards() {
        for (let i=0; i<4; i++) {
            for (let player of this.players) {
                player.addCardToTable(this.deck.drawCard());
            }
        }
    }

    showFirstPlayerCards() {
        for (let i=0; i<2; i++) {
            for (let player of this.players) {
                const cardModel = player.getCardFromTable(i);
                cardModel.flip();
            }
        }
    }

    hideFirstPlayerCards() {
        for (let i=0; i<2; i++) {
            for (let player of this.players) {
                const cardModel = player.getCardFromTable(i);
                cardModel.flip();
            }
        }
        this.getCurrentPlayer().playerTurnPhase = PlayerTurnPhase.DRAW;
    }

    drawCardFromDeck(playerModel) {
        const cardModel = this.deck.drawCard();
        if (cardModel) {
            playerModel.addCardToHand(cardModel);
            cardModel.flip();
        }
        playerModel.playerTurnPhase = PlayerTurnPhase.SWAP_OR_DISCARD;
        return cardModel;
    }

    drawCardFromBin(playerModel) {
        const cardModel = this.bin.drawCard();
        if (cardModel) {
            playerModel.addCardToHand(cardModel);
        }
        playerModel.playerTurnPhase = PlayerTurnPhase.SWAP_OR_DISCARD;
        return cardModel;
    }

    discardFromHand(playerModel) {
        const cardModel = this.getCurrentPlayer().drawCardFromHand();
        if (cardModel) {
            this.bin.discardCard(cardModel);
        }
        playerModel.playerTurnPhase = PlayerTurnPhase.END;
        return cardModel;
    }

    discardFromTable(playerModel, tableCardModel) {
        const index = playerModel.getIndexFromTable(tableCardModel);
        playerModel.removeCardFromTable(index);
        this.bin.discardCard(tableCardModel);
        playerModel.playerTurnPhase = PlayerTurnPhase.END;
        return index;
    }

    moveFromHandToTable(playerModel, index) {
        const handCardModel = playerModel.drawCardFromHand();
        playerModel.addCardToTable(handCardModel, index);
        playerModel.playerTurnPhase = PlayerTurnPhase.END;
        return handCardModel;
    }
}