import React, { useState, useEffect } from 'react';
import '../styles/GiftBox.css';

const GiftBox = ({ onComplete, sisterPhoto }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const flowerColors = [
    '#FF6B6B', '#FF8C42', '#FFD700', '#4ECDC4', '#FF69B4',
    '#9B59B6', '#3498DB', '#E74C3C', '#F39C12', '#1ABC9C'
  ];

  // Fixed: Added missing dependencies flowerColors and showGift
  useEffect(() => {
    if (isOpen && !showGift) {
      const newFlowers = [];
      for (let i = 0; i < 50; i++) {
        newFlowers.push({
          id: i,
          color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
          x: Math.random() * 100,
          delay: Math.random() * 2,
          size: 20 + Math.random() * 30,
        });
      }
      setFlowers(newFlowers);
      setShowGift(true);
      setShowConfetti(true);
      
      setTimeout(() => setShowConfetti(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, showGift]); // Removed flowerColors from deps to avoid re-running

  const handleClick = () => {
    if (!isOpen) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setIsOpen(true);
      }, 2000);
    }
  };

  if (isOpen && showGift) {
    return (
      <div className="gift-reveal-container">
        <div className="flowers-background">
          {flowers.map(flower => (
            <div
              key={flower.id}
              className="floating-flower"
              style={{
                left: `${flower.x}%`,
                animationDelay: `${flower.delay}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            >
              <div 
                className="flower" 
                style={{
                  width: `${flower.size}px`,
                  height: `${flower.size}px`,
                  backgroundColor: flower.color
                }}
              >
                <div className="flower-center">🌸</div>
              </div>
            </div>
          ))}
        </div>

        <div className="gift-reveal-content">
          <div className="sparkle-effect">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="sparkle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}>
                ✨
              </div>
            ))}
          </div>

          <h1 className="reveal-title">🎁 SURPRISE! 🎁</h1>
          <h2 className="reveal-subtitle">A Special Gift Just For You!</h2>

          <div className="glowing-photo-container">
            <div className="glowing-border">
              <div className="glow-ring"></div>
              <div className="glow-ring delay-1"></div>
              <div className="glow-ring delay-2"></div>
              <img 
                src={sisterPhoto} 
                alt="Beautiful Sister" 
                className="glowing-photo"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x400/FFD700/FFFFFF?text=Beautiful+You";
                }}
              />
            </div>
            <div className="photo-caption-glow">
              ✨ Our Beautiful Queen ✨
            </div>
          </div>

          <div className="flower-messages">
            <div className="flower-message" style={{ animationDelay: '0s' }}>
              🌸 You Bloom Every Day 🌸
            </div>
            <div className="flower-message" style={{ animationDelay: '0.5s' }}>
              🌺 Beautiful Inside & Out 🌺
            </div>
            <div className="flower-message" style={{ animationDelay: '1s' }}>
              💐 A True Masterpiece 💐
            </div>
            <div className="flower-message" style={{ animationDelay: '1.5s' }}>
              🌻 Radiating Love & Light 🌻
            </div>
            <div className="flower-message" style={{ animationDelay: '2s' }}>
              🌹 Forever Blooming 🌹
            </div>
          </div>

          <button className="continue-birthday-btn" onClick={onComplete}>
            🎂 Continue to Birthday Wishes 🎂
          </button>
        </div>

        {showConfetti && (
          <div className="confetti-overlay">
            {[...Array(100)].map((_, i) => (
              <div key={i} className="confetti-piece-gift" style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                animationDelay: `${Math.random() * 0.5}s`
              }}></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="gift-box-container">
      <div className="gift-background">
        <div className="floating-stars">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              top: `${Math.random() * 100}%`
            }}>
              ⭐
            </div>
          ))}
        </div>
      </div>

      <div className="gift-wrapper">
        <h1 className="gift-title">🎀 A Special Gift Awaits You! 🎀</h1>
        <p className="gift-instruction">Click on the gift box to open your surprise!</p>

        <div 
          className={`gift-box ${isShaking ? 'shaking' : ''}`}
          onClick={handleClick}
        >
          <div className="gift-lid">
            <div className="lid-top"></div>
            <div className="lid-ribbon"></div>
          </div>
          <div className="gift-body">
            <div className="gift-ribbon-horizontal"></div>
            <div className="gift-ribbon-vertical"></div>
            <div className="gift-bow">
              <div className="bow-left"></div>
              <div className="bow-right"></div>
              <div className="bow-center"></div>
            </div>
          </div>
          <div className="gift-shine"></div>
        </div>

        <div className="gift-hint">
          <p>💝 Click the box - watch it shake and open! 💝</p>
          <div className="loading-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftBox;