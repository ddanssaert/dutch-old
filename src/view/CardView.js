import { GAME_CONFIG } from "../config";
import BaseCardView from "./BaseCardView";
import { getTexture } from "./Helpers";
import PlayerPosition from "./PlayerPosition";

export default class CardView extends BaseCardView {
    constructor(cardModel, gameView, x, y, isFaceDown=false) {
        super(gameView._scene, x, y, isFaceDown ? 'card-back' : getTexture(cardModel));
        this.gameView = gameView;
        this.cardModel = cardModel;

        gameView._scene.add.existing(this);
        this.setInteractive();
    }

    /**
     * Moves the card to a target position relative to a player's position.
     * @param {number} x - The relative x-coordinate for the target position.
     * @param {number} y - The relative y-coordinate for the target position.
     * @param {number} playerPosition - The player's position (e.g., PlayerPosition.BOTTOM).
     * @returns {Promise} - Resolves when the movement is complete.
     */
    moveTo(x, y, playerView = null) {
        return new Promise((resolve) => {
            const playerPosition = playerView !== null ? playerView._playerPosition : PlayerPosition.BOTTOM;
            const { targetX, targetY, targetRotation } = this.gameView.calculateCoordinatesTransform(x, y, playerPosition, this.rotation);
            const scale = playerView !== null ? playerView.getScale() : GAME_CONFIG.CARD_SCALE;

            this.scene.tweens.add({
                targets: this,
                duration: 500,
                x: targetX,
                y: targetY,
                scaleX: scale,
                scaleY: scale,
                rotation: targetRotation,
                onComplete: () => {
                    resolve(this);
                }
            });
        });
    }

    
    /**
     * Flips the card, taking into account the player's position for rotation.
     * @param {number} playerPosition - The player's position (e.g., PlayerPosition.BOTTOM).
     * @returns {Promise} - Resolves when the flip is complete.
     */
    flip(playerView=null) {
        return new Promise((resolve) => {
            const playerPosition = playerView !== null ? playerView._playerPosition : PlayerPosition.BOTTOM;
            const scale = playerView !== null ? playerView.getScale() : GAME_CONFIG.CARD_SCALE;
            this.scene.tweens.add({
                targets: this,
                scaleX: 0,
                scaleY: scale,
                duration: 200,
                onComplete: () => {
                    // Toggle face-up/face-down state
                    const newTexture = this.isFaceDown ? 'card-back' : getTexture(this.cardModel);
                    this.setTexture(newTexture);

                    // Calculate rotation based on player position
                    const { targetRotation } = this.gameView.calculateCoordinatesTransform(
                        this.x,
                        this.y,
                        playerPosition,
                        this.rotation // Pass the current rotation of the card
                    );

                    this.scene.tweens.add({
                        targets: this,
                        scaleX: scale,
                        scaleY: scale,
                        rotation: this.rotation,
                        duration: 200,
                        onComplete: () => {
                            resolve(this);
                        }
                    });
                },
            });
        });
    }

    destroy() {
        super.destroy();
    }
}