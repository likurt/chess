export class HintSystem {
  constructor(chessGame) {
    this.chessGame = chessGame;
  }

  getBestMoveHint() {
    const moves = this.chessGame.getAllValidMoves();
    if (moves.length === 0) return null;

    // 간단한 휴리스틱으로 좋은 수 추천
    const scored = moves.map(move => {
      let score = 0;
      if (move.captured) score += 10;
      if (move.san.includes('+')) score += 5;
      if (move.san.includes('#')) score += 100;
      // 중앙 이동 보너스
      if ('de'.includes(move.to[0]) && '45'.includes(move.to[1])) score += 3;
      return { move, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.move || null;
  }
}
