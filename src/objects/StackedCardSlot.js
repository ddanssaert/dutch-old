import BaseCardSlot from "./BaseCardSlot";
import PlacedCard from "./PlacedCard";

export default class StackedCardSlot extends BaseCardSlot {
    constructor(game, x, y, faceDown) {
        super(game, x, y);
        this.faceDown = faceDown;
        this.virtualCards = [];
    }

    addImage(texture, emptyTexture, onClickHandler) {
        this.texture = texture;
        this.emptyTexture = emptyTexture;
        this.image = this.game.scene.add.image(this.x, this.y, this.emptyTexture());
        this.game.scene.add.existing(this.image);
        this.image.setInteractive();
        this.image.on('pointerdown', onClickHandler);
        this.updateImage();
    }

    updateImage() {
        let texture = null;
        if (this.hasCard()) {
            texture = this.texture();
        } else {
            texture = this.emptyTexture();
        }
        this.image.setTexture(texture);
    }

    acceptsCard() {
        return true;
    }

    hasCard() {
        return this.virtualCards.length > 0;
    }

    takeCard() {
        if (this.virtualCards.length == 0) {
            return null;
        }
        const virtualCard = this.virtualCards.pop();
        const placedCard = new PlacedCard(this.game.scene, this.x, this.y, virtualCard, this.faceDown);
        this.updateImage();
        return placedCard;
    }

    putCard(placedCard) {
        this.virtualCards.push(placedCard.virtualCard);
        this.updateImage();
        placedCard.destroy();
    }

    getCardsCount() {
        return this.virtualCards.length();
    }
}