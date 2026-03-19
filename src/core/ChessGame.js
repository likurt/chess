import { Chess } from 'chess.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS, PIECE_VALUES } from '../utils/Constants.js';

export class ChessGame {
  constructor() {
    this.chess = new Chess();
    this.capturedPieces = { w: [], b: [] };
    this.moveHistory = [];
  }

  newGame(fen) {
    if (fen) {
      this.chess = new Chess(fen);
    } else {
      this.chess = new Chess();
    }
    this.capturedPieces = { w: [], b: [] };
    this.moveHistory = [];
  }

  makeMove(from, to, promotion) {
    const moveObj = { from, to };
    if (promotion) {
      moveObj.promotion = promotion;
    }

    // 잡기 전에 대상 기물 확인
    const targetSquare = this.chess.get(to);
    const isEnPassant = this.chess.get(from)?.type === 'p' &&
      from[0] !== to[0] && !targetSquare;

    const move = this.chess.move(moveObj);
    if (!move) return null;

    // 잡힌 기물 처리
    if (move.captured) {
      const capturedColor = move.color === 'w' ? 'b' : 'w';
      this.capturedPieces[capturedColor].push(move.captured);

      eventBus.emit(EVENTS.PIECE_CAPTURED, {
        piece: move.captured,
        color: capturedColor,
        square: isEnPassant ? (from[0] + to[1] === '3' ? '4' : '3') : to,
        capturedBy: move.color,
        isEnPassant
      });
    }

    this.moveHistory.push(move);

    // 이동 완료 이벤트
    const gameState = this.getGameState();
    eventBus.emit(EVENTS.MOVE_COMPLETE, {
      move,
      fen: this.chess.fen(),
      ...gameState
    });

    // 게임 종료 확인
    if (gameState.isGameOver) {
      eventBus.emit(EVENTS.GAME_OVER, {
        result: gameState.result,
        reason: gameState.reason
      });
    }

    return move;
  }

  getValidMoves(square) {
    return this.chess.moves({ square, verbose: true });
  }

  getAllValidMoves() {
    return this.chess.moves({ verbose: true });
  }

  getBoard() {
    return this.chess.board();
  }

  getFen() {
    return this.chess.fen();
  }

  getTurn() {
    return this.chess.turn();
  }

  isCheck() {
    return this.chess.isCheck();
  }

  isCheckmate() {
    return this.chess.isCheckmate();
  }

  isStalemate() {
    return this.chess.isStalemate();
  }

  isDraw() {
    return this.chess.isDraw();
  }

  isGameOver() {
    return this.chess.isGameOver();
  }

  isThreefoldRepetition() {
    return this.chess.isThreefoldRepetition();
  }

  isInsufficientMaterial() {
    return this.chess.isInsufficientMaterial();
  }

  getGameState() {
    const state = {
      isCheck: this.chess.isCheck(),
      isCheckmate: this.chess.isCheckmate(),
      isStalemate: this.chess.isStalemate(),
      isDraw: this.chess.isDraw(),
      isGameOver: this.chess.isGameOver(),
      turn: this.chess.turn(),
      result: null,
      reason: null
    };

    if (state.isCheckmate) {
      state.result = state.turn === 'w' ? 'black_wins' : 'white_wins';
      state.reason = '체크메이트';
    } else if (state.isStalemate) {
      state.result = 'draw';
      state.reason = '스테일메이트';
    } else if (this.chess.isThreefoldRepetition()) {
      state.result = 'draw';
      state.reason = '3회 반복';
    } else if (this.chess.isInsufficientMaterial()) {
      state.result = 'draw';
      state.reason = '기물 부족';
    } else if (this.chess.isDraw()) {
      state.result = 'draw';
      state.reason = '50수 규칙';
    }

    return state;
  }

  undo() {
    const move = this.chess.undo();
    if (move) {
      // 잡힌 기물 복원
      if (move.captured) {
        const capturedColor = move.color === 'w' ? 'b' : 'w';
        const idx = this.capturedPieces[capturedColor].lastIndexOf(move.captured);
        if (idx !== -1) {
          this.capturedPieces[capturedColor].splice(idx, 1);
        }
      }
      this.moveHistory.pop();
    }
    return move;
  }

  getPiece(square) {
    return this.chess.get(square);
  }

  getCapturedPieces() {
    return this.capturedPieces;
  }

  getMoveHistory() {
    return this.moveHistory;
  }

  getMaterialAdvantage() {
    let whiteValue = 0;
    let blackValue = 0;
    const board = this.chess.board();
    for (const row of board) {
      for (const piece of row) {
        if (piece) {
          const val = PIECE_VALUES[piece.type] || 0;
          if (piece.color === 'w') whiteValue += val;
          else blackValue += val;
        }
      }
    }
    return whiteValue - blackValue;
  }

  loadFen(fen) {
    this.chess.load(fen);
    this.capturedPieces = { w: [], b: [] };
    this.moveHistory = [];
  }

  getPgn() {
    return this.chess.pgn();
  }

  isCastling(move) {
    return move.flags.includes('k') || move.flags.includes('q');
  }

  isEnPassant(move) {
    return move.flags.includes('e');
  }

  isPromotion(from, to) {
    const piece = this.chess.get(from);
    if (!piece || piece.type !== 'p') return false;
    const rank = to[1];
    return (piece.color === 'w' && rank === '8') || (piece.color === 'b' && rank === '1');
  }

  needsPromotion(from, to) {
    return this.isPromotion(from, to);
  }
}
