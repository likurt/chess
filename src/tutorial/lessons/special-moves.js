export const SPECIAL_MOVE_LESSONS = [
  {
    id: 'lesson-castling',
    title: '캐슬링',
    icon: '🏰',
    description: '킹과 룩의 특수 이동, 캐슬링을 배웁니다.',
    steps: [
      { text: '캐슬링은 킹과 룩을 동시에 이동하는 특수한 수입니다. 킹사이드(O-O)와 퀸사이드(O-O-O) 두 종류가 있습니다.', fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', highlights: ['g1', 'c1'] },
      { text: '캐슬링 조건: 1) 킹과 룩이 한 번도 이동하지 않았을 것 2) 킹과 룩 사이에 기물이 없을 것 3) 킹이 체크 상태가 아닐 것 4) 킹이 지나가는 칸이 공격받지 않을 것', fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', highlights: [] },
      { text: '킹사이드 캐슬링: 킹이 g1으로, 룩이 f1으로 이동합니다. 직접 해보세요!', fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-en-passant',
    title: '앙파상',
    icon: '⚡',
    description: '폰의 특수 잡기, 앙파상을 배웁니다.',
    steps: [
      { text: '상대 폰이 두 칸 전진하여 내 폰 옆에 왔을 때, 바로 다음 수에 한해서 그 폰을 대각선으로 잡을 수 있습니다.', fen: '8/8/8/8/3Pp3/8/8/8 b - d3 0 1', highlights: ['d3'] },
      { text: '앙파상은 "지나가면서 잡기"라는 뜻의 프랑스어입니다. 상대 폰이 두 칸 전진한 직후에만 사용 가능합니다.', fen: '8/8/8/8/3Pp3/8/8/8 b - d3 0 1', highlights: ['d3'] },
    ]
  },
  {
    id: 'lesson-promotion',
    title: '폰 승진',
    icon: '👑',
    description: '폰이 상대편 끝에 도달했을 때의 승진을 배웁니다.',
    steps: [
      { text: '폰이 보드의 반대쪽 끝(백: 8랭크, 흑: 1랭크)에 도달하면 반드시 다른 기물로 승진해야 합니다.', fen: '8/4P3/8/8/8/8/8/4K3 w - - 0 1', highlights: ['e8'] },
      { text: '퀸, 룩, 비숍, 나이트 중 하나를 선택할 수 있습니다. 대부분 퀸을 선택하지만, 나이트 승진이 체크메이트를 만들 수도 있습니다!', fen: '8/4P3/8/8/8/8/8/4K3 w - - 0 1', highlights: [] },
    ]
  },
];
