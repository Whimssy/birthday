import React, { useState } from 'react';
import '../styles/GiftBox.css';
import soundManager from '../utils/soundManager';

const GiftBox = ({ onComplete, sisterPhoto, familyPhotos = [], familyMessages = [] }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);
  const [showPromisePopup, setShowPromisePopup] = useState(false);
  const [selectedPromise, setSelectedPromise] = useState(null);

  const messageColors = [
    { primary: '#FF6B6B', light: '#FF6B6B20' },
    { primary: '#FF69B4', light: '#FF69B420' },
    { primary: '#FFD700', light: '#FFD70020' },
    { primary: '#4ECDC4', light: '#4ECDC420' },
    { primary: '#96CEB4', light: '#96CEB420' },
    { primary: '#9B59B6', light: '#9B59B620' },
    { primary: '#3498DB', light: '#3498DB20' },
    { primary: '#E74C3C', light: '#E74C3C20' }
  ];

  const messagesWithColors = familyMessages.map((msg, idx) => ({
    ...msg,
    color: messageColors[idx % messageColors.length].primary,
    lightColor: messageColors[idx % messageColors.length].light
  }));

  const nextMessage = () => {
    if (currentMessageIndex < messagesWithColors.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
      soundManager.playClick();
    } else if (!showFinalCelebration) {
      setShowFinalCelebration(true);
      soundManager.playSuccess();
    }
  };

  const prevMessage = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(prev => prev - 1);
      soundManager.playClick();
    }
  };

  const goToMessage = (index) => {
    setCurrentMessageIndex(index);
    soundManager.playClick();
  };

  const openPhotoModal = (photo) => {
    setSelectedPhoto(photo);
    soundManager.playClick();
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
  };

  const showPromiseDetails = (promise) => {
    if (promise && promise.name && promise.promise) {
      setSelectedPromise(promise);
      setShowPromisePopup(true);
      soundManager.playClick();
    }
  };

  const closePromisePopup = () => {
    setShowPromisePopup(false);
    setSelectedPromise(null);
  };

  const handleRestart = () => {
    soundManager.playClick();
    onComplete();
  };

  const currentMessage = messagesWithColors[currentMessageIndex];

  // Debug: Log what photos we have
  console.log('Family Photos in GiftBox:', familyPhotos);
  familyPhotos.forEach(photo => {
    console.log('Photo:', photo.caption, 'Has promise:', !!photo.promise, photo.promise);
  });

  // Final Celebration
  if (showFinalCelebration) {
    return (
      <div className="final-celebration-cartoon">
        <div className="celebration-backdrop-cartoon"></div>
        <div className="fireworks-cartoon">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="firework-cartoon" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}>🎆</div>
          ))}
        </div>
        <div className="final-floating-hearts-cartoon">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="final-heart-cartoon" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`
            }}>
              {i % 3 === 0 ? '💖' : i % 3 === 1 ? '💝' : '💕'}
            </div>
          ))}
        </div>
        <div className="celebration-content-cartoon">
          <div className="celebration-crown-cartoon">👑🎉👑</div>
          <h1 className="celebration-title-cartoon">🎈 CONGRATULATIONS! 🎈</h1>
          <div className="celebration-card-cartoon">
            <div className="message-glow-cartoon"></div>
            <div className="celebration-text-cartoon">
              <p className="big-message-cartoon">🎊 YOU DID IT, QUEEN! 🎊</p>
              <p className="sub-message-cartoon">You completed the entire celebration journey!</p>
              <div className="message-divider-cartoon">⭐ ✨ ⭐</div>
              <p className="fun-message-cartoon">You've unlocked all the special surprises! 🎂🎁🎈</p>
            </div>
          </div>
          <button className="restart-celebration-btn-cartoon" onClick={handleRestart}>
            <span className="restart-icon-cartoon">🔄</span>
            <span className="restart-text-cartoon">EXPERIENCE AGAIN!</span>
            <span className="restart-icon-cartoon">🎮</span>
          </button>
          <p className="restart-hint-cartoon">Click to start a new adventure and celebrate again!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="giftbox-cartoon-container">
      {/* Promise Popup Modal */}
      {showPromisePopup && selectedPromise && (
        <div className="promise-popup-overlay" onClick={closePromisePopup}>
          <div className="promise-popup" onClick={(e) => e.stopPropagation()}>
            <button className="promise-popup-close" onClick={closePromisePopup}>✕</button>
            <div className="promise-popup-header">
              <div className="promise-popup-emoji">💝✨💝</div>
              <h2>A Special Promise Made For You!</h2>
            </div>
            <div className="promise-popup-from">
              <span className="from-label">From:</span>
              <span className="from-name">{selectedPromise.name}</span>
            </div>
            <div className="promise-popup-text">
              <span className="quote-mark">"</span>
              {selectedPromise.promise}
              <span className="quote-mark">"</span>
            </div>
            <div className="promise-popup-seal">
              <span>💖</span>
              This promise is sealed with love
              <span>💖</span>
            </div>
            <button className="promise-popup-button" onClick={closePromisePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="giftbox-hero-cartoon">
        <div className="hero-glow-cartoon"></div>
        <div className="hero-content-cartoon">
          <div className="hero-emblems-cartoon">
            <span className="emblem-cartoon">🎁</span>
            <span className="emblem-cartoon">💝</span>
            <span className="emblem-cartoon">🎀</span>
          </div>
          <h1 className="hero-title-cartoon">
            <span className="title-sparkle-cartoon">✨</span>
            SURPRISE! A SPECIAL GIFT FOR YOU!
            <span className="title-sparkle-cartoon">✨</span>
          </h1>
          <p className="hero-subtitle-cartoon">Messages, memories, and promises from everyone who loves you!</p>
        </div>
      </div>

      {/* Messages Carousel */}
      {messagesWithColors.length > 0 && (
        <>
          <div className="messages-carousel-cartoon">
            <button className={`carousel-arrow-cartoon prev ${currentMessageIndex === 0 ? 'disabled' : ''}`} onClick={prevMessage} disabled={currentMessageIndex === 0}>◀</button>
            <div className="message-card-container-cartoon">
              <div className="message-card-cartoon" style={{ background: `linear-gradient(135deg, ${currentMessage?.lightColor || '#FF6B6B20'}, rgba(255,255,255,0.98))`, borderLeftColor: currentMessage?.color || '#FF6B6B' }}>
                <div className="card-shine-cartoon"></div>
                <div className="message-icon-cartoon" style={{ background: currentMessage?.color || '#FF6B6B' }}>💌</div>
                <div className="message-header-cartoon">
                  <span className="message-from-cartoon" style={{ color: currentMessage?.color || '#FF6B6B' }}>
                    <span className="from-label-cartoon">From:</span> {currentMessage?.name || 'Family'}
                  </span>
                  <span className="message-heart-cartoon">❤️</span>
                </div>
                <div className="message-text-cartoon">"{currentMessage?.message || 'Happy Birthday! You are so loved!'}"</div>
                <div className="message-footer-cartoon">
                  <span className="message-emoji-cartoon">🎂</span>
                  <span className="message-date-cartoon">With love on your special day</span>
                  <span className="message-emoji-cartoon">🎁</span>
                </div>
              </div>
            </div>
            <button className={`carousel-arrow-cartoon next ${currentMessageIndex === messagesWithColors.length - 1 ? 'disabled' : ''}`} onClick={nextMessage}>▶</button>
          </div>
          <div className="message-progress-cartoon">
            {messagesWithColors.map((msg, idx) => (
              <span key={idx} className={`progress-dot-cartoon ${idx === currentMessageIndex ? 'active' : ''}`} style={{ background: idx === currentMessageIndex ? msg.color : '#ddd' }} onClick={() => goToMessage(idx)} />
            ))}
          </div>
          {currentMessageIndex < messagesWithColors.length - 1 && (
            <div className="next-hint-cartoon"><span className="hint-arrow-cartoon">👇</span><p>Click the arrow to see the next message!</p></div>
          )}
          {currentMessageIndex === messagesWithColors.length - 1 && (
            <div className="final-hint-cartoon">
              <div className="hint-pulse-cartoon"></div>
              <span className="hint-emoji-cartoon">🎁</span>
              <p>Click the arrow for a SURPRISE!</p>
              <span className="hint-emoji-cartoon">💝</span>
            </div>
          )}
        </>
      )}

      {/* Family Photos Gallery with Promise Buttons */}
      {familyPhotos.length > 0 && (
        <div className="photos-gallery-cartoon">
          <div className="gallery-header-cartoon">
            <div className="gallery-icon-cartoon">📸</div>
            <div className="gallery-line-cartoon"></div>
          </div>
          
          <div className="click-encouragement">
            <div className="encouragement-emoji">👉💖👈</div>
            <p className="encouragement-text">
              <span className="blink-text">CLICK ON ANY PHOTO</span> to see the memory
            </p>
            <div className="encouragement-stats">
              <span className="click-counter">📸 {familyPhotos.length} beautiful memories</span>
            </div>
            <div className="encouragement-arrow">⬇️ TAP ANY PHOTO BELOW ⬇️</div>
          </div>
          
          <h2 className="gallery-title-cartoon">
            <span>✨</span>
            FAMILY PHOTO GALLERY
            <span>✨</span>
          </h2>
          
          <div className="photos-masonry-cartoon">
            {familyPhotos.map((photo, idx) => {
              // Check if this photo has a promise
              const hasPromise = photo.promise && photo.promise.name && photo.promise.promise;
              console.log(`Photo ${idx}: ${photo.caption} - Has Promise: ${hasPromise}`);
              
              return (
                <div 
                  key={idx} 
                  className="gallery-photo-item-cartoon"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {photo.isVideo ? (
                    <div className="video-thumb-cartoon" onClick={() => openPhotoModal(photo)}>
                      <video src={photo.url} className="gallery-video-preview-cartoon" muted />
                      <div className="video-play-overlay-cartoon">▶</div>
                    </div>
                  ) : (
                    <img 
                      src={photo.url} 
                      alt={photo.caption} 
                      className="gallery-image-cartoon" 
                      onClick={() => openPhotoModal(photo)}
                    />
                  )}
                  <div className="photo-caption-overlay-cartoon" onClick={() => openPhotoModal(photo)}>
                    <p>{photo.caption}</p>
                    <span className="view-icon-cartoon">🔍 CLICK TO VIEW</span>
                  </div>
                  
                  {/* PROMISE BUTTON - Only show if promise exists */}
                  {hasPromise ? (
                    <button 
                      className="promise-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPromiseDetails(photo.promise);
                      }}
                    >
                      <span>💝</span>
                      View Promise from {photo.promise.name}
                      <span>✨</span>
                    </button>
                  ) : (
                    <div className="no-promise-badge">
                      <span>📸</span>
                      <span>Memory</span>
                    </div>
                  )}
                  
                  <div className="click-me-badge" onClick={() => openPhotoModal(photo)}>👆 CLICK ME!</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="restart-section-cartoon">
        <button className="restart-main-btn-cartoon" onClick={handleRestart}>
          <span className="restart-icon-cartoon">🔄</span>
          <span className="restart-text-cartoon">RESTART JOURNEY</span>
          <span className="restart-icon-cartoon">🎮</span>
        </button>
        <p className="restart-main-hint-cartoon">Want to experience the celebration again? Click here!</p>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="photo-modal-cartoon" onClick={closePhotoModal}>
          <div className="photo-modal-content-cartoon" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-cartoon" onClick={closePhotoModal}>✕</button>
            <div className="modal-media-wrapper-cartoon">
              {selectedPhoto.isVideo ? (
                <video src={selectedPhoto.url} controls autoPlay className="modal-video-cartoon" />
              ) : (
                <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="modal-image-cartoon" />
              )}
            </div>
            <div className="modal-caption-cartoon">
              <h3>{selectedPhoto.caption}</h3>
              <p className="modal-story">{selectedPhoto.story || "A beautiful memory shared just for you 💝"}</p>
              
              {/* Promise Button in Modal */}
              {selectedPhoto.promise && selectedPhoto.promise.name && selectedPhoto.promise.promise && (
                <button 
                  className="modal-promise-btn"
                  onClick={() => showPromiseDetails(selectedPhoto.promise)}
                >
                  <span>💝</span>
                  Read the Promise from {selectedPhoto.promise.name}
                  <span>✨</span>
                </button>
              )}
              
              <div className="modal-heart-cartoon">
                <span>💖</span>
                <span>DOUBLE TAP TO CLOSE</span>
                <span>💖</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cartoon Decorations */}
      <div className="floating-cartoon-decor">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="cartoon-decor" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`
          }}>
            {i % 5 === 0 ? '🎈' : i % 5 === 1 ? '💖' : i % 5 === 2 ? '✨' : i % 5 === 3 ? '🎁' : '⭐'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftBox;