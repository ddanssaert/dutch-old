import { GAME_CONFIG } from "../config";
import PlayerPosition from "./PlayerPosition";

export default class PlayerView {
    constructor(gameView, playerPosition=PlayerPosition.BOTTOM, isLocal=false) {
        this._gameView = gameView;
        this._scene = gameView._scene;
        this._playerPosition = playerPosition;
        this._isLocal = isLocal;

        const handPosition = this.getHandPosition();
        const absoluteHandPosition = gameView.calculateCoordinatesTransform(handPosition.x, handPosition.y, this._playerPosition);
        //const handImage = this._scene.add.image(absoluteHandPosition.targetX, absoluteHandPosition.targetY, 'card-highlight');
        //handImage.rotation = absoluteHandPosition.targetRotation;
        //handImage.scale = GAME_CONFIG.CARD_SCALE;
    }

    getHandPosition() {
        return {
            x: GAME_CONFIG.PLAYER_HAND_POSITION.x*this._scene.sys.canvas.width,
            y: GAME_CONFIG.PLAYER_HAND_POSITION.y*this._scene.sys.canvas.height,
        }
    }

    getTablePosition(index) {
        const relativePos = GAME_CONFIG.PLAYER_TABLE_START_POSITION;
        const offsetPos = {
            x: relativePos.x + GAME_CONFIG.PLAYER_TABLE_X_OFFSET*index,
            y: relativePos.y,
        };
        return {
            x: offsetPos.x*this._scene.sys.canvas.width,
            y: offsetPos.y*this._scene.sys.canvas.height,
        }
    }
}