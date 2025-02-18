import { GAME_CONFIG } from "../config";
import PlayerPosition from "./PlayerPosition";

export default class BasePlayer {
    constructor(name, game, playerPosition) {
        this.name = name;
        this.game = game;
        this.playerPosition = playerPosition;
        this.canvas = this.game.scene.game.canvas;
    }

    transformPosition(pos) {
        if (this.playerPosition == PlayerPosition.BOTTOM) {
            return {
                x: pos.x,
                y: this.canvas.height - pos.y,
            };
        }
    }

    getPlayerHandPosition() {
        return this.transformPosition(GAME_CONFIG.RELATIVE_HAND_POSITION);
    }

    getPlayerTablePosition(index) {
        const centerPos = this.transformPosition(GAME_CONFIG.RELATIVE_PLAYER_TABLE_CENTER_POSITION);
        const tableWidth = GAME_CONFIG.PLAYER_TABLE_WIDTH;
        const offset = (tableWidth / 4) * (index - 1.5);
        return {
            x: centerPos.x + offset,
            y: centerPos.y,
        }
    }

    /* PLAYER HAND */
    hasCardInHand() {
    }

    drawCardFromDeck() {
    }

    drawCardFromBin() {
    }

    discardCardInHand() {
    }

    swapCardFromHand() {
    }

    /* PLAYER TABLE */
    getOwnedCardsCount() {
    }

    getOwnedCard(index) {        
    }

    dealCard(card) {
    }

    discardOwnedCard(index) {
    }

    swapCardWithPlayer(thisIndex, otherPlayer, otherIndex) {
    }

    getScore() {
    }
}