import { GAME_CONFIG } from "../config";
import Button from "./Button";

export default class Toolbar extends Phaser.GameObjects.Container {
    constructor(gameView, displaySize) {
        super(gameView._scene);
        this._displaySize = displaySize;
        this._gameView = gameView;
        this.createToolbar();
        this.updateLayout(displaySize);
        gameView._scene.add.existing(this);
    }

    createToolbar() {
        this.buttons = {
            ready: new Button(this._gameView._scene, 0, 0, 'button_ready', () => this._gameView._inputEventHandler.onClickReady(), false, true),
            endturn: new Button(this._gameView._scene, 0, 0, 'button_endturn', () => this._gameView._inputEventHandler.onClickEndturn(), false, false),
            dutch: new Button(this._gameView._scene, 0, 0, 'button_dutch', () => this._gameView._inputEventHandler.onClickDutch(), false, false),
            swap: new Button(this._gameView._scene, 0, 0, 'button_swap', () => this._gameView._inputEventHandler.onClickSwap(), false, false),
        };
        for (let button of Object.values(this.buttons)) {
            this.add(button);
        }
    }

    update() {
        const xPadding = Math.max(GAME_CONFIG.TOOLBAR.MAX_X_PADDING, GAME_CONFIG.TOOLBAR.RELATIVE_X_PADDING*this.height);
        const yPadding = Math.max(GAME_CONFIG.TOOLBAR.MAX_Y_PADDING, GAME_CONFIG.TOOLBAR.RELATIVE_Y_PADDING*this.height);
        const buttonSize = this.height - yPadding*2;
        const visibleButtons = this.getAll('visible', true);
        const buttonCount = visibleButtons.length;
        const toolbarWidth = buttonSize*buttonCount + xPadding*(buttonCount-1);
        const xOffset = toolbarWidth / buttonCount;
        for (let i=0; i<buttonCount; ++i) {
            const button = visibleButtons[i];
            button.updateScale(buttonSize);
            button.x = -toolbarWidth/2 + buttonSize/2 + xOffset*i;
            button.y = 0;
        }
    }

    updateLayout(displaySize) {
        this._displaySize = displaySize;
        const toolbarHeight = Math.min(GAME_CONFIG.TOOLBAR.MAX_HEIGHT, GAME_CONFIG.TOOLBAR.RELATIVE_HEIGHT*displaySize.height);
        this.setPosition(displaySize.width/2, displaySize.height - toolbarHeight/2);
        this.setSize(displaySize.width, toolbarHeight);
        this.update();
    }
}