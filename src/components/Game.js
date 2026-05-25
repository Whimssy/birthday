import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';
import soundManager from '../utils/soundManager';

const Game = ({ onComplete }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(true);
  const [pearlPosition, setPearlPosition] = useState({ x: 50, y: 50 });
  const [combo, setCombo] = useState(0);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    soundManager.init();
    soundManager.setStage('game');
    return () => soundManager.stopMusic();
  }, []);

  useEffect(() => {
    if (!gameActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    
    const moveInterval = setInterval(() => {
      if (gameAreaRef.current) {
        const maxX = gameAreaRef.current.clientWidth - 100;
        const maxY = gameAreaRef.current.clientHeight - 100;
        setPearlPosition({
          x: Math.random() * maxX,
          y: Math.random() * maxY
        });
      }
    }, 800);

    return () => clearInterval(moveInterval);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive && timeLeft === 0) {
      if (score >= 8) {
        soundManager.playSuccess();
        setTimeout(() => onComplete(), 500);
      }
    }
  }, [gameActive, score, timeLeft, onComplete]);

  const collectPearl = () => {
    if (!gameActive) return;
    soundManager.playPop();
    
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    const bonus = Math.floor(newCombo / 3);
    setScore(prev => prev + 1 + bonus);
    
    setTimeout(() => setCombo(0), 1000);
  };

  const tryAgain = () => {
    soundManager.playClick();
    setScore(0);
    setTimeLeft(15);
    setGameActive(true);
    setCombo(0);
  };

  if (!gameActive && timeLeft === 0 && score < 8) {
    return (
      <div className="game-result-card">
        <div className="result-emoji">🌊💔</div>
        <h2 className="result-title">Almost there, captain!</h2>
        <p className="result-text">You collected {Math.floor(score)} pearls — the sea challenges you once more.</p>
        <button className="game-button touch-button" onClick={tryAgain}>
          🌊 Dive Again 🌊
        </button>
      </div>
    );
  }

  if (!gameActive && score >= 8) {
    return (
      <div className="game-result-card victory">
        <div className="result-emoji">🏆🎉🐚</div>
        <h2 className="result-title">YOU DID IT!</h2>
        <p className="result-text">You collected {Math.floor(score)} magical pearls! Adrenaline rush: COMPLETE ✨</p>
        <p className="result-quote">"She who conquers the sea, conquers her dreams."</p>
      </div>
    );
  }

  return (
    <div className="game-card">
      <div className="game-header">
        <div className="game-icon">🐚 ADRENALINE DIVE 🐠</div>
        <div className="game-stats">
          <div className="stat-box">
            <span className="stat-label">TIME</span>
            <span className="stat-value">{timeLeft}s</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">PEARLS</span>
            <span className="stat-value">{Math.floor(score)} / 8</span>
          </div>
          {combo > 1 && (
            <div className="combo-box">
              <span className="combo-label">{combo}x COMBO!</span>
            </div>
          )}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(score / 8) * 100}%` }}></div>
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="game-area touch-game-area"
      >
        <button
          className="pearl touch-pearl"
          onClick={collectPearl}
          style={{
            left: pearlPosition.x,
            top: pearlPosition.y
          }}
        >
          <span className="pearl-emoji">🦪</span>
          <span className="pearl-sparkle">✨</span>
        </button>
      </div>
      
      <div className="game-instruction">
        <p>⚡ Tap the moving pearl as fast as you can! ⚡</p>
        <p className="game-tip">💡 Need 8 pearls before time runs out! Combo bonus = extra points! 💡</p>
      </div>
    </div>
  );
};

export default Game;