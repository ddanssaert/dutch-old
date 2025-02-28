export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, onClickHandler, enabled=true, visible=true) {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        this.setInteractive();

        this._setEnabledState(enabled);
        this._setVisibleState(visible);

        this.on('pointerdown', () => {
            if (this.enabled) {
                onClickHandler();
            }
        });
        this.setOrigin(0.5, 0.5);
    }

    updateScale(height) {
        const scale = height / 128;
        this.setScale(scale);
    }

    _setEnabledState(enabled) {
        this.enabled = enabled;
        this.setAlpha(enabled ? 1 : 0.5); // Visual feedback for disabled state
    }

    enable() {
        this._setEnabledState(true);
    }

    disable() {
        this._setEnabledState(false);
    }

    _setVisibleState(visible) {
        this.visible = visible;
        this.setVisible(visible);
    }

    show() {
        this._setVisibleState(true);
    }

    hide() {
        this._setVisibleState(false);
    }
}
