// Web Audio API Synthesized Sound Manager & Haptics Service for SwipeX
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('swipex_sound_enabled') !== 'false';
    this.hapticsEnabled = localStorage.getItem('swipex_haptics_enabled') !== 'false';
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
  }

  toggleSound(state) {
    this.enabled = state;
    localStorage.setItem('swipex_sound_enabled', String(state));
  }

  toggleHaptics(state) {
    this.hapticsEnabled = state;
    localStorage.setItem('swipex_haptics_enabled', String(state));
  }

  // Soft synthesised click tick
  playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
      
      this.vibrate(10);
    } catch (e) {
      console.warn('Web Audio synthesis bypassed:', e);
    }
  }

  // Soft synthesised hover tick
  playHover() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.audioCtx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.03);
    } catch (e) {
      // ignore hover errors
    }
  }

  // Dual tone success sound
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      
      // Tone 1
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(349.23, now); // F4
      osc1.frequency.setValueAtTime(523.25, now + 0.1); // C5
      gain1.gain.setValueAtTime(0.03, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start();
      osc1.stop(now + 0.25);

      this.vibrate([15, 30, 15]);
    } catch (e) {
      console.warn('Web Audio synthesis bypassed:', e);
    }
  }

  // Mobile haptics vibration wrapper
  vibrate(pattern) {
    if (!this.hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // ignore vibration failures
      }
    }
  }
}

export default new SoundManager();
