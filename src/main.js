import { eventBus } from './utils/EventBus.js';
import { EVENTS, GAME_MODES } from './utils/Constants.js';
import { SceneManager } from './3d/SceneManager.js';
import { BoardRenderer } from './3d/BoardRenderer.js';
import { PieceFactory } from './3d/PieceFactory.js';
import { CameraController } from './3d/CameraController.js';
import { InputHandler } from './3d/InputHandler.js';
import { HighlightManager } from './3d/HighlightManager.js';
import { AnimationManager } from './3d/AnimationManager.js';
import { ParticleSystem } from './3d/ParticleSystem.js';
import { ChessGame } from './core/ChessGame.js';
import { UIManager } from './ui/UIManager.js';
import { AudioManager } from './utils/AudioManager.js';
import { StorageManager } from './utils/StorageManager.js';
import { LocalMultiplayerMode } from './modes/LocalMultiplayerMode.js';
import { VsComputerMode } from './modes/VsComputerMode.js';
import { PuzzleMode } from './modes/PuzzleMode.js';
import { TutorialMode } from './modes/TutorialMode.js';

class App {
  constructor() {
    this.currentMode = null;
    this.init();
  }

  init() {
    const canvas = document.getElementById('chess-canvas');

    // 핵심 시스템 초기화
    this.sceneManager = new SceneManager(canvas);
    this.boardRenderer = new BoardRenderer(this.sceneManager);
    this.pieceFactory = new PieceFactory(this.sceneManager);
    this.cameraController = new CameraController(this.sceneManager);
    this.inputHandler = new InputHandler(this.sceneManager, this.pieceFactory);
    this.highlightManager = new HighlightManager(this.sceneManager, this.boardRenderer);
    this.animationManager = new AnimationManager();
    this.particleSystem = new ParticleSystem(this.sceneManager);
    this.chessGame = new ChessGame();
    this.audioManager = new AudioManager();
    this.storageManager = new StorageManager();

    // UI 초기화
    this.uiManager = new UIManager(this.storageManager);

    // 이벤트 바인딩
    this.bindEvents();

    // 렌더링 시작
    this.sceneManager.startRenderLoop();
  }

  bindEvents() {
    eventBus.on(EVENTS.GAME_START, (data) => this.startGame(data));
    eventBus.on(EVENTS.GAME_RESET, () => this.resetGame());
    eventBus.on(EVENTS.UI_SCREEN_CHANGE, (data) => this.onScreenChange(data));
    eventBus.on(EVENTS.SOUND_PLAY, (data) => this.audioManager.play(data.sound));
  }

  startGame({ mode, settings }) {
    // 이전 모드 정리
    if (this.currentMode) {
      this.currentMode.cleanup();
    }

    // 체스 게임 리셋
    this.chessGame.newGame(settings?.fen);

    // 보드 및 기물 렌더링
    this.boardRenderer.render();
    this.pieceFactory.placeAllPieces(this.chessGame.getBoard());

    // 모드별 컨트롤러 생성
    const modeContext = {
      chessGame: this.chessGame,
      sceneManager: this.sceneManager,
      boardRenderer: this.boardRenderer,
      pieceFactory: this.pieceFactory,
      inputHandler: this.inputHandler,
      highlightManager: this.highlightManager,
      animationManager: this.animationManager,
      particleSystem: this.particleSystem,
      cameraController: this.cameraController,
      uiManager: this.uiManager,
      audioManager: this.audioManager,
      storageManager: this.storageManager,
    };

    switch (mode) {
      case GAME_MODES.VS_COMPUTER:
        this.currentMode = new VsComputerMode(modeContext, settings);
        break;
      case GAME_MODES.LOCAL_MULTIPLAYER:
        this.currentMode = new LocalMultiplayerMode(modeContext, settings);
        break;
      case GAME_MODES.PUZZLE:
        this.currentMode = new PuzzleMode(modeContext, settings);
        break;
      case GAME_MODES.TUTORIAL:
        this.currentMode = new TutorialMode(modeContext, settings);
        break;
    }

    if (this.currentMode) {
      this.currentMode.start();
    }
  }

  resetGame() {
    if (this.currentMode) {
      this.currentMode.cleanup();
      this.currentMode = null;
    }
    this.pieceFactory.clearAllPieces();
    this.highlightManager.clearAll();
    this.particleSystem.clearAll();
  }

  onScreenChange({ screen }) {
    if (screen === 'menu') {
      this.resetGame();
    }
  }
}

// 앱 시작
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
