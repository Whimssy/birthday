import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import Game from './components/Game';
import Story from './components/Story';
import BalloonPop from './components/BalloonPop';
import PhotoCarousel from './components/PhotoCarousel';
import GiftBox from './components/GiftBox';
import PhotoUpload from './components/PhotoUpload';
import FloatingDecor from './components/FloatingDecor';
import soundManager from './utils/soundManager';
import { getPhotos, getMessages } from './utils/supabaseClient';

function App() {
  const [step, setStep] = useState('welcome');
  const [isMuted, setIsMuted] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [familyPhotos, setFamilyPhotos] = useState([]);
  const [familyMessages, setFamilyMessages] = useState([]);
  const [photosLoaded, setPhotosLoaded] = useState(false);

  const specialEditedPhoto = "/edited-sister.jpg";

  const defaultPhotos = [
    { url: "/Photos/photo1.jpeg", caption: "The Beautiful Beginning", story: "A bright-eyed girl with dreams as vast as the ocean.", isVideo: false },
    { url: "/Photos/photo2.jpeg", caption: "Finding Her Wave", story: "As she grew, she discovered her strength.", isVideo: false },
    { url: "/Photos/photo3.jpeg", caption: "Discovering Her Worth", story: "She realized she was a diamond - rare and precious.", isVideo: false },
    { url: "/Photos/photo4.jpeg", caption: "Claiming Her Crown", story: "She became the queen of her own destiny.", isVideo: false },
    { url: "/Photos/photo5.jpeg", caption: "Radiating Excellence", story: "Her light grew brighter with each passing year.", isVideo: false },
    { url: "/Photos/photo8.jpeg", caption: "The Birthday Goddess", story: "Today we celebrate the masterpiece she has become!", isVideo: false }
  ];

  const defaultVideos = [
    { url: "/Photos/birthday-video1.mp4", caption: "🎬 Special Video Message", story: "A heartwarming video message filled with love!", isVideo: true },
    { url: "/Photos/birthday-video2.mp4", caption: "🎬 Celebration & Memories", story: "Beautiful memories compiled just for you.", isVideo: true }
  ];

  const allDefaultMedia = [...defaultPhotos, ...defaultVideos];

  useEffect(() => {
    soundManager.init();
    
    const enableAudio = () => {
      soundManager.resume();
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    
    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      soundManager.stopMusic();
    };
  }, []);

  const loadFamilyPhotos = useCallback(async () => {
    try {
      const photos = await getPhotos();
      setFamilyPhotos(photos && photos.length > 0 ? photos : []);
      setPhotosLoaded(true);
    } catch (error) {
      console.error('Error loading family photos:', error);
      setFamilyPhotos([]);
      setPhotosLoaded(true);
    }
  }, []);

  const loadFamilyMessages = useCallback(async () => {
    try {
      const messages = await getMessages();
      setFamilyMessages(messages && messages.length > 0 ? messages : []);
    } catch (error) {
      console.error('Error loading family messages:', error);
      setFamilyMessages([]);
    }
  }, []);

  useEffect(() => {
    loadFamilyPhotos();
    loadFamilyMessages();
  }, [loadFamilyPhotos, loadFamilyMessages]);

  const startGame = () => {
    soundManager.playClick();
    soundManager.setStage('game');
    setStep('game');
  };
  
  const afterGame = () => {
    soundManager.setStage('story');
    setStep('story');
  };
  
  const afterStory = () => {
    soundManager.playTransition();
    soundManager.setStage('balloon');
    setStep('balloon');
  };
  
  const afterBalloon = () => {
    soundManager.setStage('carousel');
    setStep('carousel');
  };
  
  // ✅ FIXED: Carousel goes to GIFTBOX (family messages & photos), NOT back to balloon
  const afterCarousel = () => {
    soundManager.playTransition();
    soundManager.setStage('giftbox');
    setStep('giftbox');
  };
  
  const afterGiftBox = () => {
    resetJourney();
  };

  const resetJourney = () => {
    soundManager.playClick();
    soundManager.setStage('welcome');
    setStep('welcome');
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  const handleUploadComplete = () => {
    loadFamilyPhotos();
    loadFamilyMessages();
    setShowUpload(false);
  };

  if (!photosLoaded) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">✨</div>
          <p>Loading birthday memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <button onClick={toggleSound} className="sound-control-btn">
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      <FloatingDecor />
      
      <div className="container">
        {step === 'welcome' && <Welcome onStart={startGame} onUpload={toggleUpload} />}
        {step === 'game' && <Game onComplete={afterGame} />}
        {step === 'story' && <Story onComplete={afterStory} />}
        {step === 'balloon' && <BalloonPop onComplete={afterBalloon} photos={allDefaultMedia} />}
        {step === 'carousel' && <PhotoCarousel photos={allDefaultMedia} onComplete={afterCarousel} />}
        {step === 'giftbox' && (
          <GiftBox 
            onComplete={afterGiftBox} 
            sisterPhoto={specialEditedPhoto}
            familyPhotos={familyPhotos}
            familyMessages={familyMessages}
          />
        )}
      </div>

      {showUpload && (
        <div className="upload-modal-overlay" onClick={toggleUpload}>
          <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
            <PhotoUpload onComplete={handleUploadComplete} onPhotosUpdated={loadFamilyPhotos} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;