import { GameModeBase } from './GameModeBase.js';
import { AIEngine } from '../ai/AIEngine.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class VsComputerMode extends GameModeBase {
  constructor(context, settings) {
    super(context, settings);
    this.aiEngine = new AIEngine();
    this.playerColor = settings.playerColor || 'w';
    this.difficulty = settings.difficulty || 3;
  }

  start() {
    super.start();

    // 카메라 설정
    if (this.playerColor === 'b') {
      this.cameraController.setBlackView(false);
    } else {
      this.cameraController.setWhiteView(false);
    }

    // AI 수 수신
    const unsub = eventBus.on(EVENTS.AI_MOVE, (data) => this.onAIMove(data));
    this.cleanupFns.push(unsub);

    // AI가 먼저인 경우
    if (this.playerColor !== this.chessGame.getTurn()) {
      this.requestAIMove();
    }
  }

  canSelect(piece) {
    return piece.color === this.playerColor && piece.color === this.chessGame.getTurn();
  }

  onMoveComplete(move) {
    // 플레이어 이동 후 AI 차례
    if (this.chessGame.getTurn() !== this.playerColor && !this.chessGame.isGameOver()) {
      this.inputHandler.setEnabled(false);
      this.requestAIMove();
    }
  }

  requestAIMove() {
    this.aiEngine.search(this.chessGame.getFen(), this.difficulty);
  }

  async onAIMove({ move }) {
    if (!move) return;

    // AI의 수를 실행
    await this.handleMove(move.from, move.to);
  }

  onUndo() {
    // 컴퓨터 대전에서는 2수 (플레이어 + AI) 되돌리기
    if (this.aiEngine.isThinking) {
      this.aiEngine.stop();
    }

    const move1 = this.chessGame.undo(); // AI 수 되돌리기
    const move2 = this.chessGame.undo(); // 플레이어 수 되돌리기

    if (move1 || move2) {
      this.pieceFactory.placeAllPieces(this.chessGame.getBoard());
      this.highlightManager.clearAll();
      this.inputHandler.setEnabled(true);
      this.audioManager.play('move');
    }
  }

  cleanup() {
    this.aiEngine.cleanup();
    super.cleanup();
  }
}
