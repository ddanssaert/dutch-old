import { GAME_CONFIG } from "../config";
import BaseCardView from "./BaseCardView";

export default class DeckView extends BaseCardView {
    constructor(deckModel, gameView, displaySize) {
        super(gameView._scene, 0, 0, 'card-deck-back');
        this.deckModel = deckModel;

        gameView._scene.add.existing(this);
        this.setInteractive();

        this.on('pointerdown', () => gameView._inputEventHandler.onClickDeck());
        this.updateLayout(displaySize);
    }

    enableHighlight() {
        super.enableHighlight();
        this.highlightImage.setTexture('card-deck-highlight');
    }

    updateTexture() {
        if (this.deckModel.getCardsCount() == 0) {
            this.setTexture('card-blank');
        }
    }

    updateLayout(displaySize) {
        const cardHeight = Math.min(GAME_CONFIG.DECKS.MAX_HEIGHT, GAME_CONFIG.DECKS.RELATIVE_HEIGHT*displaySize.height);
        this.setScale(cardHeight/GAME_CONFIG.DECKS.MAX_HEIGHT);

        const xPadding = Math.min(GAME_CONFIG.DECKS.MAX_X_PADDING, GAME_CONFIG.DECKS.RELATIVE_X_PADDING*this.width);
        this.x = (displaySize.width - xPadding)/2;
        this.y = displaySize.height*GAME_CONFIG.DECKS.RELATIVE_Y;
    }
}