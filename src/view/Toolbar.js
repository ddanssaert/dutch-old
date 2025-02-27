export default class Toolbar {
    constructor(gameView) {
        this.gameView = gameView;
        this.scene = gameView._scene;
        this.buttons = new Map(); // Use a Map to store buttons by name
        this.grid = null;
        this.createToolbar();
    }

    createToolbar() {
        const toolbarRegion = this.gameView.getToolBarRegion();
        const toolbarWidth = toolbarRegion.maxX - toolbarRegion.minX;
        const toolbarHeight = toolbarRegion.maxY - toolbarRegion.minY;

        // Create a grid to manage the layout of buttons
        this.grid = this.scene.add.grid(
            toolbarRegion.minX + (toolbarRegion.maxX - toolbarRegion.minX) / 2, // Center X
            toolbarRegion.minY + toolbarHeight / 2, // Center Y
            toolbarWidth, // Width
            toolbarHeight, // Height
            toolbarWidth/5, // Number of rows
            toolbarHeight, // Number of columns (will be dynamically set)
            // Phaser.Display.Color.HexStringToColor('#333333').color // Background color
        );

        /*this.grid.setAltFillStyle(Phaser.Display.Color.HexStringToColor('#444444').color);
        this.grid.setOutlineStyle(Phaser.Display.Color.HexStringToColor('#555555').color);*/
    }

    addButton(name, imageKey, text, onClick) {
        const button = this.scene.add.sprite(0, 0, imageKey).setInteractive();
        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Store the button by name
        this.buttons.set(name, {
            button,
            text: buttonText,
            onClick,
            enabled: true,
            visible: true
        });
        this.updateButtonLayout();

        // Set up the click handler
        button.on('pointerdown', () => {
            const btnData = this.buttons.get(name);
            if (btnData.enabled && btnData.visible) {
                onClick();
            }
        });
    }

    removeButton(name) {
        const btnData = this.buttons.get(name);
        if (btnData) {
            btnData.button.destroy();
            btnData.text.destroy();
        } 
        this.buttons.delete(name);
        this.updateButtonLayout();
    }

    updateButtonLayout() {
        const numButtons = this.buttons.size;
        const toolbarRegion = this.gameView.getToolBarRegion();
        const buttonWidth = (toolbarRegion.maxX - toolbarRegion.minX) / numButtons;

        let index = 0;
        this.buttons.forEach((btnData, name) => {
            const x = toolbarRegion.minX + buttonWidth * (index + 0.5);
            const y = toolbarRegion.minY + (toolbarRegion.maxY - toolbarRegion.minY) / 2;

            btnData.button.setPosition(x, y);
            btnData.text.setPosition(x, y + 30); // Adjust text position below the button
            index++;
        });
    }

    setButtonEnabled(name, enabled) {
        const btnData = this.buttons.get(name);
        if (btnData) {
            btnData.enabled = enabled;
            btnData.button.setAlpha(enabled ? 1 : 0.5); // Visual feedback for disabled state
        }
    }

    setButtonVisible(name, visible) {
        const btnData = this.buttons.get(name);
        if (btnData) {
            btnData.visible = visible;
            btnData.button.setVisible(visible);
            btnData.text.setVisible(visible);
        }
        this.updateButtonLayout(); // Re-layout buttons when visibility changes
    }
}