import {
    GAME_CONFIG
} from "../config";
import BinView from "./BinView";
import CardView from "./CardView";
import DeckView from "./DeckView";
import InputEventHandler from "../controller/InputEventHandler";
import PlayerView from "./PlayerView";
import PlayerPosition from "./PlayerPosition";

export default class GameView {
    constructor(model, scene, controller) {
        this._scene = scene;
        this._model = model;
        this._cardsMap = new Map();
        this._inputEventHandler = new InputEventHandler(controller);
        this._deckView = new DeckView(model.deck, this, GAME_CONFIG.DECK_POSITION.x * scene.sys.canvas.width, GAME_CONFIG.DECK_POSITION.y * scene.sys.canvas.height);
        this._binView = new BinView(model.bin, this, GAME_CONFIG.BIN_POSITION.x * scene.sys.canvas.width, GAME_CONFIG.BIN_POSITION.y * scene.sys.canvas.height);
        // this._deckView.enableHighlight();
        // this._binView.enableHighlight();
        // this._playerView = new PlayerView(this, PlayerPosition.BOTTOM);
        this._playerViews = new Map();
    }

    /**
     * Transforms relative coordinates and rotation into absolute coordinates and target rotation.
     * @param {number} x - The relative x-coordinate.
     * @param {number} y - The relative y-coordinate.
     * @param {number} playerPosition - The player's position (e.g., PlayerPosition.BOTTOM).
     * @param {number} [rotation=0] - The current rotation of the card (defaults to 0).
     * @returns {Object} - An object containing the absolute x, y, and target rotation.
     */
    calculateCoordinatesTransform(x, y, playerPosition = null, rotation = 0) {
        if (playerPosition === null || playerPosition === undefined) {
            // If no player position is specified, orient the card upright
            playerPosition = PlayerPosition.BOTTOM;
        }

        const canvas = this._scene.sys.canvas;
        let targetX, targetY;

        const minSize = Math.min(canvas.width, canvas.height);
        const widthOffset = (canvas.width - minSize) / 2;
        const heightOffset = (canvas.height - minSize) / 2;

        // Calculate absolute coordinates based on player position
        switch (playerPosition) {
            case PlayerPosition.BOTTOM:
                // Bottom player: (x, y) maps to (x, y)
                targetX = widthOffset + x;
                targetY = canvas.height - y;
                break;
            case PlayerPosition.LEFT:
                // Left player: (x, y) maps to (0, H - y)
                targetX = y;
                targetY = heightOffset + x;
                break;
            case PlayerPosition.TOP:
                // Top player: (x, y) maps to (W - x, H)
                targetX = canvas.width - widthOffset - x;
                targetY = y;
                break;
            case PlayerPosition.RIGHT:
                // Right player: (x, y) maps to (W, y)
                targetX = canvas.width - y;
                targetY = canvas.height - heightOffset - x;
                break;
            default:
                // Default (no player position): (x, y) maps to (x, y)
                targetX = x;
                targetY = y;
                break;
        }

        // Define rotations for each player position (in radians)
        const rotations = [
            0, // BOTTOM
            Phaser.Math.DegToRad(90), // LEFT
            Phaser.Math.DegToRad(0), // TOP
            Phaser.Math.DegToRad(90) // RIGHT
        ];

        // Calculate the difference between the target rotation and the current rotation
        const desiredRotation = rotations[playerPosition]; // Desired rotation for the player
        let targetRotation = desiredRotation % Phaser.Math.DegToRad(180);

        return {
            targetX,
            targetY,
            targetRotation
        };
    }

    _drawCardFromDeck(cardModel) {
        const cardView = new CardView(cardModel, this, this._deckView.x, this._deckView.y, true);
        this._cardsMap[cardModel.id] = cardView;
        return cardView;
    }

    _drawCardFromBin(cardModel) {
        const cardView = new CardView(cardModel, this, this._binView.x, this._binView.y);
        this._cardsMap[cardModel.id] = cardView;
        return cardView;
    }

    async drawCardFromDeckToHand(cardModel, playerModel) {
        console.debug('drawCardFromDeckToHand()');
        const cardView = this._drawCardFromDeck(cardModel);
        const handPosition = this._playerViews[playerModel.id].getHandPosition(playerModel);
        this._deckView.update();
        await cardView.moveTo(handPosition.x, handPosition.y, this._playerViews[playerModel.id]._playerPosition);
        await cardView.flip();
    }

    async drawCardFromBinToHand(cardModel, playerModel) {
        console.debug('drawCardFromBinToHand()');
        const cardView = this._drawCardFromBin(cardModel);
        const handPosition = this._playerViews[playerModel.id].getHandPosition(playerModel);
        this._binView.update();
        await cardView.moveTo(handPosition.x, handPosition.y, this._playerViews[playerModel.id]._playerPosition);
    }

    async discardCardToBin(cardModel, flip=false) {
        const cardView = this._cardsMap[cardModel.id];
        await cardView.moveTo(this._binView.x, this._binView.y);
        if (flip) {
            await cardView.flip();
        }
        this._binView.update();
        cardView.destroy();
        this._cardsMap[cardModel.id] = null;
    }

    async drawCardFromDeckToTable(cardModel, playerModel, index) {
        console.debug('drawCardFromDeckToHand()');
        const cardView = this._drawCardFromDeck(cardModel);
        const targetPos = this._playerViews[playerModel.id].getTablePosition(index);
        this._deckView.update();
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]._playerPosition);
        cardView.on('pointerdown', () => this._inputEventHandler.onClickPlayerTableCard(playerModel, cardModel));
        // await cardView.flip();
    }

    async moveToTable(cardModel, playerModel, index) {
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = this._playerViews[playerModel.id].getTablePosition(index);
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]._playerPosition);
        cardView.on('pointerdown', () => this._inputEventHandler.onClickPlayerTableCard(playerModel, cardModel));
    }

    async dealCards(gameModel) {
        for (let i=0; i<4; i++) {
            for (let playerModel of gameModel.players) {
                const cardModel = playerModel.getCardFromTable(i);
                const cardView = this._drawCardFromDeck(cardModel);
                await this.moveToTable(cardModel, playerModel, i);
            }
        }
    }

    async flipCard(cardModel) {
        const cardView = this._cardsMap[cardModel.id];
        await cardView.flip();
    }

    async opponentLooksAtCard(playerModel, cardModel, index) {
        const playerView = this._playerViews[playerModel.id];
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = playerView.getTablePosition(index);
        targetPos.y -= 100;
        await cardView.moveTo(targetPos.x, targetPos.y, playerView._playerPosition);
    }

    async opponentHidesCard(playerModel, cardModel, index) {
        const playerView = this._playerViews[playerModel.id];
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = playerView.getTablePosition(index);
        await cardView.moveTo(targetPos.x, targetPos.y, playerView._playerPosition);
    }

    async showFirstPlayerCards(gameModel) {
        for (let i=0; i<2; i++) {
            for (let playerModel of gameModel.players) {
                const playerView = this._playerViews[playerModel.id];
                const cardModel = playerModel.getCardFromTable(i);
                if (playerView._isLocal === true) {
                    this.flipCard(cardModel);
                } else {
                    this.opponentLooksAtCard(playerModel, cardModel, i);
                }
            }
        }
    }

    async hideFirstPlayerCards(gameModel) {
        for (let i=0; i<2; i++) {
            for (let playerModel of gameModel.players) {
                const playerView = this._playerViews[playerModel.id];
                const cardModel = playerModel.getCardFromTable(i);
                if (playerView._isLocal === true) {
                    this.flipCard(cardModel);
                } else {
                    this.opponentHidesCard(playerModel, cardModel, i);
                }
            }
        }
    }

    async initPlayers(gameModel) {
        const playerModels = gameModel.getPlayers();
        for (let i=0; i<playerModels.length; i++) {
            const playerModel = playerModels[i];
            const playerPosition = (playerModels.length==2 && i===1) ? PlayerPosition.TOP : i;
            let playerView = new PlayerView(this, playerPosition, i===0);
            this._playerViews[playerModel.id] = playerView;
        }
    }
}