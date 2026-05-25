import React, { useState, useEffect } from 'react';
import '../styles/BalloonPop.css';
import soundManager from '../utils/soundManager';

const BalloonPop = ({ onComplete, photos }) => {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const [popEffects, setPopEffects] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(null);
  const [powerUpActive, setPowerUpActive] = useState(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#F0E68C', '#FFB6C1', '#87CEEB', '#FFD700'
  ];

  const powerUpColors = ['#FFD700', '#FF69B4', '#00CED1'];

  useEffect(() => {
    soundManager.init();
    soundManager.setStage('balloon');
    
    // Create 15 balloons
    const newBalloons = [];
    for (let i = 0; i < 15; i++) {
      const isPowerUp = Math.random() < 0.2;
      newBalloons.push({
        id: i,
        color: isPowerUp ? powerUpColors[Math.floor(Math.random() * powerUpColors.length)] : colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10,
        popped: false,
        delay: Math.random() * 2,
        scale: 0.8 + Math.random() * 0.6,
        isPowerUp: isPowerUp,
        points: isPowerUp ? 2 : 1
      });
    }
    setBalloons(newBalloons);
    
    return () => soundManager.stopMusic();
  }, []);

  useEffect(() => {
    if (combo > 0) {
      if (comboTimer) clearTimeout(comboTimer);
      const timer = setTimeout(() => {
        setCombo(0);
      }, 2000);
      setComboTimer(timer);
    }
    return () => {
      if (comboTimer) clearTimeout(comboTimer);
    };
  }, [combo]);

  const popBalloon = (id) => {
    const balloon = balloons.find(b => b.id === id);
    if (!balloon || balloon.popped) return;
    
    soundManager.playBalloonPop();
    
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    const comboBonus = Math.floor(newCombo / 5);
    const pointsEarned = balloon.points + comboBonus;
    
    setPoppedCount(prev => prev + pointsEarned);
    
    if (balloon.isPowerUp) {
      setPowerUpActive(true);
      setTimeout(() => setPowerUpActive(false), 3000);
    }
    
    setBalloons(prev => prev.map(b => 
      b.id === id ? { ...b, popped: true } : b
    ));
    
    const newEffect = {
      id: Date.now(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      points: pointsEarned,
      isPowerUp: balloon.isPowerUp
    };
    setPopEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setPopEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 600);
  };

  useEffect(() => {
    if (poppedCount >= 15 && !showPhotos) {
      soundManager.playSuccess();
      setTimeout(() => {
        setShowPhotos(true);
      }, 500);
    }
  }, [poppedCount, showPhotos]);

  if (showPhotos) {
    return (
      <div className="photos-reveal">
        <div className="photos-container">
         
          <button className="continue-button" onClick={() => {
            soundManager.playClick();
            onComplete();
          }}>
            Continue to Birthday Surprise
          </button>
        </div>
      </div>
    );
  }

  const remaining = Math.max(0, 15 - poppedCount);
  const progressPercent = Math.min(100, (poppedCount / 15) * 100);

  return (
    <div className="balloon-game">
      <div className="balloon-header">
        <h2>✦ BALLOON POP CHALLENGE ✦</h2>
        <div className="balloon-counter">
          <div className="counter-stats">
            <span className="counter-number">{Math.floor(poppedCount)}</span>
            <span className="counter-total"> / 15</span>
            {combo > 0 && (
              <div className="combo-badge">
                <span className="combo-text">{combo}x COMBO!</span>
              </div>
            )}
            {powerUpActive && (
              <div className="powerup-badge">
                <span className="powerup-text">⚡ POWER-UP ACTIVE ⚡</span>
              </div>
            )}
          </div>
          <div className="counter-bar">
            <div className="counter-fill" style={{ width: `${progressPercent}%` }}>
              <span className="counter-percent">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
        <div className="game-instruction-box">
          <p className="balloon-instruction">
            {remaining > 0 ? (
              <span>🎈 Click the balloons! <strong>{remaining}</strong> more to go! 🎈</span>
            ) : (
              <span>Loading your beautiful photos...</span>
            )}
          </p>
          <div className="game-tips">
            <span className="tip">✦ Gold balloons = 2 points ✦</span>
            <span className="tip">✦ 5x combo = bonus point ✦</span>
            <span className="tip">✦ Pop fast for high score ✦</span>
          </div>
        </div>
      </div>
      
      <div className="balloons-area">
        {balloons.map(balloon => (
          !balloon.popped && (
            <button
              key={balloon.id}
              className={`balloon ${balloon.isPowerUp ? 'powerup' : ''}`}
              onClick={() => popBalloon(balloon.id)}
              style={{
                left: `${balloon.x}%`,
                top: `${balloon.y}%`,
                backgroundColor: balloon.color,
                animationDelay: `${balloon.delay}s`,
                transform: `scale(${balloon.scale})`
              }}
            >
              <div className="balloon-string"></div>
              <span className="balloon-emoji">{balloon.isPowerUp ? '⭐' : '🎈'}</span>
              <div className="balloon-shine"></div>
            </button>
          )
        ))}
      </div>
      
      {popEffects.map(effect => (
        <div key={effect.id} className="pop-effect-bubble" style={{ left: `${effect.x}%`, top: `${effect.y}%` }}>
          {effect.isPowerUp ? `+${effect.points} ⭐` : `+${effect.points}`}
        </div>
      ))}
      
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`
          }}>
            ✦
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalloonPop;