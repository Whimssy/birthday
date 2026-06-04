import React, { useState, useEffect, useRef } from 'react';
import '../styles/BalloonPop.css';
import soundManager from '../utils/soundManager';

const BalloonPop = ({ onComplete, photos }) => {
  const [balloons, setBalloons] = useState([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [popEffects, setPopEffects] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState(null);
  const [bestCombo, setBestCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [showPerfectMessage, setShowPerfectMessage] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  
  const spawnIntervalRef = useRef(null);
  const balloonsRef = useRef([]);
  const animationFrameRef = useRef(null);
  const animationActiveRef = useRef(true);

  const NEED_TO_WIN = 15;
  const MAX_BALLOONS_ON_SCREEN = 12;
  const SPAWN_DELAY = 800;

  const balloonColors = [
    '#FF0000', '#FF4444', '#FF6666', '#FF8C00', '#FFA500', '#FFB347',
    '#FFD700', '#FFEB3B', '#FFF176', '#32CD32', '#00FF00', '#7CFC00',
    '#00CED1', '#40E0D0', '#48D1CC', '#1E90FF', '#4169E1', '#6495ED',
    '#9370DB', '#9B59B6', '#BA55D3', '#FF69B4', '#FFB6C1', '#FFC0CB',
    '#FFFFFF', '#F5F5F5', '#FFFAFA'
  ];

  const stringColors = ['#8B4513', '#A0522D', '#D2691E', '#654321'];

  // Keep balloonsRef in sync
  useEffect(() => {
    balloonsRef.current = balloons;
  }, [balloons]);

  const spawnBalloon = () => ({
    id: Date.now() + Math.random() * 100000,
    color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
    stringColor: stringColors[Math.floor(Math.random() * stringColors.length)],
    x: 5 + Math.random() * 90,
    y: -20 - Math.random() * 15,
    speed: 0.25 + Math.random() * 0.35,
    scale: 0.7 + Math.random() * 0.5,
    rotation: Math.random() * 360,
    swaySpeed: 0.2 + Math.random() * 0.5,
    swayOffset: Math.random() * Math.PI * 2,
    rotationSpeed: 0.15 + Math.random() * 0.3,
    popped: false,
    stringWiggle: Math.random() * Math.PI * 2
  });

  // Start spawning balloons - INFINITE
  useEffect(() => {
    const initialBalloons = [];
    for (let i = 0; i < 5; i++) {
      initialBalloons.push(spawnBalloon());
    }
    setBalloons(initialBalloons);
    
    // Continuous spawning - never stops until win
    spawnIntervalRef.current = setInterval(() => {
      if (!gameWin) {
        setBalloons(prev => {
          const activeCount = prev.filter(b => !b.popped).length;
          // Always spawn new balloons, but limit total on screen
          if (activeCount < MAX_BALLOONS_ON_SCREEN + 5) {
            return [...prev, spawnBalloon()];
          }
          return prev;
        });
      }
    }, SPAWN_DELAY);

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [gameWin]);

  // Animation loop - optimized with RAF and cleanup
  useEffect(() => {
    let lastTimestamp = 0;
    animationActiveRef.current = true;
    
    const animate = (timestamp) => {
      if (!animationActiveRef.current) return;
      
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Cap delta to prevent large jumps
      const delta = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      
      // Update balloon positions
      setBalloons(prevBalloons => {
        const newBalloons = [];
        for (const balloon of prevBalloons) {
          if (balloon.popped) continue;
          
          const swayX = Math.sin(Date.now() * 0.002 * balloon.swaySpeed + balloon.swayOffset) * 0.35;
          let newX = balloon.x + swayX * (delta * 60);
          let newY = balloon.y + balloon.speed * (delta * 60);
          const newRotation = balloon.rotation + balloon.rotationSpeed * (delta * 60);
          
          // Remove if off screen
          if (newY >= 100) continue;
          
          // Keep within bounds
          newX = Math.max(2, Math.min(98, newX));
          
          newBalloons.push({
            ...balloon,
            x: newX,
            y: newY,
            rotation: newRotation,
            stringWiggle: balloon.stringWiggle + 0.03
          });
        }
        return newBalloons;
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      animationActiveRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Combo timer
  useEffect(() => {
    if (combo > 0) {
      if (comboTimer) clearTimeout(comboTimer);
      const timer = setTimeout(() => {
        if (combo > bestCombo) setBestCombo(combo);
        setCombo(0);
      }, 1500);
      setComboTimer(timer);
    }
    return () => {
      if (comboTimer) clearTimeout(comboTimer);
    };
  }, [combo, comboTimer, bestCombo]);

  // Check win condition
  useEffect(() => {
    if (!gameWin && poppedCount >= NEED_TO_WIN) {
      setGameWin(true);
      soundManager.playSuccess();
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      setTimeout(() => onComplete(), 2500);
    }
  }, [poppedCount, gameWin, onComplete]);

  const popBalloon = (id) => {
    if (gameWin) return;
    
    const balloon = balloonsRef.current.find(b => b.id === id);
    if (!balloon || balloon.popped) return;
    
    soundManager.playBalloonPop();
    
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > bestCombo) setBestCombo(newCombo);
    setPoppedCount(prev => prev + 1);
    setScore(prev => prev + 10 + Math.floor(newCombo / 2) * 2);
    
    if (newCombo >= 5 && newCombo % 5 === 0) {
      setShowPerfectMessage(true);
      setTimeout(() => setShowPerfectMessage(false), 1000);
    }
    
    setBalloons(prev => prev.filter(b => b.id !== id));
    
    const newEffect = {
      id: Date.now(),
      x: balloon.x,
      y: balloon.y,
      color: balloon.color,
      isCombo: combo >= 2,
      comboCount: newCombo
    };
    setPopEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setPopEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 500);
  };

  const remainingToWin = NEED_TO_WIN - poppedCount;
  const progressPercent = (poppedCount / NEED_TO_WIN) * 100;
  const balloonsOnScreen = balloons.length;

  // Win Celebration
  if (gameWin) {
    return (
      <div className="game-win-container">
        <div className="game-win-content">
          <div className="win-emoji">🏆🎉✨🏆</div>
          <h2>YOU WIN!</h2>
          <p>You popped {poppedCount} beautiful balloons!</p>
          <div className="game-win-stats">
            <div className="game-win-stat">
              <span>🎈 Balloons Popped</span>
              <strong>{poppedCount}</strong>
            </div>
            <div className="game-win-stat">
              <span>🔥 Best Combo</span>
              <strong>{bestCombo}x</strong>
            </div>
            <div className="game-win-stat">
              <span>💎 Score</span>
              <strong>{score}</strong>
            </div>
          </div>
          <div className="win-message">
            <p>✨ YOU'RE AMAZING! ✨</p>
            <p>🎁 Get ready for your photo carousel and gifts! 🎁</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ocean-rain-container">
      {showPerfectMessage && (
        <div className="perfect-message">
          <div className="perfect-content">
            <div className="perfect-emoji">💥✨💥</div>
            <h3>PERFECT COMBO!</h3>
            <p>{combo}x in a row!</p>
          </div>
        </div>
      )}

      <div className="ocean-header">
        <h1 className="ocean-title">
          <span>🎈🌊</span>
          RAINING BALLOONS!
          <span>🌊🎈</span>
        </h1>
        
        <div className="ocean-subtitle">
          Pop {NEED_TO_WIN} balloons to win! Balloons fall continuously!
        </div>
        
        <div className="ocean-stats">
          <div className="ocean-stat goal-ocean">
            <div className="stat-icon">🎈</div>
            <div className="stat-number">{poppedCount}</div>
            <div className="stat-label">POPPED</div>
          </div>
          
          <div className="ocean-stat">
            <div className="stat-icon">⭐</div>
            <div className="stat-number">{remainingToWin}</div>
            <div className="stat-label">NEEDED</div>
          </div>
          
          <div className="ocean-stat combo-ocean">
            <div className="stat-icon">🔥</div>
            <div className="stat-number">{combo > 1 ? `${combo}x` : '0'}</div>
            <div className="stat-label">COMBO</div>
          </div>
          
          <div className="ocean-stat score-ocean">
            <div className="stat-icon">💎</div>
            <div className="stat-number">{score}</div>
            <div className="stat-label">SCORE</div>
          </div>
          
          <div className="ocean-stat best-ocean">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">{bestCombo}x</div>
            <div className="stat-label">BEST</div>
          </div>
        </div>

        <div className="ocean-progress">
          <div className="progress-bar-ocean">
            <div className="progress-fill-ocean" style={{ width: `${progressPercent}%` }}>
              <span className="progress-text">{Math.round(progressPercent)}%</span>
            </div>
          </div>
          <div className="progress-message-ocean">
            <span>💨 Pop {remainingToWin} more to win! Balloons keep falling! 💨</span>
          </div>
        </div>
        
        <div className="balloon-counter-info">
          <span>🎈 {balloonsOnScreen} balloons floating</span>
        </div>
      </div>

      <div className="ocean-balloons-arena">
        {balloons.map(balloon => (
          <button
            key={balloon.id}
            className="ocean-balloon"
            onClick={() => popBalloon(balloon.id)}
            style={{
              left: `${balloon.x}%`,
              top: `${balloon.y}%`,
              transform: `scale(${balloon.scale}) rotate(${balloon.rotation}deg)`
            }}
          >
            <div className="balloon-body" style={{ backgroundColor: balloon.color }}>
              <div className="balloon-shine-ocean"></div>
              <div className="balloon-highlight"></div>
            </div>
            <div className="balloon-string-ocean" style={{
              backgroundColor: balloon.stringColor,
              transform: `rotate(${Math.sin(balloon.stringWiggle) * 3}deg)`
            }}></div>
          </button>
        ))}
      </div>

      {popEffects.map(effect => (
        <div key={effect.id} className="pop-burst-ocean" style={{ left: `${effect.x}%`, top: `${effect.y}%` }}>
          <div className="burst-circle" style={{ backgroundColor: effect.color }}></div>
          <div className="burst-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="burst-particle" style={{
                transform: `rotate(${i * 30}deg) translateY(-20px)`,
                backgroundColor: effect.color
              }}></div>
            ))}
          </div>
          <div className="pop-number-ocean">+{10 + Math.floor(effect.comboCount / 2) * 2}</div>
          {effect.isCombo && <div className="pop-combo-ocean">{effect.comboCount}x COMBO!</div>}
        </div>
      ))}

      {combo > 1 && (
        <div className="combo-meter-ocean">
          <div className="combo-meter-fill-ocean" style={{ width: `${Math.min(100, combo * 10)}%` }}></div>
          <span className="combo-meter-text-ocean">{combo}x COMBO!</span>
        </div>
      )}

      <div className="light-rain">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="rain-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}>
            💧
          </div>
        ))}
      </div>

      <div className="instruction-panel">
        <div className="instruction-title">🎮 HOW TO PLAY 🎮</div>
        <div className="instruction-items">
          <div className="instruction-item">
            <span className="instr-icon">👇</span>
            <span>TAP on any balloon to POP it!</span>
          </div>
          <div className="instruction-item">
            <span className="instr-icon">🔥</span>
            <span>Pop consecutively for COMBO bonus!</span>
          </div>
          <div className="instruction-item">
            <span className="instr-icon">🎯</span>
            <span>Pop {NEED_TO_WIN} balloons to win!</span>
          </div>
          <div className="instruction-item">
            <span className="instr-icon">💨</span>
            <span>Balloons fall continuously!</span>
          </div>
          <div className="instruction-item">
            <span className="instr-icon">✨</span>
            <span>No rush - take your time!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalloonPop;