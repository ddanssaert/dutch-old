import PlayerTurnPhase from "../model/PlayerTurnPhase";

export default class InputEventHandler {
    constructor(controller) {
        this._controller = controller;
    }

    async onClickDeck() {
        console.debug('onClickDeck()');
        const playerModel = this._controller._model.getCurrentPlayer();
        if (playerModel.playerTurnPhase === PlayerTurnPhase.DRAW) {
            await this._controller.drawCardFromDeck();
        }
    }

    async onClickBin() {
        console.debug('onClickBin()');
        const playerModel = this._controller._model.getCurrentPlayer();
        if (playerModel.hasCardInHand() && playerModel.playerTurnPhase === PlayerTurnPhase.SWAP_OR_DISCARD) {
            await this._controller.discardFromHand();
        } else if (playerModel.playerTurnPhase === PlayerTurnPhase.DRAW) {
            await this._controller.drawCardFromBin();
        }
    }

    async onClickPlayerHand(playerModel, cardModel) {
        console.debug('onClickPlayerHand()');
    }

    async onClickPlayerTableCard(playerModel, tableCardModel) {
        console.debug('onClickPlayerTableCard()');
        if (playerModel.playerTurnPhase === PlayerTurnPhase.SWAP_OR_DISCARD) {
            this._controller.swapHandToTable(playerModel, tableCardModel);
        }
    }

    async onClickReady() {
        console.debug('onClickReady()');
        this._controller.onReady();
    }

    async onClickDutch() {
        console.debug('onClickDutch()');
        this._controller.onDutch();
    }

    async onClickEndturn() {
        console.debug('onClickEndturn()');
        this._controller.endPlayerTurn();
    }
}