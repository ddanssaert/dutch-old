export default class ComputerPlayer {
    static async playTurn(controller, playerModel) {
        await controller.drawCardFromDeck();
        const nCards = playerModel.getTableCardsCount();
        const cardIndex = Math.floor(Math.random()*nCards);
        const cardModel = playerModel.getCardFromTable(cardIndex);
        await controller.swapHandToTable(playerModel, cardModel);
        await controller.endPlayerTurn();
    }
}