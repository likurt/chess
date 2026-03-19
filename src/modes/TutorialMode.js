import { GameModeBase } from './GameModeBase.js';
import { TutorialManager } from '../tutorial/TutorialManager.js';
import { HintSystem } from '../tutorial/HintSystem.js';
import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class TutorialMode extends GameModeBase {
  constructor(context, settings) {
    super(context, settings);
    this.tutorialManager = new TutorialManager(context.storageManager);
    this.hintSystem = new HintSystem(context.chessGame);
    this.currentLesson = null;
    this.isFreePlay = false;
  }

  start() {
    if (this.settings?.lessonId) {
      this.loadLesson(this.settings.lessonId);
    } else {
      this.showLessonList();
    }
  }

  showLessonList() {
    const container = document.getElementById('game-screen');
    const completedLessons = this.storageManager.getCompletedLessons();

    let html = `
      <div class="tutorial-list-container">
        <div style="width:500px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;">
          <h2 style="color:var(--color-gold);font-size:1.8rem;">📖 학습 모드</h2>
          <button class="back-btn" id="tutorial-back-btn">← 메뉴</button>
        </div>
    `;

    for (const cat of this.tutorialManager.getAllCategories()) {
      html += `<div class="lesson-category"><div class="lesson-category-title">${cat.name}</div>`;
      for (const lesson of cat.lessons) {
        const isCompleted = completedLessons.includes(lesson.id);
        html += `
          <div class="lesson-item ${isCompleted ? 'completed' : ''}" data-lesson-id="${lesson.id}">
            <span class="lesson-icon">${lesson.icon}</span>
            <div class="lesson-info">
              <div class="lesson-title">${lesson.title}</div>
              <div class="lesson-desc">${lesson.description}</div>
            </div>
            ${isCompleted ? '<span style="color:var(--color-success);">✓</span>' : ''}
          </div>
        `;
      }
      html += `</div>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.lesson-item').forEach(el => {
      el.addEventListener('click', () => {
        this.loadLesson(el.dataset.lessonId);
      });
    });

    document.getElementById('tutorial-back-btn')?.addEventListener('click', () => {
      this.uiManager.goToMenu();
    });
  }

  loadLesson(lessonId) {
    this.currentLesson = this.tutorialManager.loadLesson(lessonId);
    if (!this.currentLesson) return;

    this.showStep();
  }

  showStep() {
    const step = this.tutorialManager.getCurrentStep();
    if (!step) {
      // 레슨 완료
      this.showLessonComplete();
      return;
    }

    // 보드 설정
    this.chessGame.loadFen(step.fen);
    this.boardRenderer.render();
    this.pieceFactory.placeAllPieces(this.chessGame.getBoard());
    this.highlightManager.clearAll();

    // 하이라이트 표시
    if (step.highlights) {
      step.highlights.forEach(sq => {
        this.highlightManager.showHint(sq);
      });
    }

    this.isFreePlay = !!step.freePlay;

    // 자유 플레이 모드
    if (this.isFreePlay) {
      super.start();
      this.cameraController.setWhiteView(false);
    } else {
      this.inputHandler.setEnabled(false);
    }

    // UI 설정
    this.setupTutorialUI(step);
  }

  setupTutorialUI(step) {
    const container = document.getElementById('game-screen');
    const stepIdx = this.tutorialManager.getCurrentStepIndex();
    const totalSteps = this.tutorialManager.getTotalSteps();
    const isFirst = stepIdx === 0;
    const isLast = stepIdx === totalSteps - 1;

    container.innerHTML = `
      <div class="center-area" style="pointer-events:none;">
        <div class="top-bar" style="pointer-events:auto;">
          <div class="top-bar-left">
            <button class="back-btn" id="tutorial-back-list">← 목록</button>
            <span class="game-mode-label">${this.currentLesson.icon} ${this.currentLesson.title}</span>
          </div>
          <span style="color:var(--color-text-dim);font-size:0.9rem;">${stepIdx + 1} / ${totalSteps}</span>
        </div>
        <div style="flex:1;"></div>
        <div class="tutorial-overlay" style="pointer-events:auto;">
          <div class="tutorial-text">${step.text}</div>
          <div class="tutorial-nav">
            ${!isFirst ? '<button class="tutorial-nav-btn" id="tutorial-prev">← 이전</button>' : ''}
            ${this.isFreePlay ? '<button class="tutorial-nav-btn" id="tutorial-reset">↺ 리셋</button>' : ''}
            <button class="tutorial-nav-btn primary" id="tutorial-next">${isLast ? '완료 ✓' : '다음 →'}</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('tutorial-back-list')?.addEventListener('click', () => {
      this.cleanup();
      this.showLessonList();
    });

    document.getElementById('tutorial-prev')?.addEventListener('click', () => {
      this.cleanup();
      this.tutorialManager.prevStep();
      this.showStep();
    });

    document.getElementById('tutorial-next')?.addEventListener('click', () => {
      this.cleanup();
      const next = this.tutorialManager.nextStep();
      if (next) {
        this.showStep();
      } else {
        this.showLessonComplete();
      }
    });

    document.getElementById('tutorial-reset')?.addEventListener('click', () => {
      this.chessGame.loadFen(step.fen);
      this.pieceFactory.placeAllPieces(this.chessGame.getBoard());
      this.highlightManager.clearAll();
    });
  }

  showLessonComplete() {
    const container = document.getElementById('game-screen');
    container.innerHTML = `
      <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(26,26,46,0.92),rgba(15,52,96,0.92));">
        <div style="font-size:3rem;margin-bottom:16px;">🎉</div>
        <div style="font-size:1.5rem;font-weight:700;color:var(--color-gold);margin-bottom:8px;">레슨 완료!</div>
        <div style="color:var(--color-text-dim);margin-bottom:24px;">${this.currentLesson.title}을(를) 완료했습니다.</div>
        <div style="display:flex;gap:12px;">
          <button class="modal-btn" id="lesson-back">← 목록으로</button>
        </div>
      </div>
    `;

    document.getElementById('lesson-back')?.addEventListener('click', () => {
      this.showLessonList();
    });
  }

  canSelect(piece) {
    if (this.isFreePlay) {
      return piece.color === this.chessGame.getTurn();
    }
    return false;
  }

  onMoveComplete(move) {
    // 자유 플레이 모드에서만 이동 허용
  }

  cleanup() {
    super.cleanup();
  }
}
