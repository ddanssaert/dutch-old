import PlayerTurnPhase from "../model/PlayerTurnPhase";

export default class InputEventHandler {
    constructor(controller) {
        this._controller = controller;
    }

    async onClickDeck() {
        console.debug('onClickDeck()');
        const playerModel = this._controller._model.getCurrentPlayer();
        console.log(playerModel.playerTurnPhase);
        if (playerModel.playerTurnPhase === PlayerTurnPhase.DRAW) {
            await this._controller.drawCardFromDeck();
        }
        console.log(playerModel.playerTurnPhase);
    }

    async onClickBin() {
        console.debug('onClickBin()');
        const playerModel = this._controller._model.getCurrentPlayer();
        console.log(playerModel.playerTurnPhase);
        if (playerModel.hasCardInHand() && playerModel.playerTurnPhase === PlayerTurnPhase.SWAP_OR_DISCARD) {
            await this._controller.discardFromHand();
        } else if (playerModel.playerTurnPhase === PlayerTurnPhase.DRAW) {
            await this._controller.drawCardFromBin();
        }
        console.log(playerModel.playerTurnPhase);
    }

    async onClickPlayerHand(playerModel, cardModel) {
        console.debug('onClickPlayerHand()');
    }

    async onClickPlayerTableCard(playerModel, tableCardModel) {
        console.debug('onClickPlayerTableCard()');
        console.log(playerModel.playerTurnPhase);
        if (playerModel.playerTurnPhase === PlayerTurnPhase.SWAP_OR_DISCARD) {
            this._controller.swapHandToTable(playerModel, tableCardModel);
        }
        console.log(playerModel.playerTurnPhase);
    }
}