import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class GameModeBase {
  constructor(context, settings = {}) {
    this.chessGame = context.chessGame;
    this.sceneManager = context.sceneManager;
    this.boardRenderer = context.boardRenderer;
    this.pieceFactory = context.pieceFactory;
    this.inputHandler = context.inputHandler;
    this.highlightManager = context.highlightManager;
    this.animationManager = context.animationManager;
    this.particleSystem = context.particleSystem;
    this.cameraController = context.cameraController;
    this.uiManager = context.uiManager;
    this.audioManager = context.audioManager;
    this.storageManager = context.storageManager;
    this.settings = settings;
    this.cleanupFns = [];
  }

  start() {
    // 기물 클릭 이벤트 연결
    const unsub1 = eventBus.on(EVENTS.PIECE_SELECT, (data) => this.onPieceSelect(data));
    const unsub2 = eventBus.on(EVENTS.PIECE_CAPTURED, (data) => this.onPieceCaptured(data));
    const unsub3 = eventBus.on(EVENTS.UNDO_MOVE, () => this.onUndo());

    this.cleanupFns.push(unsub1, unsub2, unsub3);

    this.inputHandler.setEnabled(true);
    this.inputHandler.setOnMove((from, to) => this.handleMove(from, to));

    this.audioManager.play('gamestart');
  }

  onPieceSelect({ square }) {
    const piece = this.chessGame.getPiece(square);
    if (!piece) return;
    if (!this.canSelect(piece)) return;

    const moves = this.chessGame.getValidMoves(square);
    this.inputHandler.setValidMoves(moves);
    this.highlightManager.clearSelection();
    this.highlightManager.showSelected(square);
    this.highlightManager.showValidMoves(moves);
  }

  canSelect(piece) {
    return piece.color === this.chessGame.getTurn();
  }

  async handleMove(from, to) {
    // 프로모션 확인
    let promotion = null;
    if (this.chessGame.needsPromotion(from, to)) {
      const piece = this.chessGame.getPiece(from);
      promotion = await this.uiManager.showPromotionDialog(piece.color);
    }

    // 잡히는 기물 확인 (애니메이션 전)
    const targetPiece = this.chessGame.getPiece(to);
    const movingPiece = this.chessGame.getPiece(from);
    const isEnPassant = movingPiece?.type === 'p' && from[0] !== to[0] && !targetPiece;

    // 로직 실행
    const move = this.chessGame.makeMove(from, to, promotion);
    if (!move) {
      this.audioManager.play('illegal');
      return;
    }

    // 입력 비활성화 (애니메이션 중)
    this.inputHandler.setEnabled(false);
    this.highlightManager.clearSelection();

    // 잡기 처리
    if (move.captured) {
      const capturedSquare = isEnPassant ?
        (to[0] + from[1]) : to;
      const capturedMesh = this.pieceFactory.getPieceMesh(capturedSquare);

      if (capturedMesh) {
        const pos = capturedMesh.position.clone();
        const geo = capturedMesh.geometry;
        const color = capturedMesh.userData.color;

        // 파티클 이펙트
        this.particleSystem.explodePiece(pos, geo, color);
        this.pieceFactory.removePiece(capturedSquare);
        this.audioManager.play('capture');
      }
    }

    // 이동 애니메이션
    const fromPos = this.boardRenderer.getSquarePosition(from);
    const toPos = this.boardRenderer.getSquarePosition(to);
    const pieceMesh = this.pieceFactory.getPieceMesh(from);

    if (pieceMesh) {
      await this.animationManager.animateMove(pieceMesh, fromPos, toPos);
      // 내부 데이터 업데이트
      this.pieceFactory.pieces.delete(from);
      this.pieceFactory.pieces.set(to, pieceMesh);
      pieceMesh.userData.square = to;
    }

    // 캐슬링 룩 이동
    if (move.flags.includes('k') || move.flags.includes('q')) {
      this.handleCastling(move);
      this.audioManager.play('castle');
    } else if (!move.captured) {
      this.audioManager.play('move');
    }

    // 프로모션 기물 교체
    if (move.promotion) {
      this.pieceFactory.removePiece(to);
      this.pieceFactory.placePiece(move.promotion, move.color, to);
      this.audioManager.play('promote');
    }

    // 앙파상으로 잡힌 폰 처리 (이미 위에서 처리)

    // 하이라이트: 마지막 이동
    this.highlightManager.showLastMove(from, to);

    // 체크 하이라이트
    if (this.chessGame.isCheck()) {
      const board = this.chessGame.getBoard();
      const turn = this.chessGame.getTurn();
      // 킹 위치 찾기
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p && p.type === 'k' && p.color === turn) {
            const files = 'abcdefgh';
            const kingSquare = files[c] + (8 - r);
            this.highlightManager.showCheck(kingSquare);
            break;
          }
        }
      }
      this.audioManager.play('check');
    }

    if (this.chessGame.isCheckmate()) {
      this.audioManager.play('checkmate');
    }

    // 입력 재활성화
    this.inputHandler.setEnabled(true);

    // 모드별 후속 처리
    this.onMoveComplete(move);
  }

  handleCastling(move) {
    let rookFrom, rookTo;
    if (move.flags.includes('k')) {
      // 킹사이드
      rookFrom = move.color === 'w' ? 'h1' : 'h8';
      rookTo = move.color === 'w' ? 'f1' : 'f8';
    } else {
      // 퀸사이드
      rookFrom = move.color === 'w' ? 'a1' : 'a8';
      rookTo = move.color === 'w' ? 'd1' : 'd8';
    }

    const rookMesh = this.pieceFactory.getPieceMesh(rookFrom);
    if (rookMesh) {
      const rookToPos = this.boardRenderer.getSquarePosition(rookTo);
      const rookFromPos = this.boardRenderer.getSquarePosition(rookFrom);
      this.animationManager.animateMove(rookMesh, rookFromPos, rookToPos);
      this.pieceFactory.pieces.delete(rookFrom);
      this.pieceFactory.pieces.set(rookTo, rookMesh);
      rookMesh.userData.square = rookTo;
    }
  }

  onMoveComplete(move) {
    // 서브클래스에서 오버라이드
  }

  onPieceCaptured(data) {
    // 서브클래스에서 오버라이드 가능
  }

  onUndo() {
    const move = this.chessGame.undo();
    if (!move) return;

    // 보드를 현재 상태로 리셋
    this.pieceFactory.placeAllPieces(this.chessGame.getBoard());
    this.highlightManager.clearAll();

    // 마지막 이동 하이라이트 복원
    const history = this.chessGame.getMoveHistory();
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      this.highlightManager.showLastMove(lastMove.from, lastMove.to);
    }

    this.audioManager.play('move');
  }

  cleanup() {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
    this.inputHandler.setEnabled(false);
    this.inputHandler.setOnMove(null);
    this.highlightManager.clearAll();
  }
}
