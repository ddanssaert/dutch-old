import BaseCardView from "./BaseCardView";
import { getTexture } from "./Helpers";

export default class BinView extends BaseCardView {
    constructor(binModel, gameView, x, y) {
        super(gameView._scene, x, y, 'card-blank');
        this.binModel = binModel;

        this.on('pointerdown', () => gameView._inputEventHandler.onClickBin());
    }

    update() {
        const cardModel = this.binModel.getTopCard();
        if (cardModel !== null) {
            const texture = getTexture(cardModel);
            this.setTexture(texture);
        } else {
            this.setTexture('card-blank');
        }
    }
}