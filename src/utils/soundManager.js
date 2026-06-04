class SoundManager {
  constructor() {
    this.isMuted = false;
    this.currentStage = 'welcome';
    this.audioContext = null;
    this.isInitialized = false;
    this.musicInterval = null;
    this.currentMelodyIndex = 0;
  }

  init() {
    if (this.isInitialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
    } catch(e) {
      console.warn('Audio not supported');
    }
  }

  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  playSound(soundName) {
    if (this.isMuted) return;
    this.resume();
    
    switch(soundName) {
      case 'pop':
        this.playPop();
        break;
      case 'click':
        this.playClick();
        break;
      case 'success':
        this.playSuccess();
        break;
      case 'balloonPop':
        this.playBalloonPop();
        break;
      case 'reveal':
        this.playReveal();
        break;
      case 'giftOpen':
        this.playGiftOpen();
        break;
      case 'transition':
        this.playTransition();
        break;
      default:
        this.playTone(600, 0.1, 0.2);
    }
  }

  playPop() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(800, 0.15, 0.2);
  }

  playClick() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(600, 0.12, 0.1);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.resume();
    this.playMelodicSuccess();
  }

  playMelodicSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 0.3), i * 100);
    });
  }

  playBalloonPop() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(1000, 0.18, 0.15);
  }

  playReveal() {
    if (this.isMuted) return;
    this.resume();
    const notes = [440, 523.25, 659.25, 783.99];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, 0.4), i * 80);
    });
  }

  playGiftOpen() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(300, 0.2, 0.6);
  }

  playTransition() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(400, 0.12, 0.3);
  }

  playTone(frequency, volume, duration) {
    if (!this.audioContext) {
      this.init();
    }
    
    try {
      const ctx = this.audioContext;
      if (!ctx) return;
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.value = volume;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration);
    } catch(e) {
      // Silent fail
    }
  }

  playMelody(melody, tempo = 400) {
    melody.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.08, 0.6), i * tempo);
    });
  }

  playMusic(stage) {
    if (this.isMuted) return;
    this.resume();
    
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
    }
    
    // Richer melodies for each stage
    const melodies = {
      welcome: [
        [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
        [523.25, 493.88, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63]
      ],
      game: [
        [329.63, 349.23, 392.00, 440.00, 392.00, 349.23, 329.63, 293.66],
        [440.00, 493.88, 523.25, 587.33, 523.25, 493.88, 440.00, 392.00]
      ],
      story: [
        [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00],
        [523.25, 659.25, 783.99, 523.25, 392.00, 329.63, 261.63, 196.00]
      ],
      balloon: [
        [349.23, 440.00, 523.25, 587.33, 698.46, 587.33, 523.25, 440.00],
        [587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25]
      ],
      carousel: [
        [293.66, 349.23, 440.00, 523.25, 659.25, 523.25, 440.00, 349.23],
        [440.00, 523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25]
      ],
      giftbox: [
        [261.63, 392.00, 523.25, 659.25, 783.99, 659.25, 523.25, 392.00],
        [392.00, 523.25, 659.25, 783.99, 987.77, 783.99, 659.25, 523.25]
      ],
      card: [
        [329.63, 415.30, 523.25, 659.25, 783.99, 880.00, 987.77, 1046.50],
        [783.99, 659.25, 523.25, 415.30, 329.63, 261.63, 196.00, 174.61]
      ]
    };
    
    const stageMelodies = melodies[stage] || melodies.welcome;
    let melodyIndex = 0;
    let noteIndex = 0;
    
    this.musicInterval = setInterval(() => {
      if (!this.isMuted && this.currentStage === stage) {
        const currentMelody = stageMelodies[melodyIndex % stageMelodies.length];
        this.playTone(currentMelody[noteIndex % currentMelody.length], 0.06, 0.9);
        noteIndex++;
        
        // Switch melody every 16 notes
        if (noteIndex % 16 === 0) {
          melodyIndex++;
        }
      }
    }, 600);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  setStage(stage) {
    this.currentStage = stage;
    this.stopMusic();
    if (!this.isMuted) {
      setTimeout(() => this.playMusic(stage), 100);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.playMusic(this.currentStage);
    }
    return this.isMuted;
  }
}

const soundManager = new SoundManager();
export default soundManager;