export default class PlacedCard extends Phaser.GameObjects.Image {
    constructor(scene, x, y, virtualCard, faceDown = false) {
        super(scene, x, y, faceDown ? 'card-back' : virtualCard.texture);
        this.scene = scene;
        this.x = x;
        this.y = y;

        scene.add.existing(this);
        this.setInteractive();

        this.virtualCard = virtualCard;
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
                    resolve(this.virtualCard);
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
                    this.setTexture(this.faceDown ? 'card-back' : this.virtualCard.texture);
                    this.scene.tweens.add({
                        targets: this,
                        scaleX: 1,
                        duration: 200,
                        onComplete: () => {
                            resolve(this.virtualCard);
                        }
                    });
                },
            });
        });
    }
}