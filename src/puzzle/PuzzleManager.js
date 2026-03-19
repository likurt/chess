import { MATE_IN_1_PUZZLES } from './puzzles/mate-in-1.js';
import { MATE_IN_2_PUZZLES } from './puzzles/mate-in-2.js';
import { TACTICS_PUZZLES } from './puzzles/tactics.js';
import { ENDGAME_PUZZLES } from './puzzles/endgame.js';

export class PuzzleManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.categories = [
      { id: 'mate-in-1', name: '1수 체크메이트', puzzles: MATE_IN_1_PUZZLES },
      { id: 'mate-in-2', name: '2수 체크메이트', puzzles: MATE_IN_2_PUZZLES },
      { id: 'tactics', name: '전술 문제', puzzles: TACTICS_PUZZLES },
      { id: 'endgame', name: '엔드게임', puzzles: ENDGAME_PUZZLES },
    ];
    this.currentPuzzle = null;
    this.currentStep = 0;
  }

  getAllCategories() {
    return this.categories;
  }

  getPuzzle(puzzleId) {
    for (const cat of this.categories) {
      const puzzle = cat.puzzles.find(p => p.id === puzzleId);
      if (puzzle) return puzzle;
    }
    return null;
  }

  loadPuzzle(puzzleId) {
    this.currentPuzzle = this.getPuzzle(puzzleId);
    this.currentStep = 0;
    return this.currentPuzzle;
  }

  checkMove(moveSan) {
    if (!this.currentPuzzle) return { correct: false };

    const solution = this.currentPuzzle.solution;
    const expectedMove = solution[this.currentStep];

    if (!expectedMove) return { correct: false, completed: true };

    // SAN 표기법 비교 (# 과 + 기호 무시하여 유연하게 매칭)
    const normalize = (san) => san.replace(/[+#]/g, '');

    if (normalize(moveSan) === normalize(expectedMove)) {
      this.currentStep++;
      const completed = this.currentStep >= solution.length;

      if (completed) {
        this.storageManager.markPuzzleSolved(this.currentPuzzle.id);
      }

      return { correct: true, completed };
    }

    return { correct: false, expectedMove };
  }

  getHint() {
    if (!this.currentPuzzle || !this.currentPuzzle.hints) return null;
    const hintIdx = Math.min(this.currentStep, this.currentPuzzle.hints.length - 1);
    return this.currentPuzzle.hints[hintIdx];
  }

  isSolved(puzzleId) {
    const solved = this.storageManager.getSolvedPuzzles();
    return solved.includes(puzzleId);
  }

  getNextPuzzle(currentId) {
    for (const cat of this.categories) {
      const idx = cat.puzzles.findIndex(p => p.id === currentId);
      if (idx !== -1 && idx + 1 < cat.puzzles.length) {
        return cat.puzzles[idx + 1];
      }
    }
    return null;
  }
}
