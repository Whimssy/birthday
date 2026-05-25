import React, { useState, useEffect } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import Game from './components/Game';
import Story from './components/Story';
import BalloonPop from './components/BalloonPop';
import PhotoCarousel from './components/PhotoCarousel';
import GiftBox from './components/GiftBox';
import BirthdayCard from './components/BirthdayCard';
import FloatingDecor from './components/FloatingDecor';
import Confetti from './components/Confetti';
import soundManager from './utils/soundManager';

function App() {
  const [step, setStep] = useState('welcome');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize sound manager
  useEffect(() => {
    soundManager.init();
    
    // Set up first-click to enable audio
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
    };
  }, []);

  const sisterPhotos = [
    {
      url: "/photos/photo1.jpeg",
      caption: "The Beautiful Beginning",
      story: "A bright-eyed girl with dreams as vast as the ocean. Full of laughter, curiosity, and endless potential.",
      isVideo: false
    },
    {
      url: "/photos/photo2.jpeg",
      caption: "Finding Her Wave",
      story: "As she grew, she discovered her strength. Like the ocean, she learned to be both gentle and powerful.",
      isVideo: false
    },
    {
      url: "/photos/photo3.jpeg",
      caption: "Discovering Her Worth",
      story: "She realized she was a diamond - rare, precious, and unbreakable.",
      isVideo: false
    },
    {
      url: "/photos/photo4.jpeg",
      caption: "Claiming Her Crown",
      story: "She became the queen of her own destiny. Independent, fierce, and unstoppable.",
      isVideo: false
    },
    {
      url: "/photos/photo5.jpeg",
      caption: "Radiating Excellence",
      story: "Her light grew brighter with each passing year. Elegant, smart, and utterly captivating.",
      isVideo: false
    },
    {
      url: "/Photos/birthday-video1.mp4",
      caption: "Special Video Message",
      story: "A heartwarming video message filled with love and celebration just for you!",
      isVideo: true
    },
    {
      url: "/Photos/birthday-video2.mp4",
      caption: "Celebration & Memories",
      story: "Beautiful memories and celebration moments compiled just for you.",
      isVideo: true
    },
    {
      url: "/photos/photo8.jpeg",
      caption: "The Birthday Goddess",
      story: "Today we celebrate the masterpiece she has become. Beautiful inside and out. Strong and shining!",
      isVideo: false
    }
  ];

  const specialEditedPhoto = "/photos/edited-sister.jpg";

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
  
  const afterCarousel = () => {
    soundManager.playTransition();
    soundManager.setStage('giftbox');
    setStep('giftbox');
  };
  
  const afterGiftBox = () => {
    soundManager.playReveal();
    soundManager.setStage('card');
    setStep('card');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
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

  return (
    <div className="app">
      <button 
        onClick={toggleSound}
        className="sound-control-btn"
        aria-label="Toggle Sound"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      <FloatingDecor />
      <Confetti active={showConfetti} />
      <div className="container">
        {step === 'welcome' && <Welcome onStart={startGame} />}
        {step === 'game' && <Game onComplete={afterGame} />}
        {step === 'story' && <Story onComplete={afterStory} />}
        {step === 'balloon' && <BalloonPop onComplete={afterBalloon} photos={sisterPhotos} />}
        {step === 'carousel' && <PhotoCarousel photos={sisterPhotos} onComplete={afterCarousel} />}
        {step === 'giftbox' && <GiftBox onComplete={afterGiftBox} sisterPhoto={specialEditedPhoto} />}
        {step === 'card' && <BirthdayCard onReset={resetJourney} />}
      </div>
    </div>
  );
}

export default App;