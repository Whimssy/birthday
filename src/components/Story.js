import React, { useState } from 'react';
import '../styles/Story.css';
import soundEffects from '../utils/soundManager';

const Story = ({ onComplete }) => {
  const [chapter, setChapter] = useState(0);
  
  const chapters = [
    {
      title: "🌊 The Little Mermaid's First Breath",
      text: "Once upon a gleaming shore, a little girl was born with salt in her curls and laughter like waves. She was curious, fierce, and full of sparkle — she loved the sea's vast mystery. Every summer, she'd dive into turquoise waters, swimming until stars blinked awake. Her name? The one we celebrate today — our dearest sister, our radiant gem.",
      vibe: "🌸 Young & Playful"
    },
    {
      title: "🐚 The Girl Who Danced with Currents",
      text: "As seasons flowed, she grew like a coral reef — vibrant and unapologetic. Teenage years brought wild tides, but she learned to navigate storms with a heart of gold. She became the sunshine of every cruise, the rhythm of every party, and the most loyal friend. She discovered that beauty is strength, and strength is courage to be soft and wild.",
      vibe: "💃 Spirited & Joyful"
    },
    {
      title: "✨ The Woman Who Commands the Horizon",
      text: "Now look at her: A stunning, mature, confident, and powerful woman. The sea still whispers her name. She walks into any room like a queen stepping off a yacht — bougie, classy, unstoppable. Her journey from a pretty girl to this magnetic goddess inspires everyone. She owns her story, sails her own cruise, and shines brighter than any treasure.",
      vibe: "🔥 Sexy, Bougie, Confident"
    }
  ];

  const current = chapters[chapter];
  const isLast = chapter === chapters.length - 1;

  const nextChapter = () => {
    soundEffects.playClick();
    if (isLast) {
      onComplete();
    } else {
      setChapter(prev => prev + 1);
    }
  };

  const prevChapter = () => {
    soundEffects.playClick();
    if (chapter > 0) {
      setChapter(prev => prev - 1);
    }
  };

  return (
    <div className="story-card">
      <div className="story-title">{current.title}</div>
      <div className="story-text">{current.text}</div>
      <div className="story-vibe">~ {current.vibe} ~</div>
      <div className="story-buttons">
        {chapter > 0 && (
          <button className="story-nav-button" onClick={prevChapter}>
            ⏮️ Previous
          </button>
        )}
        <button className="story-nav-button primary" onClick={nextChapter}>
          {isLast ? '💖 See Your Card 💖' : 'Next 🌊'}
        </button>
      </div>
    </div>
  );
};

export default Story;