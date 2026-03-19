import { eventBus } from '../utils/EventBus.js';
import { EVENTS } from '../utils/Constants.js';

export class AIEngine {
  constructor() {
    this.worker = null;
    this.isThinking = false;
    this.initWorker();
  }

  initWorker() {
    this.worker = new Worker(
      new URL('./ai-worker.js', import.meta.url),
      { type: 'module' }
    );

    this.worker.onmessage = (e) => {
      if (e.data.type === 'result') {
        this.isThinking = false;
        eventBus.emit(EVENTS.AI_THINKING, { isThinking: false });
        eventBus.emit(EVENTS.AI_MOVE, {
          move: e.data.move,
          evaluation: e.data.evaluation,
        });
      }
    };

    this.worker.onerror = (err) => {
      console.error('AI Worker error:', err);
      this.isThinking = false;
      eventBus.emit(EVENTS.AI_THINKING, { isThinking: false });
    };
  }

  search(fen, difficulty) {
    if (this.isThinking) return;

    this.isThinking = true;
    eventBus.emit(EVENTS.AI_THINKING, { isThinking: true });

    this.worker.postMessage({
      type: 'search',
      fen,
      difficulty,
    });
  }

  stop() {
    if (this.worker) {
      this.worker.terminate();
      this.initWorker();
      this.isThinking = false;
    }
  }

  cleanup() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
