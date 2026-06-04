import React from 'react';
import '../styles/Welcome.css';
import soundManager from '../utils/soundManager';

const Welcome = ({ onStart, onUpload }) => {
  const handleStart = () => {
    soundManager.init();
    soundManager.resume();
    soundManager.playClick();
    soundManager.setStage('game');
    onStart();
  };

  const handleUploadClick = () => {
    soundManager.playClick();
    if (onUpload) onUpload();
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
      
      {/* UPLOAD SECTION - Family Photo Upload Button */}
      <div className="family-upload-section">
        <div className="family-upload-divider">
          <span className="divider-line"></span>
          <span className="divider-emoji">💝</span>
          <span className="divider-line"></span>
        </div>
        <button className="family-upload-btn" onClick={handleUploadClick}>
          <div className="upload-btn-content">
            <span className="upload-icon-large">📸</span>
            <div className="upload-text">
              <span className="upload-title">FAMILY PHOTO UPLOAD</span>
              <span className="upload-description">Click here to add your special memories of our birthday queen!</span>
            </div>
            <span className="upload-arrow">👉</span>
          </div>
        </button>
        <p className="family-upload-hint">Everyone in the family can add photos & videos - they'll appear as a surprise gift! 🎁</p>
      </div>
    </div>
  );
};

export default Welcome;