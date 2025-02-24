import { GAME_CONFIG } from "../config";

export default class BaseCardView extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        this.scale = GAME_CONFIG.CARD_SCALE;
        
        scene.add.existing(this);
        this.setInteractive();

        this.highlightImage = null;
    }

    enableHighlight() {
        this.highlightImage = this.scene.add.image(this.x, this.y, 'card-highlight');
        this.highlightImage.scale = GAME_CONFIG.CARD_SCALE;
    }

    disableHighlight() {
        this.highlightImage.remove();
        this.highlightImage = null;
    }

    update() {
        if (this.deckModel.getCardsCount() == 0) {
            this.setTexture('card-blank');
        }
    }
}