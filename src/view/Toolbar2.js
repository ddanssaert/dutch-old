import Button from "./Button";

export default class Toolbar extends Phaser.GameObjects.Container {
    constructor(gameView, position, size) {
        super(gameView._scene, position.x, position.y);
        this.setSize(size.width, size.height);
        gameView._scene.add.existing(this);
        this._gameView = gameView;
        this.createToolbar();
        this.updateLayout(position, size);
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
        const xPadding = 25;
        const yPadding = 20;
        const buttonSize = this.height - yPadding*2;
        const visibleButtons = this.getAll('visible', true);
        const buttonCount = visibleButtons.length;
        const toolbarWidth = buttonSize*buttonCount + xPadding*(buttonCount-1);
        console.log(buttonSize);
        console.log(toolbarWidth);
        const xOffset = toolbarWidth / buttonCount;
        for (let i=0; i<buttonCount; ++i) {
            const button = visibleButtons[i];
            button.updateScale(buttonSize);
            button.x = -toolbarWidth/2 + buttonSize/2 + xOffset*i;
            console.log(button.x);
            button.y = 0;
        }
    }

    updateLayout(position, size) {
        this.setPosition(position.x, position.y);
        this.setSize(size.width, size.height);
        this.update();
    }
}