import React, { useState, useRef, useEffect } from 'react';
import { uploadPhoto, getPhotos, deletePhoto } from '../utils/supabaseClient';
import '../styles/PhotoUpload.css';

const PhotoUpload = ({ onComplete, onPhotosUpdated }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [story, setStory] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Promise States
  const [showPromiseModal, setShowPromiseModal] = useState(false);
  const [promise, setPromise] = useState('');
  const [promiseName, setPromiseName] = useState('');
  const [pendingUpload, setPendingUpload] = useState(null);
  
  const fileInputRef = useRef(null);
  const isUploadingRef = useRef(false);

  const promiseSuggestions = [
    "I promise to always be there for you...",
    "I promise to make you laugh every time we meet...",
    "I promise to celebrate you not just today, but every day...",
    "I promise to share more beautiful memories with you...",
    "I promise to remind you how amazing you are...",
    "I promise to be your biggest cheerleader...",
    "I promise to create more unforgettable moments with you...",
    "I promise to love and support you unconditionally..."
  ];

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const fetchedPhotos = await getPhotos();
      setPhotos(fetchedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      setMessage({ text: 'Failed to load photos', type: 'error' });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const performUpload = async () => {
    if (!pendingUpload) return;
    if (isUploadingRef.current) return;
    
    isUploadingRef.current = true;
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const { file, captionText, storyText, isVideo, promiseText, promiseNameText } = pendingUpload;
      
      setUploadProgress(30);
      
      const storyWithPromise = `${storyText}\n\n💝 Promise from ${promiseNameText}: "${promiseText}"`;
      
      await uploadPhoto(
        file,
        captionText,
        storyWithPromise,
        isVideo
      );
      
      setUploadProgress(100);
      
      setMessage({ 
        text: `✅ Successfully uploaded "${captionText}" with your promise! 🎉`, 
        type: 'success' 
      });
      
      // Clear form
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCaption('');
      setStory('');
      setPendingUpload(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await loadPhotos();
      if (onPhotosUpdated) onPhotosUpdated();
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ text: `Failed to upload: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
      isUploadingRef.current = false;
      setUploadProgress(0);
    }
  };

  const handleUploadClick = () => {
    if (selectedFiles.length === 0) {
      setMessage({ text: 'Please select files to upload', type: 'error' });
      return;
    }

    if (!caption.trim()) {
      setMessage({ text: 'Please add a caption', type: 'error' });
      return;
    }

    // Store the upload data and show promise modal
    setPendingUpload({
      file: selectedFiles[0], // Only upload first file for now
      captionText: caption + (selectedFiles.length > 1 ? ` (and ${selectedFiles.length - 1} more)` : ''),
      storyText: story || `A beautiful memory captured just for you! 💖`,
      isVideo: selectedFiles[0].type.startsWith('video/')
    });
    
    setShowPromiseModal(true);
  };

  const handlePromiseSubmit = async () => {
    if (!promiseName.trim()) {
      setMessage({ text: '💝 Please tell us who you are! 💝', type: 'error' });
      return;
    }
    if (!promise.trim()) {
      setMessage({ text: '📝 Please write a promise to our birthday queen! 📝', type: 'error' });
      return;
    }
    if (promise.length < 10) {
      setMessage({ text: '💖 Your promise is too short! Write something meaningful! 💖', type: 'error' });
      return;
    }
    
    // Add promise to pending upload
    setPendingUpload(prev => ({
      ...prev,
      promiseText: promise,
      promiseNameText: promiseName
    }));
    
    setShowPromiseModal(false);
    
    // Start upload
    await performUpload();
    
    // Reset promise fields for next upload
    setPromise('');
    setPromiseName('');
  };

  const handleDelete = async (photo) => {
    try {
      await deletePhoto(photo.id, photo.storage_path, photo.isVideo);
      setMessage({ text: '🗑️ Photo deleted successfully', type: 'success' });
      await loadPhotos();
      if (onPhotosUpdated) onPhotosUpdated();
      setTimeout(() => setMessage({ text: '', type: '' }), 2000);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ text: 'Failed to delete photo', type: 'error' });
    }
    setShowDeleteConfirm(null);
  };

  const handleContinue = () => {
    if (uploading) {
      setMessage({ text: 'Please wait for upload to complete', type: 'error' });
      return;
    }
    onComplete();
  };

  const randomSuggestion = promiseSuggestions[Math.floor(Math.random() * promiseSuggestions.length)];

  // Promise Modal
  if (showPromiseModal) {
    return (
      <div className="promise-modal-overlay">
        <div className="promise-modal">
          <div className="promise-header">
            <div className="promise-emoji">💝✨📝✨💝</div>
            <h2>Make a Promise!</h2>
            <p>Before sharing your memory, make a special promise to our birthday queen!</p>
            <p className="promise-upload-count">📸 You're about to share: <strong>"{caption}"</strong></p>
          </div>
          
          <div className="promise-content">
            <div className="promise-quote">
              <span>💖</span>
              "The best gift you can give is a promise kept"
              <span>💖</span>
            </div>
            
            <div className="promise-form">
              <div className="promise-input-group">
                <label>👤 Your Name:</label>
                <input
                  type="text"
                  placeholder="e.g., Your loving sister, Mom, Best Friend..."
                  value={promiseName}
                  onChange={(e) => setPromiseName(e.target.value)}
                  className="promise-name-input"
                  autoFocus
                />
              </div>
              
              <div className="promise-input-group">
                <label>📝 Your Promise:</label>
                <textarea
                  placeholder={`Write your heartfelt promise here...\n\nExample: ${randomSuggestion}`}
                  value={promise}
                  onChange={(e) => setPromise(e.target.value)}
                  className="promise-textarea"
                  rows="5"
                />
              </div>
              
              <div className="promise-suggestions">
                <p>💡 Promise Ideas:</p>
                <div className="suggestion-bubbles">
                  {promiseSuggestions.slice(0, 4).map((suggestion, idx) => (
                    <span 
                      key={idx} 
                      className="suggestion-bubble"
                      onClick={() => setPromise(suggestion)}
                    >
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="promise-footer">
            <button className="promise-submit-btn" onClick={handlePromiseSubmit}>
              <span>💝</span>
              I MAKE THIS PROMISE!
              <span>💝</span>
            </button>
            <p className="promise-note">Your promise will be attached to your photo as a special gift!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="back-to-celebration" onClick={handleContinue}>
          ← Back to Celebration
        </button>
        <h1 className="upload-title">📸 Family Memory Upload 📸</h1>
        <p className="upload-subtitle">Share your favorite photos and videos of our birthday queen!</p>
      </div>

      {message.text && (
        <div className={`upload-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="upload-grid">
        {/* Upload Form */}
        <div className="upload-form-card">
          <h3>✨ Add New Memory ✨</h3>
          
          <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {previewUrls.length > 0 ? (
              <div className="preview-grid">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="preview-item">
                    {selectedFiles[idx]?.type.startsWith('video/') ? (
                      <video src={url} className="preview-video" />
                    ) : (
                      <img src={url} alt={`Preview ${idx}`} className="preview-image" />
                    )}
                    <span className="preview-name">{selectedFiles[idx]?.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="drop-zone-content">
                <span className="drop-icon">📸🎥</span>
                <p>Click or drag photos/videos here</p>
                <small>Supports: JPG, PNG, GIF, MP4, MOV</small>
              </div>
            )}
          </div>

          <div className="upload-form-fields">
            <input
              type="text"
              className="upload-input"
              placeholder="Caption (e.g., 'Summer Cruise 2024')"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            
            <textarea
              className="upload-textarea"
              placeholder="Story/Memory description (optional)"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows="3"
            />
            
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span>{Math.round(uploadProgress)}% - Uploading with your promise...</span>
              </div>
            )}
            
            <button 
              className="upload-submit-btn"
              onClick={handleUploadClick}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? '📤 Uploading...' : '💖 Upload & Make Promise 💖'}
            </button>
          </div>
        </div>

        {/* Gallery of Existing Photos */}
        <div className="gallery-card">
          <h3>🌟 Family Gallery 🌟</h3>
          <p className="gallery-count">{photos.length} beautiful memories shared</p>
          
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="gallery-item">
                {photo.isVideo ? (
                  <video src={photo.url} className="gallery-video" controls />
                ) : (
                  <img src={photo.url} alt={photo.caption} className="gallery-image" />
                )}
                <div className="gallery-overlay">
                  <div className="gallery-caption">{photo.caption}</div>
                  {showDeleteConfirm === photo.id ? (
                    <div className="delete-confirm">
                      <span>Delete?</span>
                      <button onClick={() => handleDelete(photo)} className="confirm-yes">✓</button>
                      <button onClick={() => setShowDeleteConfirm(null)} className="confirm-no">✗</button>
                    </div>
                  ) : (
                    <button 
                      className="delete-btn"
                      onClick={() => setShowDeleteConfirm(photo.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {photos.length === 0 && (
            <div className="empty-gallery">
              <span>🌸</span>
              <p>No memories yet. Be the first to upload!</p>
            </div>
          )}
        </div>
      </div>

      <div className="upload-footer">
        <button className="continue-celebration-btn" onClick={handleContinue}>
          🎂 Back to Celebration 🎂
        </button>
        <p className="footer-note">💝 Every photo adds to the surprise! Share your love! 💝</p>
      </div>
    </div>
  );
};

export default PhotoUpload;