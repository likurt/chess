// 보드 설정
export const BOARD_SIZE = 8;
export const SQUARE_SIZE = 1;
export const BOARD_OFFSET = (BOARD_SIZE * SQUARE_SIZE) / 2 - SQUARE_SIZE / 2;

// 색상 팔레트 (스타일라이즈드 게임풍)
export const COLORS = {
  // 보드
  LIGHT_SQUARE: 0xF0D9B5,
  DARK_SQUARE: 0xB58863,
  BOARD_FRAME: 0x5C3A1E,

  // 기물
  WHITE_PIECE: 0xC0C8D4,       // 은색
  BLACK_PIECE: 0xDAA520,       // 금색
  WHITE_PIECE_ACCENT: 0xA8B0BC, // 은색 악센트
  BLACK_PIECE_ACCENT: 0xB8860B, // 금색 악센트

  // 하이라이트
  SELECTED: 0xFFFF00,
  VALID_MOVE: 0x00FF88,
  CAPTURE_MOVE: 0xFF4444,
  LAST_MOVE: 0xFFFF99,
  CHECK_HIGHLIGHT: 0xFF0000,
  HINT_HIGHLIGHT: 0x00AAFF,

  // 환경
  BACKGROUND: 0x1a1a2e,
  BACKGROUND_GRADIENT_TOP: 0x16213e,
  BACKGROUND_GRADIENT_BOTTOM: 0x0f3460,

  // 파티클
  PARTICLE_WHITE: 0xC0C8D4,
  PARTICLE_BLACK: 0xDAA520,
  PARTICLE_GLOW: 0xFFAA00,
  PARTICLE_SPARK: 0xFFFFFF,
};

// 기물 타입
export const PIECE_TYPES = {
  KING: 'k',
  QUEEN: 'q',
  ROOK: 'r',
  BISHOP: 'b',
  KNIGHT: 'n',
  PAWN: 'p'
};

// 기물 한국어 이름
export const PIECE_NAMES_KO = {
  k: '킹',
  q: '퀸',
  r: '룩',
  b: '비숍',
  n: '나이트',
  p: '폰'
};

// 기물 유니코드
export const PIECE_UNICODE = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟'
};

// 기물 가치 (AI 평가용)
export const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// 게임 모드
export const GAME_MODES = {
  VS_COMPUTER: 'vs_computer',
  LOCAL_MULTIPLAYER: 'local_multiplayer',
  PUZZLE: 'puzzle',
  TUTORIAL: 'tutorial'
};

// AI 난이도
export const AI_DIFFICULTY = {
  BEGINNER: { level: 1, name: '입문', depth: 1, errorRate: 0.4 },
  EASY: { level: 2, name: '쉬움', depth: 2, errorRate: 0.25 },
  MEDIUM: { level: 3, name: '보통', depth: 3, errorRate: 0.1 },
  HARD: { level: 4, name: '어려움', depth: 4, errorRate: 0.03 },
  EXPERT: { level: 5, name: '최고', depth: 5, errorRate: 0 }
};

// 이벤트 이름
export const EVENTS = {
  PIECE_SELECT: 'piece:select',
  PIECE_DESELECT: 'piece:deselect',
  MOVE_MAKE: 'move:make',
  MOVE_ANIMATED: 'move:animated',
  MOVE_COMPLETE: 'move:complete',
  PIECE_CAPTURED: 'piece:captured',
  GAME_OVER: 'game:over',
  GAME_START: 'game:start',
  GAME_RESET: 'game:reset',
  CAMERA_ROTATE: 'camera:rotate',
  PROMOTION_REQUEST: 'promotion:request',
  PROMOTION_SELECT: 'promotion:select',
  AI_THINKING: 'ai:thinking',
  AI_MOVE: 'ai:move',
  PUZZLE_CHECK: 'puzzle:check',
  PUZZLE_CORRECT: 'puzzle:correct',
  PUZZLE_WRONG: 'puzzle:wrong',
  TUTORIAL_STEP: 'tutorial:step',
  HINT_REQUEST: 'hint:request',
  HINT_SHOW: 'hint:show',
  UI_SCREEN_CHANGE: 'ui:screenChange',
  SOUND_PLAY: 'sound:play',
  UNDO_MOVE: 'undo:move',
};

// 게임 결과
export const GAME_RESULTS = {
  WHITE_WINS: 'white_wins',
  BLACK_WINS: 'black_wins',
  DRAW: 'draw'
};

// 게임 종료 사유
export const GAME_END_REASONS = {
  CHECKMATE: '체크메이트',
  STALEMATE: '스테일메이트',
  THREEFOLD_REPETITION: '3회 반복',
  FIFTY_MOVES: '50수 규칙',
  INSUFFICIENT_MATERIAL: '기물 부족',
  RESIGNATION: '기권',
  DRAW_AGREEMENT: '합의 무승부'
};

// 파일/랭크 레이블
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

// 애니메이션 설정
export const ANIMATION = {
  MOVE_DURATION: 0.3,
  MOVE_HEIGHT: 0.5,
  CAPTURE_PARTICLE_COUNT: 30,
  CAPTURE_SPARK_COUNT: 60,
  CAPTURE_DURATION: 1.2,
  FADE_DURATION: 0.8
};

// 카메라 설정
export const CAMERA = {
  FOV: 50,
  NEAR: 0.1,
  FAR: 100,
  INITIAL_POSITION: { x: 0, y: 10, z: 8 },
  LOOK_AT: { x: 0, y: 0, z: 0 },
  MIN_DISTANCE: 5,
  MAX_DISTANCE: 20,
  MIN_POLAR_ANGLE: Math.PI * 0.05,
  MAX_POLAR_ANGLE: Math.PI * 0.45,
  DAMPING_FACTOR: 0.08
};
