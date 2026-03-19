export const DIFFICULTY_PRESETS = {
  1: { name: '입문', depth: 1, errorRate: 0.4, useOpeningBook: false, timeLimit: 500, quiescence: false },
  2: { name: '쉬움', depth: 2, errorRate: 0.25, useOpeningBook: true, timeLimit: 1000, quiescence: false },
  3: { name: '보통', depth: 3, errorRate: 0.1, useOpeningBook: true, timeLimit: 2000, quiescence: true },
  4: { name: '어려움', depth: 4, errorRate: 0.03, useOpeningBook: true, timeLimit: 3000, quiescence: true },
  5: { name: '최고', depth: 5, errorRate: 0, useOpeningBook: true, timeLimit: 5000, quiescence: true },
};
