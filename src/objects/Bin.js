import StackedCardSlot from './StackedCardSlot.js';


export default class Bin extends StackedCardSlot {
    constructor(game, x, y) {
        super(game, x, y, false);

        this.addImage((c) => c.virtualCard.texture, (c) => 'card-blank', () => this.game.drawCardFromBin());
    }
}