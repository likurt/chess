import { GAME_MODES } from '../utils/Constants.js';

export class MainMenu {
  constructor(uiManager) {
    this.uiManager = uiManager;
    this.render();
  }

  render() {
    const container = document.getElementById('menu-screen');
    container.innerHTML = `
      <div class="menu-title">♔ 3D 체스 ♚</div>
      <div class="menu-subtitle">CHESS MASTER</div>
      <div class="menu-buttons">
        <button class="menu-btn" id="btn-vs-computer">
          <span class="menu-btn-icon">🖥️</span>
          <span>컴퓨터 대전</span>
        </button>
        <button class="menu-btn" id="btn-local">
          <span class="menu-btn-icon">👥</span>
          <span>로컬 대전</span>
        </button>
        <button class="menu-btn" id="btn-puzzle">
          <span class="menu-btn-icon">🧩</span>
          <span>체스 퍼즐</span>
        </button>
        <button class="menu-btn" id="btn-tutorial">
          <span class="menu-btn-icon">📖</span>
          <span>학습 모드</span>
        </button>
        <button class="menu-btn" id="btn-settings">
          <span class="menu-btn-icon">⚙️</span>
          <span>설정</span>
        </button>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    document.getElementById('btn-vs-computer').addEventListener('click', () => {
      this.uiManager.showVsComputerSetup();
    });

    document.getElementById('btn-local').addEventListener('click', () => {
      this.uiManager.startGame(GAME_MODES.LOCAL_MULTIPLAYER);
    });

    document.getElementById('btn-puzzle').addEventListener('click', () => {
      this.uiManager.startGame(GAME_MODES.PUZZLE);
    });

    document.getElementById('btn-tutorial').addEventListener('click', () => {
      this.uiManager.startGame(GAME_MODES.TUTORIAL);
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
      this.showSettings();
    });
  }

  showSettings() {
    const settings = this.uiManager.storageManager.getSettings();
    const container = document.getElementById('settings-screen');
    container.innerHTML = `
      <div class="settings-container">
        <div class="settings-title">⚙️ 설정</div>
        <div class="settings-group">
          <div class="settings-group-title">사운드</div>
          <div class="settings-item">
            <label>효과음</label>
            <input type="checkbox" id="setting-sound" ${settings.soundEnabled ? 'checked' : ''}>
          </div>
          <div class="settings-item">
            <label>볼륨</label>
            <input type="range" id="setting-volume" min="0" max="100" value="${settings.volume * 100}" style="width:120px">
          </div>
        </div>
        <div class="settings-group">
          <div class="settings-group-title">게임플레이</div>
          <div class="settings-item">
            <label>이동 가능 칸 표시</label>
            <input type="checkbox" id="setting-hints" ${settings.showHints ? 'checked' : ''}>
          </div>
          <div class="settings-item">
            <label>카메라 자동 회전 (로컬 대전)</label>
            <input type="checkbox" id="setting-autorotate" ${settings.autoRotateCamera ? 'checked' : ''}>
          </div>
        </div>
        <button class="settings-back-btn" id="settings-back">← 돌아가기</button>
      </div>
    `;

    this.uiManager.showScreen('settings');

    const save = () => {
      const newSettings = {
        soundEnabled: document.getElementById('setting-sound').checked,
        volume: parseInt(document.getElementById('setting-volume').value) / 100,
        showHints: document.getElementById('setting-hints').checked,
        autoRotateCamera: document.getElementById('setting-autorotate').checked,
      };
      this.uiManager.storageManager.saveSettings(newSettings);
    };

    ['setting-sound', 'setting-volume', 'setting-hints', 'setting-autorotate'].forEach(id => {
      document.getElementById(id).addEventListener('change', save);
    });

    document.getElementById('settings-back').addEventListener('click', () => {
      save();
      this.uiManager.showScreen('menu');
    });
  }
}
