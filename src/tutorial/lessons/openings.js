export const OPENING_LESSONS = [
  {
    id: 'lesson-opening-principles',
    title: '오프닝 원칙',
    icon: '📋',
    description: '체스 오프닝의 기본 원칙을 배웁니다.',
    steps: [
      { text: '오프닝의 3대 원칙: 1) 중앙을 지배하세요 (e4, d4 폰 전진) 2) 기물을 빨리 전개하세요 (나이트, 비숍) 3) 킹을 안전하게 하세요 (캐슬링)', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', highlights: ['e4', 'd4'] },
      { text: '중앙 폰을 전진시키면 기물의 활동 범위가 넓어집니다. e4나 d4로 시작해보세요.', fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', highlights: [] },
      { text: '나이트는 비숍보다 먼저 전개하는 것이 좋습니다. Nf3는 가장 인기있는 2번째 수 중 하나입니다.', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 2', highlights: [] },
    ]
  },
  {
    id: 'lesson-italian-game',
    title: '이탈리안 게임',
    icon: '🇮🇹',
    description: '가장 오래되고 인기있는 오프닝 중 하나입니다.',
    steps: [
      { text: '이탈리안 게임은 1.e4 e5 2.Nf3 Nc6 3.Bc4로 시작합니다. 비숍이 f7을 겨냥합니다.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3', highlights: ['f7'] },
      { text: '흑은 보통 Bc5(지오코 피아노) 또는 Nf6(투 나이츠 디펜스)로 응수합니다.', fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 3', highlights: ['c5', 'f6'] },
    ]
  },
  {
    id: 'lesson-sicilian',
    title: '시실리안 디펜스',
    icon: '🛡️',
    description: '흑이 가장 많이 사용하는 e4에 대한 응수입니다.',
    steps: [
      { text: '시실리안 디펜스는 1.e4 c5로 시작합니다. 흑은 비대칭적인 포지션을 만들어 반격합니다.', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', highlights: [] },
      { text: '백은 보통 2.Nf3를 두고, 흑은 d6(나이도르프), Nc6(클래식), e6(칸) 등으로 다양하게 진행합니다.', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 2', highlights: [] },
    ]
  },
];
