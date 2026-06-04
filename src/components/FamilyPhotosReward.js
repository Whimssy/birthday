import React, { useState, useEffect } from 'react';
import '../styles/FamilyPhotosReward.css';
import soundManager from '../utils/soundManager';

const FamilyPhotosReward = ({ photos, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    soundManager.playReveal();
    soundManager.setStage('card');
    
    // Auto-advance through photos
    if (photos.length > 0 && currentIndex < photos.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    } else if (currentIndex === photos.length - 1) {
      const timer = setTimeout(() => {
        setShowFinalMessage(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, photos.length]);

  const handleComplete = () => {
    soundManager.playClick();
    onComplete();
  };

  if (photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];
  const isVideo = currentPhoto.isVideo;

  return (
    <div className="family-reward-overlay">
      <div className="family-reward-container">
        <div className="reward-header">
          <span className="reward-crown">👑💝👑</span>
          <h1 className="reward-title">A Special Gift From Your Family!</h1>
          <p className="reward-subtitle">Everyone came together to share their favorite memories of you</p>
        </div>

        <div className="reward-media-container">
          {!showFinalMessage ? (
            <>
              <div className="media-wrapper">
                {isVideo ? (
                  <video 
                    src={currentPhoto.url} 
                    controls 
                    autoPlay
                    className="reward-video"
                    onEnded={() => {
                      if (currentIndex < photos.length - 1) {
                        setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
                      }
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img 
                    src={currentPhoto.url} 
                    alt={currentPhoto.caption}
                    className="reward-image"
                  />
                )}
                <div className="media-glow"></div>
              </div>
              <div className="media-caption">
                <div className="caption-badge">
                  <span>❤️ Family Memory {currentIndex + 1} of {photos.length} ❤️</span>
                </div>
                <h3>{currentPhoto.caption}</h3>
                <p>{currentPhoto.story || "A beautiful memory shared with love"}</p>
                <div className="progress-dots">
                  {photos.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`dot ${idx === currentIndex ? 'active' : ''} ${idx < currentIndex ? 'viewed' : ''}`}
                    ></span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="final-message">
              <div className="final-message-content">
                <div className="floating-hearts">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="heart-animation" style={{ animationDelay: `${i * 0.2}s` }}>
                      💖
                    </div>
                  ))}
                </div>
                <div className="final-emoji">🎉💖🎂👑💖🎉</div>
                <h2>You Are So Loved!</h2>
                <p>Every photo, every memory, every moment shared is a testament to how much you mean to all of us.</p>
                <p className="final-quote">"Family: where life begins and love never ends."</p>
                <button className="final-complete-btn" onClick={handleComplete}>
                  ✨ Start New Adventure ✨
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyPhotosReward;