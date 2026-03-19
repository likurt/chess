export const PIECE_MOVE_LESSONS = [
  {
    id: 'lesson-pawn',
    title: '폰의 이동',
    icon: '♙',
    description: '폰의 기본 이동과 잡기 방법을 배웁니다.',
    steps: [
      { text: '폰은 앞으로 한 칸 이동합니다. 시작 위치에서는 두 칸까지 전진할 수 있습니다.', fen: '8/8/8/8/8/8/4P3/8 w - - 0 1', highlights: ['e3', 'e4'] },
      { text: '폰은 대각선 앞으로 한 칸 이동하여 적 기물을 잡습니다. 직진으로는 잡을 수 없습니다.', fen: '8/8/8/8/8/3p1p2/4P3/8 w - - 0 1', highlights: ['d3', 'f3'] },
      { text: '폰이 상대편 끝 줄에 도달하면 퀸, 룩, 비숍, 나이트 중 하나로 승진합니다.', fen: '8/4P3/8/8/8/8/8/8 w - - 0 1', highlights: ['e8'] },
      { text: '자유롭게 폰을 움직여보세요!', fen: '8/8/8/8/8/8/PPPPPPPP/8 w - - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-rook',
    title: '룩의 이동',
    icon: '♖',
    description: '룩의 직선 이동을 배웁니다.',
    steps: [
      { text: '룩은 가로(랭크) 또는 세로(파일)로 원하는 만큼 이동합니다. 다른 기물을 뛰어넘을 수 없습니다.', fen: '8/8/8/8/3R4/8/8/8 w - - 0 1', highlights: ['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4'] },
      { text: '자유롭게 룩을 움직여보세요!', fen: '8/8/8/8/8/8/8/R7 w - - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-bishop',
    title: '비숍의 이동',
    icon: '♗',
    description: '비숍의 대각선 이동을 배웁니다.',
    steps: [
      { text: '비숍은 대각선으로 원하는 만큼 이동합니다. 항상 같은 색 칸에만 머무릅니다.', fen: '8/8/8/8/3B4/8/8/8 w - - 0 1', highlights: ['a1','b2','c3','e5','f6','g7','h8','a7','b6','c5','e3','f2','g1'] },
      { text: '자유롭게 비숍을 움직여보세요!', fen: '8/8/8/8/8/8/8/2B5 w - - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-knight',
    title: '나이트의 이동',
    icon: '♘',
    description: '나이트의 L자 이동을 배웁니다.',
    steps: [
      { text: '나이트는 L자 모양으로 이동합니다 (2칸+1칸). 유일하게 다른 기물을 뛰어넘을 수 있습니다!', fen: '8/8/8/8/3N4/8/8/8 w - - 0 1', highlights: ['b3','b5','c2','c6','e2','e6','f3','f5'] },
      { text: '자유롭게 나이트를 움직여보세요!', fen: '8/8/8/8/8/8/8/1N6 w - - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-queen',
    title: '퀸의 이동',
    icon: '♕',
    description: '가장 강력한 기물, 퀸의 이동을 배웁니다.',
    steps: [
      { text: '퀸은 룩+비숍의 이동을 합친 것입니다. 가로, 세로, 대각선 모든 방향으로 원하는 만큼 이동합니다.', fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1', highlights: [] },
      { text: '자유롭게 퀸을 움직여보세요!', fen: '8/8/8/8/8/8/8/3Q4 w - - 0 1', freePlay: true },
    ]
  },
  {
    id: 'lesson-king',
    title: '킹의 이동',
    icon: '♔',
    description: '킹의 이동과 체크의 개념을 배웁니다.',
    steps: [
      { text: '킹은 모든 방향으로 한 칸씩 이동합니다. 가장 중요한 기물이지만 이동 범위는 제한적입니다.', fen: '8/8/8/8/3K4/8/8/8 w - - 0 1', highlights: ['c3','c4','c5','d3','d5','e3','e4','e5'] },
      { text: '킹이 공격받는 상태를 "체크"라고 합니다. 체크를 반드시 벗어나야 합니다. 킹을 잡히면 게임이 끝납니다!', fen: '8/8/8/8/3K4/8/8/8 w - - 0 1', highlights: [] },
      { text: '자유롭게 킹을 움직여보세요!', fen: '8/8/8/8/8/8/8/4K3 w - - 0 1', freePlay: true },
    ]
  },
];
