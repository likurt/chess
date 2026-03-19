import { eventBus } from '../utils/EventBus.js';
import { EVENTS, GAME_MODES, AI_DIFFICULTY, PIECE_UNICODE } from '../utils/Constants.js';
import { MainMenu } from './MainMenu.js';
import { GameUI } from './GameUI.js';

export class UIManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.currentScreen = 'menu';

    this.screens = {
      menu: document.getElementById('menu-screen'),
      game: document.getElementById('game-screen'),
      settings: document.getElementById('settings-screen'),
      puzzle: document.getElementById('puzzle-screen'),
      tutorial: document.getElementById('tutorial-screen'),
    };

    this.modalOverlay = document.getElementById('modal-overlay');

    this.mainMenu = new MainMenu(this);
    this.gameUI = new GameUI(this);

    this.init();
  }

  init() {
    this.showScreen('menu');
  }

  showScreen(name) {
    Object.entries(this.screens).forEach(([key, el]) => {
      if (key === name) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
    this.currentScreen = name;
    eventBus.emit(EVENTS.UI_SCREEN_CHANGE, { screen: name });
  }

  // 게임 시작
  startGame(mode, settings = {}) {
    this.showScreen('game');
    this.gameUI.setup(mode, settings);
    eventBus.emit(EVENTS.GAME_START, { mode, settings });
  }

  // 메인 메뉴로 돌아가기
  goToMenu() {
    this.showScreen('menu');
    eventBus.emit(EVENTS.GAME_RESET);
  }

  // 모달 표시
  showModal(content) {
    this.modalOverlay.innerHTML = '';
    this.modalOverlay.appendChild(content);
    this.modalOverlay.classList.remove('hidden');
  }

  // 모달 숨기기
  hideModal() {
    this.modalOverlay.classList.add('hidden');
    this.modalOverlay.innerHTML = '';
  }

  // 프로모션 다이얼로그
  showPromotionDialog(color) {
    return new Promise((resolve) => {
      const content = document.createElement('div');
      content.className = 'modal-content';
      content.innerHTML = `
        <div class="modal-title">승진 선택</div>
        <div class="modal-message">폰을 어떤 기물로 승진시키겠습니까?</div>
        <div class="promotion-dialog">
          <div class="promotion-piece" data-piece="q">${color === 'w' ? PIECE_UNICODE.wq : PIECE_UNICODE.bq}</div>
          <div class="promotion-piece" data-piece="r">${color === 'w' ? PIECE_UNICODE.wr : PIECE_UNICODE.br}</div>
          <div class="promotion-piece" data-piece="b">${color === 'w' ? PIECE_UNICODE.wb : PIECE_UNICODE.bb}</div>
          <div class="promotion-piece" data-piece="n">${color === 'w' ? PIECE_UNICODE.wn : PIECE_UNICODE.bn}</div>
        </div>
      `;

      content.querySelectorAll('.promotion-piece').forEach(el => {
        el.addEventListener('click', () => {
          this.hideModal();
          resolve(el.dataset.piece);
        });
      });

      this.showModal(content);
    });
  }

  // 게임 종료 다이얼로그
  showGameOverDialog(result, reason) {
    const resultText = result === 'white_wins' ? '백 승리!' :
                       result === 'black_wins' ? '흑 승리!' : '무승부!';

    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
      <div class="modal-title">${resultText}</div>
      <div class="modal-message">${reason}</div>
      <div class="modal-buttons">
        <button class="modal-btn" id="modal-menu-btn">메인 메뉴</button>
        <button class="modal-btn primary" id="modal-newgame-btn">새 게임</button>
      </div>
    `;

    this.showModal(content);

    content.querySelector('#modal-menu-btn').addEventListener('click', () => {
      this.hideModal();
      this.goToMenu();
    });

    content.querySelector('#modal-newgame-btn').addEventListener('click', () => {
      this.hideModal();
      eventBus.emit(EVENTS.GAME_RESET);
      // 같은 모드로 재시작
      if (this.gameUI.currentMode && this.gameUI.currentSettings) {
        this.startGame(this.gameUI.currentMode, this.gameUI.currentSettings);
      }
    });
  }

  // 컴퓨터 대전 설정 화면
  showVsComputerSetup() {
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.innerHTML = `
      <div class="modal-title">컴퓨터 대전</div>
      <div class="modal-message">기물 색상을 선택하세요</div>
      <div class="color-select">
        <div class="color-btn" data-color="w">
          <span class="piece-icon">♔</span>
          <span>백</span>
        </div>
        <div class="color-btn" data-color="b">
          <span class="piece-icon">♚</span>
          <span>흑</span>
        </div>
        <div class="color-btn" data-color="random">
          <span class="piece-icon">?</span>
          <span>랜덤</span>
        </div>
      </div>
      <div class="modal-message" style="margin-top:16px;">난이도를 선택하세요</div>
      <div class="difficulty-select">
        ${Object.values(AI_DIFFICULTY).map(d => `
          <button class="difficulty-btn" data-level="${d.level}">
            ${d.name}
            <span class="difficulty-level">${'★'.repeat(d.level)}${'☆'.repeat(5-d.level)}</span>
          </button>
        `).join('')}
      </div>
    `;

    let selectedColor = 'w';
    let selectedDifficulty = 3;

    content.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        content.querySelectorAll('.color-btn').forEach(b => b.style.borderColor = '');
        btn.style.borderColor = '#ffd700';
        selectedColor = btn.dataset.color;
      });
    });

    // 기본 선택 표시
    content.querySelector('[data-color="w"]').style.borderColor = '#ffd700';

    content.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (selectedColor === 'random') {
          selectedColor = Math.random() < 0.5 ? 'w' : 'b';
        }
        this.hideModal();
        this.startGame(GAME_MODES.VS_COMPUTER, {
          playerColor: selectedColor,
          difficulty: parseInt(btn.dataset.level),
        });
      });
    });

    this.showModal(content);
  }
}
