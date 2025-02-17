import PlacedCard from './PlacedCard.js';
import Deck from './Deck.js';
import Bin from './Bin.js';
import PlayerHand from './PlayerHand.js';
import Player from './Player.js';
import { GAME_CONFIG } from '../config.js';


export default class Game {
    constructor(scene) {
        this.scene = scene;

        this.deck = new Deck(scene, GAME_CONFIG.DECK_POSITION.x, GAME_CONFIG.DECK_POSITION.y);
        this.deck.shuffle();
        this.deck.onClick(() => this.onClickDeck());

        this.bin = new Bin(scene, 200, 400);
        this.bin.onClick(() => this.onClickBin());

        this.hand = new PlayerHand(scene, 150, 600);

        this.player = new Player(scene, 400, 600, this);
    }

    onClickDeck() {
        if (this.deck.hadCard() && !this.hand.hasCard()) {
            this.drawFromDeck();
        }
    }

    onClickBin() {
        if (this.deck.hadCard() && !this.hand.hasCard()) {
            this.drawFromBin();
        } else if (this.hand.hasCard()) {
            this.trashCard();
        }
    }

    onClickHand() {

    }

    onClickPlayerCard(i) {
        if (this.hand.hasCard()) {
            let playerCard = this.player.removeCard(i);
            let playerCardPosition = this.player.getCardPosition(i);
            let handCard = this.hand.removeCard();
            playerCard.flip().then(() => {
                playerCard.move(this.bin).then(() => {
                    this.bin.addCard(playerCard.card);
                    playerCard.destroy();
                    handCard.move(playerCardPosition).then(() => {
                        handCard.flip();
                        this.player.setCard(handCard, i);
                        console.log(`score: ${this.player.getScore()}`);
                    });
                });
            });
        }
    }

    moveCard(card, from, to, flip = false) {
        let texture = card.faceDown ? 'card-back' : card.texture;
        let floatingCard = this.scene.add.image(from.x, from.y, texture, card.faceDown);
        return new Promise((resolve) => {
            this.scene.tweens.add({
                targets: floatingCard,
                duration: 500,
                x: {
                    from: from.x,
                    to: to.x
                },
                y: {
                    from: from.y,
                    to: to.y
                },
                onComplete: () => {
                    resolve(card);
                    (new Promise(resolve => setTimeout(resolve, 100))).then(() => {
                        floatingCard.destroy();
                        if (flip === true) {
                            card.flip();
                        }
                    });
                }
            });
        });
    }

    drawFromDeck() {
        if (this.deck.hadCard() && !this.hand.hasCard()) {
            let card = this.deck.drawCard();
            let placedCard = new PlacedCard(this.scene, this.deck.x, this.deck.y, card, true);
            placedCard.move(this.hand).then(() => {
                placedCard.flip().then(() => {
                    this.hand.setCard(placedCard);
                });
            });
        }
    }

    drawFromBin() {
        if (this.deck.hadCard() && !this.hand.hasCard()) {
            let card = this.bin.drawCard();
            let placedCard = new PlacedCard(this.scene, this.bin.x, this.bin.y, card);
            placedCard.move(this.hand).then(() => {
                this.hand.setCard(placedCard);
            });
        }
    }

    trashCard() {
        if (this.hand.hasCard()) {
            let placedCard = this.hand.removeCard();
            placedCard.move(this.bin).then(() => {
                this.bin.addCard(placedCard.card);
                placedCard.destroy();
            });
        }
    }

    async deal() {
        for (let i = 0; i < 4; i++) {
            let pos = this.player.getNextPosition();
            let newCard = this.deck.drawCard();
            let placedCard = new PlacedCard(this.scene, this.deck.x, this.deck.y, newCard, true);
            console.log(placedCard);
            await placedCard.move(pos);
            this.player.addNextCard(placedCard);
        }
    }

    async showFirstPlayerCards() {
        this.player.getCard(0).flip();
        await this.player.getCard(1).flip();
        // delay
        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause for 100 milliseconds
        this.player.getCard(0).flip();
        await this.player.getCard(1).flip();
    }
}