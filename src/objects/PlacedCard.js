export default class PlacedCard extends Phaser.GameObjects.Image {
    constructor(scene, x, y, card, faceDown = false) {
        super(scene, x, y, faceDown ? 'card-back' : card.texture);
        this.scene = scene;
        this.x = x;
        this.y = y;

        scene.add.existing(this);
        this.setInteractive();

        this.card = card;
        this.faceDown = faceDown;
    }

    move(to) {
        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: this,
                duration: 500,
                x: {
                    from: this.x,
                    to: to.x
                },
                y: {
                    from: this.y,
                    to: to.y
                },
                onComplete: () => {
                    resolve(this.card);
                }
            });
        });
    }

    flip() {
        return new Promise((resolve) => {
            this.faceDown = !this.faceDown;
            this.scene.tweens.add({
                targets: this,
                scaleX: 0,
                duration: 200,
                onComplete: () => {
                    this.setTexture(this.faceDown ? 'card-back' : this.card.texture);
                    this.scene.tweens.add({
                        targets: this,
                        scaleX: 1,
                        duration: 200,
                        onComplete: () => {
                            resolve(this.card);
                        }
                    });
                },
            });
        });
    }
}