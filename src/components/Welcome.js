import React from 'react';
import '../styles/Welcome.css';
import soundManager from '../utils/soundManager';

const Welcome = ({ onStart }) => {
  const handleStart = () => {
    // Ensure audio context is initialized and resumed
    soundManager.init();
    soundManager.resume();
    soundManager.playClick();
    soundManager.setStage('game');
    onStart();
  };

  return (
    <div className="welcome-card">
      <div className="welcome-emoji">🎂🌊✨</div>
      <h1 className="welcome-title">Birthday Voyage</h1>
      <h2 className="welcome-subtitle">For Our Beautiful Big Sister</h2>
      <p className="welcome-text">The Sea's Favorite Daughter 👑</p>
      <p className="welcome-description">
        Get ready for an adrenaline rush, a magical story, and the most bougie celebration!
      </p>
      <button className="welcome-button" onClick={handleStart}>
        🐚 Start Dive & Celebration 🐚
      </button>
      <div className="welcome-quote">
        ✨ You deserve the best time of your life ✨
      </div>
    </div>
  );
};

export default Welcome;