export class AudioManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.ctx = null;
  }

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  }

  play(sound) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      switch (sound) {
        case 'move': this.playMove(ctx); break;
        case 'capture': this.playCapture(ctx); break;
        case 'check': this.playCheck(ctx); break;
        case 'checkmate': this.playCheckmate(ctx); break;
        case 'castle': this.playCastle(ctx); break;
        case 'illegal': this.playIllegal(ctx); break;
        case 'promote': this.playPromote(ctx); break;
        case 'gamestart': this.playGameStart(ctx); break;
        case 'correct': this.playCorrect(ctx); break;
        case 'wrong': this.playWrong(ctx); break;
      }
    } catch (e) { /* 오디오 실패 무시 */ }
  }

  playTone(ctx, freq, duration, type = 'sine', vol = this.volume) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playMove(ctx) {
    this.playTone(ctx, 300, 0.08, 'sine');
    setTimeout(() => this.playTone(ctx, 250, 0.06, 'sine'), 30);
  }

  playCapture(ctx) {
    this.playTone(ctx, 200, 0.15, 'sawtooth', this.volume * 0.8);
    this.playTone(ctx, 100, 0.2, 'triangle');
  }

  playCheck(ctx) {
    this.playTone(ctx, 500, 0.12, 'square', this.volume * 0.5);
    setTimeout(() => this.playTone(ctx, 600, 0.1, 'square', this.volume * 0.5), 100);
  }

  playCheckmate(ctx) {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.playTone(ctx, f, 0.3, 'sine'), i * 120);
    });
  }

  playCastle(ctx) {
    this.playTone(ctx, 280, 0.1, 'sine');
    setTimeout(() => this.playTone(ctx, 350, 0.1, 'sine'), 80);
    setTimeout(() => this.playTone(ctx, 280, 0.08, 'sine'), 160);
  }

  playIllegal(ctx) {
    this.playTone(ctx, 150, 0.15, 'sawtooth', this.volume * 0.4);
  }

  playPromote(ctx) {
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => this.playTone(ctx, f, 0.15, 'sine'), i * 60);
    });
  }

  playGameStart(ctx) {
    this.playTone(ctx, 440, 0.15, 'sine');
    setTimeout(() => this.playTone(ctx, 550, 0.2, 'sine'), 150);
  }

  playCorrect(ctx) {
    this.playTone(ctx, 523, 0.12, 'sine');
    setTimeout(() => this.playTone(ctx, 659, 0.15, 'sine'), 100);
  }

  playWrong(ctx) {
    this.playTone(ctx, 200, 0.2, 'square', this.volume * 0.4);
  }

  setEnabled(enabled) { this.enabled = enabled; }
  setVolume(vol) { this.volume = Math.max(0, Math.min(1, vol)); }
}
