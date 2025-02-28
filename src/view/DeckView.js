import BaseCardView from "./BaseCardView";

export default class DeckView extends BaseCardView {
    constructor(deckModel, gameView, x, y) {
        super(gameView._scene, x, y, 'card-deck-back');
        this.deckModel = deckModel;

        gameView._scene.add.existing(this);
        this.setInteractive();

        this.on('pointerdown', () => gameView._inputEventHandler.onClickDeck());
    }

    enableHighlight() {
        super.enableHighlight();
        this.highlightImage.setTexture('card-deck-highlight');
    }

    updateLayout() {
        if (this.deckModel.getCardsCount() == 0) {
            this.setTexture('card-blank');
        }
    }
}