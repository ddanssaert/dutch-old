import {
    GAME_CONFIG
} from "../config";
import BinView from "./BinView";
import CardView from "./CardView";
import DeckView from "./DeckView";
import InputEventHandler from "../controller/InputEventHandler";
import PlayerView from "./PlayerView";
import PlayerPosition from "./PlayerPosition";
import Toolbar from "./Toolbar2";
import PlayerTurnPhase from "../model/PlayerTurnPhase";

export default class GameView {
    constructor(model, scene, controller) {
        this._scene = scene;
        this._model = model;
        this._cardsMap = new Map();
        this._inputEventHandler = new InputEventHandler(controller, this);
        this._deckView = new DeckView(model.deck, this, this.getDisplaySize());
        this._binView = new BinView(model.bin, this, this.getDisplaySize());
        // this._deckView.enableHighlight();
        // this._binView.enableHighlight();
        this._playerViews = new Map();
        this._toolbar = new Toolbar(this, this.getDisplaySize());
        this._resetSwapping();
        
    }

    getCardView(cardModel) {
        return this._cardsMap[cardModel.id];
    }

    getPlayerView(playerModel) {
        return this._playerViews[playerModel.id];
    }

    async updateTurnPhase(gameModel) {
        const currentPlayerModel = gameModel.getCurrentPlayer();
        const currentPlayerView = this._playerViews[currentPlayerModel.id];
        if (currentPlayerView._isLocal === true) {
            console.log('updateTurnPhase()');
            const turnPhase = currentPlayerModel.playerTurnPhase;
            // this._toolbar.setButtonEnabled('endturn', turnPhase === PlayerTurnPhase.END);
            // this._toolbar.setButtonEnabled('dutch', turnPhase === PlayerTurnPhase.END);
            this._toolbar.buttons.endturn._setEnabledState(turnPhase === PlayerTurnPhase.END);
            this._toolbar.buttons.dutch._setEnabledState(turnPhase === PlayerTurnPhase.END);
        }
    }

    getCanvasSize() {
        const canvas = this._scene.sys.canvas;
        return {
            width: canvas.width,
            height: canvas.height,
        }
    }

    getTableSize() {
        const canvasSize = this.getCanvasSize();
        return {
            width: canvasSize.width,
            height: canvasSize.height * (1 - GAME_CONFIG.TOOLBAR_HEIGHT),
        }
    }

    getTableMinSize() {
        const {width, height} = this.getTableSize();
        return Math.min(width, height);
    }

    getToolBarSize() {
        const canvasSize = this.getCanvasSize();
        return {
            width: canvasSize.width,
            height: canvasSize.height * GAME_CONFIG.TOOLBAR_HEIGHT,
        }
    }

    getToolBarRegion() {
        const canvasSize = this.getCanvasSize();
        return {
            minX: 0,
            maxX: canvasSize.width,
            minY: canvasSize.height * (1 - GAME_CONFIG.TOOLBAR_HEIGHT),
            maxY: canvasSize.height,
        }
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
            // If no player position is specified, skip transformation
            return {
                targetX: x,
                targetY: y,
                targetRotation: 0,
            }
        }

        const tableSize = this.getTableSize();
        let targetX, targetY;

        const minSize = this.getTableMinSize();
        const widthOffset = (tableSize.width - minSize) / 2;
        const heightOffset = (tableSize.height - minSize) / 2;

        // Calculate absolute coordinates based on player position
        switch (playerPosition) {
            case PlayerPosition.BOTTOM:
                // Bottom player: (x, y) maps to (x, y)
                targetX = widthOffset + x;
                targetY = tableSize.height - y;
                break;
            case PlayerPosition.LEFT:
                // Left player: (x, y) maps to (0, H - y)
                targetX = y;
                targetY = heightOffset + x;
                break;
            case PlayerPosition.TOP:
                // Top player: (x, y) maps to (W - x, H)
                targetX = tableSize.width - widthOffset - x;
                targetY = y;
                break;
            case PlayerPosition.RIGHT:
                // Right player: (x, y) maps to (W, y)
                targetX = tableSize.width - y;
                targetY = tableSize.height - heightOffset - x;
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
        this._deckView.updateTexture();
        await cardView.moveTo(handPosition.x, handPosition.y, this._playerViews[playerModel.id]);
        const playerView = this._playerViews[playerModel.id];
        if (playerView._isLocal === true) {
            this.flipCard(cardModel);
        } else {
            // this.opponentLooksAtCard(playerModel, cardModel, i);
            const targetPos = playerView.getHandPosition();
            targetPos.y = GAME_CONFIG.OTHER_PLAYER.TABLE_START_POSITION.y;
            // targetPos.y -= playerView.getHandYOffset()*this.getTableMinSize();
            await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]);
        }
    }

    async drawCardFromBinToHand(cardModel, playerModel) {
        console.debug('drawCardFromBinToHand()');
        const cardView = this._drawCardFromBin(cardModel);
        const handPosition = this._playerViews[playerModel.id].getHandPosition(playerModel);
        this._binView.updateTexture();
        await cardView.moveTo(handPosition.x, handPosition.y, this._playerViews[playerModel.id]);
    }

    async discardCardToBin(cardModel, flip=false) {
        const cardView = this._cardsMap[cardModel.id];
        await cardView.moveToAbsolute(this._binView.x /*-this._binView._displayOriginX-3*/, this._binView.y, 0, this._binView.scale);
        if (flip) {
            await cardView.flip();
        }
        this._binView.updateTexture();
        cardView.destroy();
        this._cardsMap[cardModel.id] = null;
        this._checkBinTopCard();
    }

    async drawCardFromDeckToTable(cardModel, playerModel, index) {
        console.debug('drawCardFromDeckToHand()');
        const cardView = this._drawCardFromDeck(cardModel);
        const targetPos = this._playerViews[playerModel.id].getTablePosition(index);
        this._deckView.updateTexture();
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]);
        cardView.on('pointerdown', () => this._inputEventHandler.onClickPlayerTableCard(playerModel, cardModel));
        // await cardView.flip();
    }

    async moveToTable(cardModel, playerModel, index) {
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = this._playerViews[playerModel.id].getTablePosition(index);
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]);
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

    async dealCard(playerModel, cardModel) {
        const newIndex = playerModel.getIndexFromTable(cardModel);
        const cardView = this._drawCardFromDeck(cardModel);
        await this.moveToTable(cardModel, playerModel, newIndex);
    }

    async flipCard(cardModel) {
        const cardView = this._cardsMap[cardModel.id];
        await cardView.flip();
    }

    async opponentLooksAtCard(playerModel, cardModel, index) {
        const playerView = this._playerViews[playerModel.id];
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = playerView.getTablePosition(index);
        targetPos.y -= playerView.getHandYOffset()*this.getTableMinSize();
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]);
    }

    async opponentHidesCard(playerModel, cardModel, index) {
        const playerView = this._playerViews[playerModel.id];
        const cardView = this._cardsMap[cardModel.id];
        const targetPos = playerView.getTablePosition(index);
        await cardView.moveTo(targetPos.x, targetPos.y, this._playerViews[playerModel.id]);
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
        // this._toolbar.setButtonEnabled('ready', true);
        this._toolbar.buttons.ready.enable();
    }

    async initToolbar() {
        this._toolbar.buttons.ready.hide();
        this._toolbar.buttons.endturn.show();
        this._toolbar.buttons.dutch.show();
        this._toolbar.buttons.swap.show();
        this._toolbar.update();
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
        // this._toolbar.removeButton('ready');
        this.initToolbar();
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

    async showAllCards(gameModel) {
        const playerModels = gameModel.getPlayers();
        for (let playerModel of playerModels) {
            const playerView = this._playerViews[playerModel.id];
            for (let i = 0; i<playerModel.getTableCardsCount(); i++) {
                const cardModel = playerModel.getCardFromTable(i);
                if (cardModel !== null) {
                    const cardView = this._cardsMap[cardModel.id];
                    cardView.flip(playerView);
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // 2s
    }

    async showScores(gameModel) {
        const playerModels = gameModel.getPlayers();
        for (let playerModel of playerModels) {
            const playerView = this._playerViews[playerModel.id];
            const playerScore = playerModel.getScore();
            console.log(playerScore);
            playerView.showScore(playerScore);
        }
    }

    async _checkBinTopCard() {
        const topCardValue = this._model.bin.getTopCard().value;
        const playerModel = this._model.getCurrentPlayer();
        const playerView = this._playerViews[playerModel.id];
        if (playerView._isLocal === true) {
            if (topCardValue == 11) {
                // JACK
                // this._toolbar.setButtonEnabled('swap', true);
                this._toolbar.buttons.swap.enable();
            }
        }
    }

    async endTurn() {
        // this._toolbar.setButtonEnabled('swap', false);
        this._toolbar.buttons.swap.disable();
    }

    async startSwapEffect() {
        this._isSwapping = true;
    }

    _resetSwapping() {
        this._isSwapping = false;
        this._ownSwapCard = null;
        this._otherSwapCard = null;
        this._otherSwapPlayerModel = null;
    }

    async swapCards(ownCardModel, otherCardModel, otherPlayerModel) {
        const ownCardView = this.getCardView(ownCardModel);
        const otherCardView = this.getCardView(otherCardModel);
        const ownCardViewX = ownCardView.x;
        const ownCardViewY = ownCardView.y;
        const ownCardViewRot = ownCardView.rotation;
        const ownCardViewScale = ownCardView.scale;
        ownCardView.moveToAbsolute(otherCardView.x, otherCardView.y, otherCardView.rotation, otherCardView.scale);
        await otherCardView.moveToAbsolute(ownCardViewX, ownCardViewY, ownCardViewRot, ownCardViewScale);
        ownCardView.removeAllListeners('pointerdown');
        otherCardView.removeAllListeners('pointerdown');
        otherCardView.on('pointerdown', () => this._inputEventHandler.onClickPlayerTableCard(this._model.getCurrentPlayer(), otherCardModel));
        ownCardView.on('pointerdown', () => this._inputEventHandler.onClickPlayerTableCard(otherPlayerModel, ownCardModel));
        this._resetSwapping();
    }

    /* REFACTOR */
    update(displaySize) {
        this._toolbar.updateLayout(displaySize);
        this._deckView.updateLayout(displaySize);
        this._binView.updateLayout(displaySize);
    }

    getDisplaySize() {
        return this._scene.scale.displaySize;
    }
}