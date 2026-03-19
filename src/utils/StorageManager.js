const STORAGE_PREFIX = 'chess3d_';

export class StorageManager {
  save(key, data) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) { /* quota exceeded 등 무시 */ }
  }

  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  remove(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  // 설정
  getSettings() {
    return this.load('settings', {
      soundEnabled: true,
      volume: 0.5,
      autoRotateCamera: false,
      showHints: true,
    });
  }

  saveSettings(settings) {
    this.save('settings', settings);
  }

  // 퍼즐 진행
  getSolvedPuzzles() {
    return this.load('solvedPuzzles', []);
  }

  markPuzzleSolved(puzzleId) {
    const solved = this.getSolvedPuzzles();
    if (!solved.includes(puzzleId)) {
      solved.push(puzzleId);
      this.save('solvedPuzzles', solved);
    }
  }

  // 튜토리얼 진행
  getCompletedLessons() {
    return this.load('completedLessons', []);
  }

  markLessonCompleted(lessonId) {
    const completed = this.getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      this.save('completedLessons', completed);
    }
  }
}
