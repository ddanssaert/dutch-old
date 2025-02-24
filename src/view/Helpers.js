export function getTexture(cardModel) {
    if (cardModel.isFaceDown === true) {
        return 'card-back';
    } else {
        return `${cardModel.rank}_${cardModel.value}`;
    }
}