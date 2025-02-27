import GameModel from "../model/GameModel";
import GameView from "../view/GameView";
import ComputerPlayer from "./ComputerPlayer";


export default class BaseGameController {
    constructor(scene, gameControllerConfig={}) {
        this._scene = scene;
        this._config = gameControllerConfig;
        this._model = new GameModel();
        this._view = new GameView(this._model, scene, this);
    }

    async init() {
        await this.initPlayers();
        await this.dealCards();
        await this.showFirstPlayerCards();
    }

    async initPlayers() {
        this._model.initPlayers(this._config.N_PLAYERS);
        await this._view.initPlayers(this._model);
    }

    async onReady() {
        this._model.hideFirstPlayerCards();
        await this._view.hideFirstPlayerCards(this._model);
        this._view.updateTurnPhase(this._model);
    }

    async endPlayerTurn() {
        this._model.endPlayerTurn();
        if (this._model.deck.getCardsCount() === 0) {
            await this.endGame();
        }
        this._view.updateTurnPhase(this._model);
        this._view.endTurn();
        const playerIndex = this._model.currentPlayerIndex;
        console.log(`Player index: ${playerIndex}`);
        if (this._model.dutchPlayerIndex === playerIndex) {
            await this.endGame();
        } else if (playerIndex !== 0) {
            console.log(`Computer player ${playerIndex}`);
            await ComputerPlayer.playTurn(this, this._model.getCurrentPlayer());
        }
    }

    async dealCards() {
        this._model.dealCards()
        await this._view.dealCards(this._model);
    }

    async showFirstPlayerCards() {
        this._model.showFirstPlayerCards();
        await this._view.showFirstPlayerCards(this._model);
        // await new Promise(resolve => setTimeout(resolve, 2000)); // 2s
    }

    async drawCardFromDeck() {
        console.debug('drawCardFromDeck()');
        const playerModel = this._model.getCurrentPlayer();
        if (!playerModel.hasCardInHand()) {
            const cardModel = this._model.drawCardFromDeck(playerModel);
            if (cardModel) {
                await this._view.drawCardFromDeckToHand(cardModel, playerModel);
            }
            this._view._deckView.update();
            this._view.updateTurnPhase(this._model);
        } else {
            console.log('Player already has a card in hand.')
        }
    }

    async drawCardFromBin() {
        console.debug('drawCardFromBin()');
        const playerModel = this._model.getCurrentPlayer();
        const cardModel = this._model.drawCardFromBin(playerModel);
        if (cardModel) {
            await this._view.drawCardFromBinToHand(cardModel, playerModel);
            this._view.updateTurnPhase(this._model);
        }
        this._view._deckView.update();
    }

    async discardFromHand() {
        console.debug('drawCardFromBin()');
        const playerModel = this._model.getCurrentPlayer();
        const cardModel = this._model.discardFromHand(playerModel);
        if (cardModel) {
            await this._view.discardCardToBin(cardModel);
            this._view.updateTurnPhase(this._model);
        }
        this._view._deckView.update();
    }

    async _flipCard(cardModel) {
        cardModel.flip();
        await this._view.flipCard(cardModel);
    }

    async _discardFromTable(playerModel, tableCardModel) {   
        const index = this._model.discardFromTable(playerModel, tableCardModel);
        tableCardModel.flip();
        await this._view.discardCardToBin(tableCardModel, true);
        // await this._flipCard(tableCardModel);
        this._view._deckView.update();
        this._view.updateTurnPhase(this._model);
        return index;
    }

    async _dealCard(playerModel) {
        const cardModel = this._model.dealCard(playerModel);
        await this._view.dealCard(playerModel, cardModel);
    }

    async _moveFromHandToTable(playerModel, index) {
        const cardModel = this._model.moveFromHandToTable(playerModel, index);
        cardModel.flip();
        if (cardModel) {
            await this._view.flipCard(cardModel);
            await this._view.moveToTable(cardModel, playerModel, index);
            this._view.updateTurnPhase(this._model);
        }
    }

    async swapHandToTable(playerModel, tableCardModel) {
        const handCardModel = playerModel.getCardInHand();
        if (handCardModel !== null && handCardModel !== undefined) {
            const index = await this._discardFromTable(playerModel, tableCardModel);
            await this._moveFromHandToTable(playerModel, index);
            this._view.updateTurnPhase(this._model);
        }
    }

    async discardFromTable(playerModel, tableCardModel) {
        console.debug('discardFromTable()');
        const binCardModel = this._model.bin.getTopCard();
        if (!playerModel.hasCardInHand() && binCardModel !== null) {
            tableCardModel.flip();
            await this._view.flipCard(tableCardModel);
            if (tableCardModel.value === binCardModel.value) {
                // await this._discardFromTable(playerModel, tableCardModel);
                const index = this._model.discardFromTable(playerModel, tableCardModel, false);
                await this._view.discardCardToBin(tableCardModel, true);
                this._view._deckView.update();
                this._view.updateTurnPhase(this._model);
            } else {
                tableCardModel.flip();
                await this._view.flipCard(tableCardModel);
                await this._dealCard(playerModel);
            }
            this._view._binView.update();
            this._view.updateTurnPhase(this._model);
        }
    }

    async onDutch() {
        this._model.startDutch();
        await this.endPlayerTurn();
    }

    async endGame() {
        this._model.showAllCards();
        await this._view.showAllCards(this._model);
        this._view.showScores(this._model);
    }

    async swapEffect(ownCardModel, otherCardModel, otherPlayerModel) {
        console.log('Swap cards');
        this._model.swapCards(ownCardModel, otherCardModel, otherPlayerModel);
        await this._view.swapCards(ownCardModel, otherCardModel, otherPlayerModel);
    }
}