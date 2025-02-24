import GameModel from "../model/GameModel";
import PlayerModel from "../model/PlayerModel";
import GameView from "../view/GameView";


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

    async endPlayerTurn() {
        this._model.endPlayerTurn();
    }

    async dealCards() {
        this._model.dealCards()
        await this._view.dealCards(this._model);
    }

    async showFirstPlayerCards() {
        this._model.flipFirstPlayerCards();
        await this._view.showFirstPlayerCards(this._model);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2s
        this._model.flipFirstPlayerCards();
        await this._view.hideFirstPlayerCards(this._model);
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
        }
        this._view._deckView.update();
    }

    async discardFromHand() {
        console.debug('drawCardFromBin()');
        const playerModel = this._model.getCurrentPlayer();
        const cardModel = this._model.discardFromHand(playerModel);
        if (cardModel) {
            await this._view.discardCardToBin(cardModel);
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
        return index;
    }

    async _moveFromHandToTable(playerModel, index) {
        const cardModel = this._model.moveFromHandToTable(playerModel, index);
        cardModel.flip();
        if (cardModel) {
            await this._view.flipCard(cardModel);
            await this._view.moveToTable(cardModel, playerModel, index);
        }
    }

    async swapHandToTable(playerModel, tableCardModel) {
        const handCardModel = playerModel.getCardInHand();
        if (handCardModel !== null && handCardModel !== undefined) {
            const index = await this._discardFromTable(playerModel, tableCardModel);
            await this._moveFromHandToTable(playerModel, index);
        }
    }

    dutch(player) {
        
    }
}