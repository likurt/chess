import { PIECE_MOVE_LESSONS } from './lessons/piece-moves.js';
import { SPECIAL_MOVE_LESSONS } from './lessons/special-moves.js';
import { OPENING_LESSONS } from './lessons/openings.js';
import { STRATEGY_LESSONS } from './lessons/strategies.js';

export class TutorialManager {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.categories = [
      { id: 'piece-moves', name: '기물 이동 규칙', lessons: PIECE_MOVE_LESSONS },
      { id: 'special-moves', name: '특수 이동', lessons: SPECIAL_MOVE_LESSONS },
      { id: 'openings', name: '오프닝 가이드', lessons: OPENING_LESSONS },
      { id: 'strategies', name: '전략 원칙', lessons: STRATEGY_LESSONS },
    ];
    this.currentLesson = null;
    this.currentStep = 0;
  }

  getAllCategories() {
    return this.categories;
  }

  getLesson(lessonId) {
    for (const cat of this.categories) {
      const lesson = cat.lessons.find(l => l.id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }

  loadLesson(lessonId) {
    this.currentLesson = this.getLesson(lessonId);
    this.currentStep = 0;
    return this.currentLesson;
  }

  getCurrentStep() {
    if (!this.currentLesson) return null;
    return this.currentLesson.steps[this.currentStep] || null;
  }

  nextStep() {
    if (!this.currentLesson) return null;
    if (this.currentStep < this.currentLesson.steps.length - 1) {
      this.currentStep++;
      return this.getCurrentStep();
    }
    // 레슨 완료
    this.storageManager.markLessonCompleted(this.currentLesson.id);
    return null;
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      return this.getCurrentStep();
    }
    return null;
  }

  isCompleted(lessonId) {
    const completed = this.storageManager.getCompletedLessons();
    return completed.includes(lessonId);
  }

  getTotalSteps() {
    return this.currentLesson ? this.currentLesson.steps.length : 0;
  }

  getCurrentStepIndex() {
    return this.currentStep;
  }
}
