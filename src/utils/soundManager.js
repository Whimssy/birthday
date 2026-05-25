class SoundManager {
  constructor() {
    this.isMuted = false;
    this.currentStage = 'welcome';
    this.audioContext = null;
    this.isInitialized = false;
    this.musicInterval = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.isInitialized = true;
      console.log('Sound manager initialized');
    } catch(e) {
      console.log('Web Audio API not supported');
    }
  }

  // Resume audio context (call this on user interaction)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Generic playSound method (for backward compatibility)
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

  // Play pop sound (for pearls)
  playPop() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(800, 0.15, 0.2);
  }

  // Play click sound (for buttons)
  playClick() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(600, 0.12, 0.1);
  }

  // Play success fanfare
  playSuccess() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(523.25, 0.2, 0.5);
    setTimeout(() => this.playTone(659.25, 0.2, 0.5), 100);
  }

  // Play balloon pop sound
  playBalloonPop() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(1000, 0.18, 0.15);
  }

  // Play reveal sound
  playReveal() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(440, 0.2, 0.8);
  }

  // Play gift open sound
  playGiftOpen() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(300, 0.2, 0.6);
  }

  // Play transition sound
  playTransition() {
    if (this.isMuted) return;
    this.resume();
    this.playTone(400, 0.12, 0.3);
  }

  // Generic tone generator
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
      console.log('Error playing sound:', e);
    }
  }

  // Play background music
  playMusic(stage) {
    if (this.isMuted) return;
    this.resume();
    
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
    }
    
    const notes = {
      welcome: [261.63, 293.66, 329.63, 349.23],
      game: [329.63, 349.23, 392.00, 440.00],
      story: [261.63, 329.63, 392.00, 523.25],
      balloon: [349.23, 440.00, 523.25, 587.33],
      carousel: [293.66, 349.23, 440.00, 523.25],
      giftbox: [261.63, 392.00, 523.25, 659.25],
      card: [329.63, 415.30, 523.25, 659.25]
    };
    
    const melody = notes[stage] || notes.welcome;
    let noteIndex = 0;
    
    this.musicInterval = setInterval(() => {
      if (!this.isMuted) {
        this.playTone(melody[noteIndex % melody.length], 0.06, 0.8);
        noteIndex++;
      }
    }, 2000);
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
      this.playMusic(stage);
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

export default new SoundManager();