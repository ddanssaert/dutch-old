import PlayerTurnPhase from "../model/PlayerTurnPhase";

export default class InputEventHandler {
    constructor(controller, view) {
        this._controller = controller;
        this._view = view;
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
        const playerView = this._view.getPlayerView(playerModel);
        if (this._view._isSwapping === true) {
            const cardView = this._view.getCardView(tableCardModel);
            console.debug(playerModel);
            if (playerView._isLocal) {
                console.debug('chosen own swap card');
                this._view._ownSwapCard = cardView;
            } else {
                console.debug('chosen other swap card');
                this._view._otherSwapCard = cardView;
                this._view._otherSwapPlayerModel = playerModel;
            }
            if (this._view._ownSwapCard !== null && this._view._otherSwapCard !== null) {
                this._controller.swapEffect(this._view._ownSwapCard.cardModel, this._view._otherSwapCard.cardModel, this._view._otherSwapPlayerModel);
            }
        } else if (playerView._isLocal === true && playerModel.playerTurnPhase === PlayerTurnPhase.SWAP_OR_DISCARD) {
            this._controller.swapHandToTable(playerModel, tableCardModel);
        } else if (playerView._isLocal === true) {
            console.debug('Discard card from table!');
            this._controller.discardFromTable(playerModel, tableCardModel);
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

    async onClickSwap() {
        console.debug('onClickSwap()');
        // this._controller.endPlayerTurn();
        this._view.startSwapEffect();
    }
}