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

    getScale() {
        const playerConfig = this._isLocal ? GAME_CONFIG.THIS_PLAYER : GAME_CONFIG.OTHER_PLAYER;
        return playerConfig.SCALE;
    }
    
    getHandYOffset() {
        const playerConfig = this._isLocal ? GAME_CONFIG.THIS_PLAYER : GAME_CONFIG.OTHER_PLAYER;
        return playerConfig.HAND_Y_OFFSET;
    }

    getTablePosition(index) {
        const playerConfig = this._isLocal ? GAME_CONFIG.THIS_PLAYER : GAME_CONFIG.OTHER_PLAYER;
        const relativePos = playerConfig.TABLE_START_POSITION;
        const offsetPos = {
            x: relativePos.x + playerConfig.TABLE_X_OFFSET*index,
            y: relativePos.y,
        };
        return {
            x: offsetPos.x*this._scene.sys.canvas.width,
            y: offsetPos.y*this._scene.sys.canvas.height,
        }
    }

    showScore(score) {
        const playerConfig = this._isLocal ? GAME_CONFIG.THIS_PLAYER : GAME_CONFIG.OTHER_PLAYER;
        const relativePos =  {
            x: playerConfig.SCORE_POSITION.x*this._gameView.getTableMinSize(),
            y: playerConfig.SCORE_POSITION.y*this._gameView.getTableMinSize(),
        }
        const {targetX, targetY, targetRotation} = this._gameView.calculateCoordinatesTransform(relativePos.x, relativePos.y, this._playerPosition);
        console.log(targetX, targetY, targetRotation);
        const text = this._scene.add.text(targetX, targetY, `${score}`, {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);
        // text.rotation = targetRotation;
    }
}