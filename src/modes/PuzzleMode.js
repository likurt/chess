import { GameModeBase } from './GameModeBase.js';
import { PuzzleManager } from '../puzzle/PuzzleManager.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class PuzzleMode extends GameModeBase {
  constructor(context, settings) {
    super(context, settings);
    this.puzzleManager = new PuzzleManager(context.storageManager);
    this.currentPuzzle = null;
    this.isShowingFeedback = false;
  }

  start() {
    // 퍼즐 목록 표시 또는 특정 퍼즐 로드
    if (this.settings?.puzzleId) {
      this.loadPuzzle(this.settings.puzzleId);
    } else {
      this.showPuzzleList();
    }
  }

  showPuzzleList() {
    const container = document.getElementById('game-screen');
    const solvedPuzzles = this.storageManager.getSolvedPuzzles();

    let html = `
      <div class="puzzle-list-container">
        <div style="width:500px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
          <h2 style="color:var(--color-gold);font-size:1.8rem;">🧩 체스 퍼즐</h2>
          <button class="back-btn" id="puzzle-back-btn">← 메뉴</button>
        </div>
    `;

    for (const cat of this.puzzleManager.getAllCategories()) {
      html += `
        <div class="puzzle-category">
          <div class="puzzle-category-title">${cat.name}</div>
          <div class="puzzle-grid">
      `;
      cat.puzzles.forEach((puzzle, idx) => {
        const isSolved = solvedPuzzles.includes(puzzle.id);
        html += `
          <div class="puzzle-item ${isSolved ? 'solved' : ''}" data-puzzle-id="${puzzle.id}">
            ${isSolved ? '✓' : idx + 1}
          </div>
        `;
      });
      html += `</div></div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    // 이벤트 바인딩
    container.querySelectorAll('.puzzle-item').forEach(el => {
      el.addEventListener('click', () => {
        this.loadPuzzle(el.dataset.puzzleId);
      });
    });

    document.getElementById('puzzle-back-btn')?.addEventListener('click', () => {
      this.uiManager.goToMenu();
    });
  }

  loadPuzzle(puzzleId) {
    this.currentPuzzle = this.puzzleManager.loadPuzzle(puzzleId);
    if (!this.currentPuzzle) return;

    // 게임 보드 설정
    this.chessGame.loadFen(this.currentPuzzle.fen);
    this.boardRenderer.render();
    this.pieceFactory.placeAllPieces(this.chessGame.getBoard());

    // UI 설정
    this.setupPuzzleUI();

    // 이벤트 연결
    super.start();

    // 카메라 설정
    const isWhiteTurn = this.currentPuzzle.turn === 'w';
    if (isWhiteTurn) {
      this.cameraController.setWhiteView(false);
    } else {
      this.cameraController.setBlackView(false);
    }
  }

  setupPuzzleUI() {
    const container = document.getElementById('game-screen');
    container.innerHTML = `
      <div class="center-area" style="pointer-events:none;">
        <div class="top-bar" style="pointer-events:auto;">
          <div class="top-bar-left">
            <button class="back-btn" id="puzzle-back-list">← 목록</button>
            <span class="game-mode-label">${this.currentPuzzle.title}</span>
          </div>
        </div>
        <div style="flex:1;"></div>
        <div class="puzzle-header" style="pointer-events:auto;">
          <div class="puzzle-description">${this.currentPuzzle.description}</div>
          <div class="puzzle-feedback" id="puzzle-feedback"></div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;">
            <button class="control-btn" id="puzzle-hint-btn">💡 힌트</button>
            <button class="control-btn" id="puzzle-next-btn" style="display:none;">다음 퍼즐 →</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('puzzle-back-list')?.addEventListener('click', () => {
      this.cleanup();
      this.showPuzzleList();
    });

    document.getElementById('puzzle-hint-btn')?.addEventListener('click', () => {
      const hint = this.puzzleManager.getHint();
      if (hint) {
        const feedback = document.getElementById('puzzle-feedback');
        if (feedback) {
          feedback.textContent = `💡 ${hint}`;
          feedback.className = 'puzzle-feedback';
          feedback.style.color = 'var(--color-info)';
        }
      }
    });

    document.getElementById('puzzle-next-btn')?.addEventListener('click', () => {
      const next = this.puzzleManager.getNextPuzzle(this.currentPuzzle.id);
      if (next) {
        this.cleanup();
        this.loadPuzzle(next.id);
      }
    });
  }

  canSelect(piece) {
    return piece.color === this.chessGame.getTurn();
  }

  onMoveComplete(move) {
    if (this.isShowingFeedback) return;

    // 정답 확인
    const result = this.puzzleManager.checkMove(move.san);
    const feedback = document.getElementById('puzzle-feedback');

    if (result.correct) {
      if (result.completed) {
        if (feedback) {
          feedback.textContent = '🎉 정답! 퍼즐 완료!';
          feedback.className = 'puzzle-feedback correct';
        }
        this.audioManager.play('correct');
        this.inputHandler.setEnabled(false);

        // 다음 퍼즐 버튼 표시
        const nextBtn = document.getElementById('puzzle-next-btn');
        if (nextBtn) nextBtn.style.display = 'inline-block';
      } else {
        if (feedback) {
          feedback.textContent = '✓ 맞았습니다! 계속하세요.';
          feedback.className = 'puzzle-feedback correct';
        }
        this.audioManager.play('correct');
      }
    } else {
      if (feedback) {
        feedback.textContent = '✗ 틀렸습니다. 다시 시도하세요.';
        feedback.className = 'puzzle-feedback wrong';
      }
      this.audioManager.play('wrong');

      // 되돌리기
      this.isShowingFeedback = true;
      setTimeout(() => {
        this.chessGame.undo();
        this.pieceFactory.placeAllPieces(this.chessGame.getBoard());
        this.highlightManager.clearAll();
        this.isShowingFeedback = false;
      }, 800);
    }
  }

  onUndo() {
    // 퍼즐 모드에서는 무르기 비활성화
  }

  cleanup() {
    super.cleanup();
  }
}
