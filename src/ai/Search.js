import { evaluate } from './Evaluator.js';

export class Search {
  constructor() {
    this.nodesSearched = 0;
    this.timeLimit = 0;
    this.startTime = 0;
    this.aborted = false;
  }

  findBestMove(chess, depth, timeLimit, useQuiescence = true) {
    this.nodesSearched = 0;
    this.timeLimit = timeLimit;
    this.startTime = performance.now();
    this.aborted = false;

    const isMaximizing = chess.turn() === 'w';
    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    // Iterative deepening
    for (let d = 1; d <= depth; d++) {
      if (this.isTimeUp()) break;

      const moves = this.orderMoves(chess, chess.moves({ verbose: true }));

      for (const move of moves) {
        if (this.isTimeUp()) break;

        chess.move(move);
        const score = this.minimax(chess, d - 1, -Infinity, Infinity, !isMaximizing, useQuiescence);
        chess.undo();

        if (this.aborted) break;

        if (isMaximizing) {
          if (score > bestScore) {
            bestScore = score;
            bestMove = move;
          }
        } else {
          if (score < bestScore) {
            bestScore = score;
            bestMove = move;
          }
        }
      }
    }

    return { move: bestMove, score: bestScore, nodes: this.nodesSearched };
  }

  minimax(chess, depth, alpha, beta, isMaximizing, useQuiescence) {
    this.nodesSearched++;

    if (this.isTimeUp()) {
      this.aborted = true;
      return evaluate(chess);
    }

    if (depth === 0) {
      if (useQuiescence) {
        return this.quiescence(chess, alpha, beta, isMaximizing, 4);
      }
      return evaluate(chess);
    }

    if (chess.isGameOver()) {
      return evaluate(chess);
    }

    const moves = this.orderMoves(chess, chess.moves({ verbose: true }));

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        chess.move(move);
        const eval_ = this.minimax(chess, depth - 1, alpha, beta, false, useQuiescence);
        chess.undo();

        if (this.aborted) return eval_;

        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        chess.move(move);
        const eval_ = this.minimax(chess, depth - 1, alpha, beta, true, useQuiescence);
        chess.undo();

        if (this.aborted) return eval_;

        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Quiescence Search: 잡기 수만 추가 탐색
  quiescence(chess, alpha, beta, isMaximizing, maxDepth) {
    this.nodesSearched++;

    const standPat = evaluate(chess);

    if (maxDepth <= 0) return standPat;

    if (isMaximizing) {
      if (standPat >= beta) return beta;
      if (standPat > alpha) alpha = standPat;
    } else {
      if (standPat <= alpha) return alpha;
      if (standPat < beta) beta = standPat;
    }

    // 잡기 수만 필터링
    const allMoves = chess.moves({ verbose: true });
    const captureMoves = allMoves.filter(m => m.captured);

    if (captureMoves.length === 0) return standPat;

    const orderedCaptures = this.orderMoves(chess, captureMoves);

    if (isMaximizing) {
      let maxEval = standPat;
      for (const move of orderedCaptures) {
        chess.move(move);
        const eval_ = this.quiescence(chess, alpha, beta, false, maxDepth - 1);
        chess.undo();
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = standPat;
      for (const move of orderedCaptures) {
        chess.move(move);
        const eval_ = this.quiescence(chess, alpha, beta, true, maxDepth - 1);
        chess.undo();
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  // Move Ordering: MVV-LVA + 프로모션 + 체크
  orderMoves(chess, moves) {
    const PIECE_ORDER = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

    return moves.sort((a, b) => {
      let scoreA = 0, scoreB = 0;

      // 잡기: MVV-LVA (Most Valuable Victim - Least Valuable Attacker)
      if (a.captured) scoreA += 10 * (PIECE_ORDER[a.captured] || 0) - (PIECE_ORDER[a.piece] || 0);
      if (b.captured) scoreB += 10 * (PIECE_ORDER[b.captured] || 0) - (PIECE_ORDER[b.piece] || 0);

      // 프로모션
      if (a.promotion) scoreA += 8;
      if (b.promotion) scoreB += 8;

      // 중앙 이동 보너스
      if ('de'.includes(a.to[0]) && '45'.includes(a.to[1])) scoreA += 1;
      if ('de'.includes(b.to[0]) && '45'.includes(b.to[1])) scoreB += 1;

      return scoreB - scoreA;
    });
  }

  isTimeUp() {
    return (performance.now() - this.startTime) > this.timeLimit;
  }
}
