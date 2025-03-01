import { GAME_CONFIG } from "../config";
import PlayerPosition from "./PlayerPosition";

export default class PlayerView {
    constructor(gameView, playerPosition=PlayerPosition.BOTTOM, displaySize, isLocal=false) {
        this._gameView = gameView;
        this._scene = gameView._scene;
        this._playerPosition = playerPosition;
        this._isLocal = isLocal;
        this.updateLayout(displaySize);
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
            x: relativePos.x + playerConfig.TABLE_X_OFFSET * Math.floor(index/2),
            y: relativePos.y + playerConfig.TABLE_Y_OFFSET * (index%2),
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

    updateLayout(displaySize) {
        const minSize = Math.min(displaySize.width, displaySize.height);
        const maxSize = Math.max(displaySize.width, displaySize.height);
        const finalSize = (maxSize - 2*minSize);
        console.log(minSize, maxSize, finalSize);
        this.playerRegion = {
            minX: 0,
        };
    }
}