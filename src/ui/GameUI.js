import { eventBus } from '../utils/EventBus.js';
import { EVENTS, PIECE_UNICODE, PIECE_NAMES_KO, GAME_MODES } from '../utils/Constants.js';

export class GameUI {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.currentMode = null;
    this.currentSettings = null;
    this.moveList = [];
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    eventBus.on(EVENTS.MOVE_COMPLETE, (data) => this.onMoveComplete(data));
    eventBus.on(EVENTS.GAME_OVER, (data) => this.onGameOver(data));
    eventBus.on(EVENTS.AI_THINKING, (data) => this.onAIThinking(data));
  }

  setup(mode, settings) {
    this.currentMode = mode;
    this.currentSettings = settings;
    this.moveList = [];

    const modeLabels = {
      [GAME_MODES.VS_COMPUTER]: '컴퓨터 대전',
      [GAME_MODES.LOCAL_MULTIPLAYER]: '로컬 대전',
      [GAME_MODES.PUZZLE]: '체스 퍼즐',
      [GAME_MODES.TUTORIAL]: '학습 모드',
    };

    const container = document.getElementById('game-screen');
    container.innerHTML = `
      <div class="side-panel">
        <div class="captured-section">
          <div class="captured-label">잡힌 기물 (흑)</div>
          <div class="captured-pieces" id="captured-black"></div>
          <div class="material-advantage" id="advantage-black"></div>
        </div>
        <div class="captured-section" style="margin-top:auto;">
          <div class="captured-label">잡힌 기물 (백)</div>
          <div class="captured-pieces" id="captured-white"></div>
          <div class="material-advantage" id="advantage-white"></div>
        </div>
      </div>
      <div class="center-area">
        <div class="top-bar">
          <div class="top-bar-left">
            <button class="back-btn" id="game-back-btn">← 메뉴</button>
            <span class="game-mode-label">${modeLabels[mode] || mode}</span>
          </div>
          <button class="settings-btn" id="game-settings-btn">⚙️</button>
        </div>
        <div style="flex:1;"></div>
        <div class="status-bar" id="game-status">백의 차례</div>
      </div>
      <div class="right-panel">
        <div class="notation-header">기보</div>
        <div class="notation-list" id="notation-list"></div>
        <div class="game-controls">
          <button class="control-btn" id="btn-undo">↶ 무르기</button>
          <button class="control-btn" id="btn-hint">💡 힌트</button>
          <button class="control-btn primary" id="btn-newgame">새 게임</button>
        </div>
      </div>
    `;

    this.bindGameEvents();
  }

  bindGameEvents() {
    document.getElementById('game-back-btn')?.addEventListener('click', () => {
      this.uiManager.goToMenu();
    });

    document.getElementById('btn-undo')?.addEventListener('click', () => {
      eventBus.emit(EVENTS.UNDO_MOVE);
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      eventBus.emit(EVENTS.HINT_REQUEST);
    });

    document.getElementById('btn-newgame')?.addEventListener('click', () => {
      this.uiManager.hideModal();
      eventBus.emit(EVENTS.GAME_RESET);
      this.uiManager.startGame(this.currentMode, this.currentSettings);
    });
  }

  onMoveComplete(data) {
    const { move, isCheck, isCheckmate, turn } = data;

    // 기보 업데이트
    this.moveList.push(move);
    this.updateNotation();

    // 상태 바 업데이트
    const statusEl = document.getElementById('game-status');
    if (statusEl) {
      if (isCheckmate) {
        statusEl.textContent = '체크메이트!';
        statusEl.className = 'status-bar check';
      } else if (isCheck) {
        statusEl.textContent = `${turn === 'w' ? '백' : '흑'}에게 체크!`;
        statusEl.className = 'status-bar check';
      } else {
        statusEl.textContent = `${turn === 'w' ? '백' : '흑'}의 차례`;
        statusEl.className = 'status-bar';
      }
    }

    // 잡힌 기물 업데이트
    if (move.captured) {
      this.updateCaptured(move);
    }
  }

  updateNotation() {
    const list = document.getElementById('notation-list');
    if (!list) return;

    list.innerHTML = '';
    for (let i = 0; i < this.moveList.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = this.moveList[i];
      const blackMove = this.moveList[i + 1];

      const row = document.createElement('div');
      row.className = 'notation-row';
      row.innerHTML = `
        <span class="notation-number">${moveNum}.</span>
        <span class="notation-white">${whiteMove.san}</span>
        <span class="notation-black">${blackMove ? blackMove.san : ''}</span>
      `;
      list.appendChild(row);
    }

    list.scrollTop = list.scrollHeight;
  }

  updateCaptured(move) {
    const color = move.color === 'w' ? 'black' : 'white';
    const capturedEl = document.getElementById(`captured-${color}`);
    if (capturedEl) {
      const pieceKey = (move.color === 'w' ? 'b' : 'w') + move.captured;
      const span = document.createElement('span');
      span.textContent = PIECE_UNICODE[pieceKey] || move.captured;
      capturedEl.appendChild(span);
    }
  }

  onGameOver({ result, reason }) {
    this.uiManager.showGameOverDialog(result, reason);
  }

  onAIThinking({ isThinking }) {
    const statusEl = document.getElementById('game-status');
    if (statusEl) {
      if (isThinking) {
        statusEl.innerHTML = `
          <div class="thinking-indicator">
            <span>AI 생각 중</span>
            <div class="thinking-dots"><span></span><span></span><span></span></div>
          </div>
        `;
      }
    }
  }

  setStatus(text, isWarning = false) {
    const statusEl = document.getElementById('game-status');
    if (statusEl) {
      statusEl.textContent = text;
      statusEl.className = isWarning ? 'status-bar check' : 'status-bar';
    }
  }
}
