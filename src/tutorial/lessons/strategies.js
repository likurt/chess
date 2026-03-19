export const STRATEGY_LESSONS = [
  {
    id: 'lesson-center-control',
    title: '중앙 지배',
    icon: '🎯',
    description: '보드 중앙을 지배하는 것이 왜 중요한지 배웁니다.',
    steps: [
      { text: 'e4, d4, e5, d5 네 칸을 "중앙"이라고 합니다. 중앙을 지배하면 기물이 더 많은 칸을 제어할 수 있습니다.', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', highlights: ['d4', 'e4', 'd5', 'e5'] },
      { text: 'e4에 있는 나이트는 가장자리에 있는 나이트보다 두 배 이상 많은 칸을 제어합니다!', fen: '8/8/8/8/4N3/8/8/N7 w - - 0 1', highlights: [] },
    ]
  },
  {
    id: 'lesson-piece-development',
    title: '기물 전개',
    icon: '🚀',
    description: '빠르고 효율적인 기물 전개를 배웁니다.',
    steps: [
      { text: '오프닝에서는 모든 기물을 빨리 활성화하세요. 같은 기물을 여러 번 움직이지 마세요.', fen: 'r1bqk2r/ppppbppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 5', highlights: [] },
      { text: '퀸을 너무 일찍 꺼내면 상대 기물의 공격 목표가 됩니다. 나이트와 비숍을 먼저 전개하세요.', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', highlights: [] },
    ]
  },
  {
    id: 'lesson-king-safety',
    title: '킹의 안전',
    icon: '🏰',
    description: '킹을 안전하게 보호하는 방법을 배웁니다.',
    steps: [
      { text: '가능한 한 빨리 캐슬링하여 킹을 안전하게 하세요. 킹 앞의 폰을 함부로 전진시키지 마세요.', fen: 'r3kb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5', highlights: ['g1'] },
      { text: '캐슬링 후에는 킹 앞의 폰 구조(f2, g2, h2)를 유지하여 킹을 보호하세요.', fen: 'r3kb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 0 5', highlights: ['f2', 'g2', 'h2'] },
    ]
  },
];
