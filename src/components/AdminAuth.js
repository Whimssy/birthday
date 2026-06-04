import React, { useState } from 'react';
import '../styles/AdminAuth.css';

const AdminAuth = ({ onAuthenticate, onBack }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Change this PIN to whatever you want
  const CORRECT_PIN = '2024'; // Use birthday year or special number

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      onAuthenticate();
    } else {
      setError('❌ Wrong PIN! Try again or ask the birthday girl! ❌');
      setPin('');
    }
  };

  return (
    <div className="admin-auth-overlay">
      <div className="admin-auth-card">
        <button className="auth-back-btn" onClick={onBack}>← Back to Celebration</button>
        <div className="auth-icon">📸✨</div>
        <h2 className="auth-title">Family Photo Upload</h2>
        <p className="auth-subtitle">Enter the secret PIN to add photos for our birthday queen!</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="password"
            className="auth-input"
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength="4"
            autoFocus
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit-btn">
            🔓 Unlock Upload Portal 🔓
          </button>
        </form>
        
        <p className="auth-hint">💡 Hint: It's a special year related to our beautiful sister! 💡</p>
      </div>
    </div>
  );
};

export default AdminAuth;