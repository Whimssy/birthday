import React, { useEffect } from 'react';
import '../styles/Confetti.css';

const Confetti = ({ active }) => {
  useEffect(() => {
    if (!active) return;
    
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
      confetti.style.width = 5 + Math.random() * 10 + 'px';
      confetti.style.height = 10 + Math.random() * 15 + 'px';
      confetti.style.animationDuration = 1 + Math.random() * 2 + 's';
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      container.appendChild(confetti);
    }
    
    const timeout = setTimeout(() => container.remove(), 4000);
    return () => {
      clearTimeout(timeout);
      if (container.parentNode) container.remove();
    };
  }, [active]);
  
  return null;
};

export default Confetti;