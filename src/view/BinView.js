import BaseCardView from "./BaseCardView";
import { getTexture } from "./Helpers";

export default class BinView extends BaseCardView {
    constructor(binModel, gameView, x, y) {
        super(gameView._scene, x, y, 'card-bin');
        this.setAlpha(0.5);
        this.binModel = binModel;

        this.on('pointerdown', () => gameView._inputEventHandler.onClickBin());
    }

    update() {
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
}