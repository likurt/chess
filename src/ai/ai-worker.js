import { Chess } from 'chess.js';
import { Search } from './Search.js';
import { evaluate } from './Evaluator.js';
import { getBookMove } from './OpeningBook.js';
import { DIFFICULTY_PRESETS } from './DifficultyPresets.js';

const search = new Search();

self.onmessage = function(e) {
  const { type, fen, difficulty } = e.data;

  if (type === 'search') {
    const chess = new Chess(fen);
    const preset = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS[3];

    // 오프닝 북 확인
    if (preset.useOpeningBook) {
      const bookMove = getBookMove(fen);
      if (bookMove) {
        // 약간의 딜레이 (자연스러움)
        setTimeout(() => {
          self.postMessage({
            type: 'result',
            move: { from: bookMove.slice(0, 2), to: bookMove.slice(2, 4) },
            evaluation: 0,
            isBookMove: true,
          });
        }, 300 + Math.random() * 400);
        return;
      }
    }

    // AI 탐색
    const result = search.findBestMove(
      chess,
      preset.depth,
      preset.timeLimit,
      preset.quiescence
    );

    let selectedMove = result.move;

    // 의도적 실수 (낮은 난이도)
    if (preset.errorRate > 0 && Math.random() < preset.errorRate && selectedMove) {
      const allMoves = chess.moves({ verbose: true });
      if (allMoves.length > 1) {
        // 랜덤 수 선택 (최선의 수가 아닌)
        const otherMoves = allMoves.filter(m =>
          m.from !== selectedMove.from || m.to !== selectedMove.to
        );
        if (otherMoves.length > 0) {
          selectedMove = otherMoves[Math.floor(Math.random() * otherMoves.length)];
        }
      }
    }

    // 최소 사고 시간 보장 (자연스러움)
    const elapsed = performance.now();
    const minThinkTime = 300 + Math.random() * 500;

    setTimeout(() => {
      self.postMessage({
        type: 'result',
        move: selectedMove ? { from: selectedMove.from, to: selectedMove.to, promotion: selectedMove.promotion } : null,
        evaluation: result.score,
        nodes: result.nodes,
      });
    }, Math.max(0, minThinkTime));
  }
};
