import React, { useState, useEffect, useCallback } from 'react';
import '../styles/PhotoCarousel.css';

const PhotoCarousel = ({ photos, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState('next');
  const [videoPlaying, setVideoPlaying] = useState(false);

  const nextSlide = useCallback(() => {
    if (!photos || photos.length === 0) return;
    setDirection('next');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  }, [photos]);

  const prevSlide = () => {
    if (!photos || photos.length === 0) return;
    setDirection('prev');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const goToSlide = (index) => {
    if (!photos) return;
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  // Pause auto-play when video is playing
  useEffect(() => {
    if (videoPlaying) {
      setIsAutoPlaying(false);
    }
  }, [videoPlaying]);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && photos && photos.length > 0 && !videoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Increased to 5 seconds for better video viewing
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, photos, videoPlaying]);

  if (!photos || photos.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2 className="carousel-title">🌟 Loading Your Journey... 🌟</h2>
        </div>
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];
  // Check if current item is a video (by isVideo flag or file extension)
  const isVideo = currentPhoto.isVideo || 
                  (currentPhoto.url && 
                   (currentPhoto.url.endsWith('.mp4') || 
                    currentPhoto.url.endsWith('.mov') || 
                    currentPhoto.url.endsWith('.webm') ||
                    currentPhoto.url.endsWith('.avi')));

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setVideoPlaying(false);
    // Resume auto-play after video ends
    setTimeout(() => {
      if (!videoPlaying) {
        setIsAutoPlaying(true);
      }
    }, 1000);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">🌟 Her Journey of Success & Growth 🌟</h2>
        <p className="carousel-subtitle">From a beautiful girl to a stunning, powerful woman</p>
      </div>

      <div className="carousel-main">
        <button className="carousel-nav prev" onClick={prevSlide}>
          ◀
        </button>

        <div className="carousel-slide">
          <div className={`slide-content ${direction}`}>
            <div className="photo-wrapper">
              {isVideo ? (
                <div className="video-container">
                  <video 
                    src={currentPhoto.url} 
                    controls
                    className="carousel-video"
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    onEnded={handleVideoPause}
                    style={{
                      width: '100%',
                      height: '100%',
                      maxHeight: '450px',
                      objectFit: 'contain',
                      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                      borderRadius: '30px'
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div className="video-overlay-badge">
                    🎥 Video Message
                  </div>
                </div>
              ) : (
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.caption}
                  className="carousel-photo"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/500x500/FFD700/FFFFFF?text=Beautiful+Moment";
                  }}
                />
              )}
              <div className="photo-glow"></div>
            </div>
            <div className="photo-story">
              <div className="story-badge">
                <span className="badge-icon">✨</span>
                <span className="badge-text">Chapter {currentIndex + 1} of {photos.length}</span>
              </div>
              <h3 className="photo-title">
                {currentPhoto.caption}
                {isVideo && <span className="video-icon-title"> 🎬</span>}
              </h3>
              <p className="photo-description">{currentPhoto.story || "A beautiful moment in her journey"}</p>
              {isVideo && (
                <div className="video-tip">
                  💡 Click play to watch this special video message!
                </div>
              )}
              <div className="growth-marker">
                <div className="growth-line">
                  <div className="growth-fill" style={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}></div>
                </div>
                <div className="growth-stats">
                  <span>🌸 Beginning</span>
                  <span>💎 Queen Status: {Math.round(((currentIndex + 1) / photos.length) * 100)}%</span>
                  <span>👑 Full Bloom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="carousel-nav next" onClick={nextSlide}>
          ▶
        </button>
      </div>

      <div className="carousel-thumbnails">
        {photos.map((photo, index) => {
          const isVideoThumb = photo.isVideo || 
                              (photo.url && 
                               (photo.url.endsWith('.mp4') || 
                                photo.url.endsWith('.mov') || 
                                photo.url.endsWith('.webm')));
          return (
            <button
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            >
              {isVideoThumb ? (
                <div className="video-thumbnail">
                  <span className="video-icon">🎥</span>
                  <span className="video-play-icon">▶</span>
                </div>
              ) : (
                <img src={photo.url} alt={`Thumbnail ${index + 1}`} />
              )}
              <div className="thumbnail-overlay">
                <span>{index + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="carousel-controls">
        <button 
          className="auto-play-btn"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        >
          {isAutoPlaying ? '⏸ Pause Slideshow' : '▶ Play Slideshow'}
        </button>
        <button className="continue-celebration" onClick={onComplete}>
          🎁 Continue to Birthday Surprise 🎁
        </button>
      </div>

      <div className="floating-hearts">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="floating-heart" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}>
            {i % 2 === 0 ? '💖' : '✨'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;