import { GAME_CONFIG } from "../config";
import BaseCardView from "./BaseCardView";
import { getTexture } from "./Helpers";

export default class BinView extends BaseCardView {
    constructor(binModel, gameView, displaySize) {
        super(gameView._scene, 0, 0, 'card-bin');
        this.setAlpha(0.5);
        this.binModel = binModel;

        this.on('pointerdown', () => gameView._inputEventHandler.onClickBin());
        this.updateLayout(displaySize);
    }

    updateTexture() {
        const cardModel = this.binModel.getTopCard();
        if (cardModel !== null) {
            const texture = getTexture(cardModel);
            this.setTexture(texture);
            this.setAlpha(1);
        } else {
            this.setTexture('card-bin');
            this.setAlpha(0.5);
        }
    }

    updateLayout(displaySize) {
        const cardHeight = Math.min(GAME_CONFIG.DECKS.MAX_HEIGHT, GAME_CONFIG.DECKS.RELATIVE_HEIGHT*displaySize.height);
        this.setScale(cardHeight/GAME_CONFIG.DECKS.MAX_HEIGHT);

        const xPadding = Math.min(GAME_CONFIG.DECKS.MAX_X_PADDING, GAME_CONFIG.DECKS.RELATIVE_X_PADDING*this.width);
        this.x = (displaySize.width + xPadding)/2;
        this.y = displaySize.height*GAME_CONFIG.DECKS.RELATIVE_Y;
    }
}