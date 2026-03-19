import { GameModeBase } from './GameModeBase.js';

export class LocalMultiplayerMode extends GameModeBase {
  constructor(context, settings) {
    super(context, settings);
  }

  start() {
    super.start();
    this.cameraController.setWhiteView(false);
  }

  canSelect(piece) {
    return piece.color === this.chessGame.getTurn();
  }

  onMoveComplete(move) {
    // 카메라 자동 회전 (설정에서 켜진 경우)
    const settings = this.storageManager.getSettings();
    if (settings.autoRotateCamera) {
      const turn = this.chessGame.getTurn();
      if (turn === 'w') {
        this.cameraController.setWhiteView(true);
      } else {
        this.cameraController.setBlackView(true);
      }
    }
  }
}
