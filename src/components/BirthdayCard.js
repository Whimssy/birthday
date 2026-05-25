import React, { useState } from 'react';
import '../styles/BirthdayCard.css';
import soundEffects from '../utils/soundManager';
const BirthdayCard = ({ onReset }) => {
  const [showMessage, setShowMessage] = useState(false);
  
  const bougieQuotes = [
    "“Slay like the sea owns the shore — you're that icon.” 🛥️✨",
    "“She's a cruise director of her own destiny, champagne in hand.” 🥂🌊",
    "“Elegance is an attitude, darling — you're first class.” 💎",
    "“A queen who swims with sharks and still smells like roses.” 🦈🌹",
    "“Maturity looks this good? Yes, because it's you.” 🔥",
    "“Saltwater heals everything, but your smile? That's the real magic.” ✨"
  ];
  
  const randomQuote = bougieQuotes[Math.floor(Math.random() * bougieQuotes.length)];

  const handleReveal = () => {
    soundEffects.playClick();
    setShowMessage(!showMessage);
  };

  const handleReset = () => {
    soundEffects.playClick();
    onReset();
  };

  return (
    <div className="birthday-card">
      <div className="card-decoration">⚓</div>
      <h1 className="card-title">🎉 HAPPY BIRTHDAY, SIS! 🎉</h1>
      <div className="card-emoji">🌊👑🧜‍♀️</div>
      
      <div className="card-message">
        <p><strong>To our dazzling family friend's daughter — our big sister of the heart:</strong></p>
        <p>
          From a little mermaid splashing in tide pools to this <strong>stunning, confident, powerful woman</strong> 
          who commands every wave. You are beauty, brains, and bougie energy. May your days be filled with luxury 
          cruises, salty kisses from the sea, and endless celebrations. 🌊✨
        </p>
      </div>
      
      <div className="card-quote">🥂 {randomQuote} 🥂</div>
      
      <button className="sassy-button" onClick={handleReveal}>
        💋 Reveal Bougie Dedication 💋
      </button>
      
      {showMessage && (
        <div className="sassy-message">
          💎 <strong>SAY & BOUGIE DEDICATION</strong> 💎<br/>
          "You're not just a birthday girl, you're a whole vibe — a luxury yacht, a sunset cruise, 
          and a diamond diving into deep blue. Keep glowing, keep growing. SLAY THE DAY, SIS." <br/>
          ⚡🛥️💃
        </div>
      )}
      
      <div className="card-buttons">
        <button className="reset-button" onClick={handleReset}>
          🔁 Relive Adventure
        </button>
      </div>
      
      <p className="card-footer">✨ You deserve the best time of your life — today and always ✨</p>
    </div>
  );
};

export default BirthdayCard;