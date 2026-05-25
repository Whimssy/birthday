import { useEffect } from 'react';
import '../styles/FloatingDecor.css';

const FloatingDecor = () => {
  useEffect(() => {
    const icons = ['🌸', '🌺', '🌼', '🐚', '🌊', '⭐', '🐠', '🦋', '💎'];
    const container = document.createElement('div');
    container.className = 'floating-container';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
      const div = document.createElement('div');
      div.className = 'floating-item';
      div.style.left = Math.random() * 100 + '%';
      div.style.animationDuration = 8 + Math.random() * 12 + 's';
      div.style.animationDelay = Math.random() * 10 + 's';
      div.style.fontSize = 20 + Math.random() * 30 + 'px';
      div.style.opacity = 0.4 + Math.random() * 0.5;
      div.textContent = icons[Math.floor(Math.random() * icons.length)];
      container.appendChild(div);
    }

    return () => container.remove();
  }, []);

  return null;
};

export default FloatingDecor;