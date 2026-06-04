import React, { useState, useRef, useEffect } from 'react';
import { uploadPhoto, savePromise, saveMessage, getPhotos, deletePhoto } from '../utils/supabaseClient';
import '../styles/PhotoUpload.css';

const PhotoUpload = ({ onComplete, onPhotosUpdated }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Form Fields
  const [yourName, setYourName] = useState('');
  const [caption, setCaption] = useState('');
  const [story, setStory] = useState('');
  const [yourPromise, setYourPromise] = useState('');
  const [yourMessage, setYourMessage] = useState('');
  
  const fileInputRef = useRef(null);
  const isUploadingRef = useRef(false);

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

  const handleUpload = async () => {
    // Validation
    if (selectedFiles.length === 0) {
      setMessage({ text: 'Please select files to upload', type: 'error' });
      return;
    }
    if (!yourName.trim()) {
      setMessage({ text: '💝 Please tell us your name! 💝', type: 'error' });
      return;
    }
    if (!caption.trim()) {
      setMessage({ text: '📝 Please add a caption! 📝', type: 'error' });
      return;
    }
    if (!yourPromise.trim()) {
      setMessage({ text: '💖 Please write a promise to our birthday queen! 💖', type: 'error' });
      return;
    }
    if (yourPromise.length < 10) {
      setMessage({ text: '💖 Your promise is too short! Write something meaningful! 💖', type: 'error' });
      return;
    }

    isUploadingRef.current = true;
    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileIsVideo = file.type.startsWith('video/');
      
      try {
        setUploadProgress(((i + 0.5) / selectedFiles.length) * 100);
        
        // Create story with promise and name
        const fullStory = `${story || 'A beautiful memory shared just for you! 💖'}\n\n💝 Promise from ${yourName}: "${yourPromise}"`;
        
        // Upload photo
        const { photoId } = await uploadPhoto(
          file,
          caption + (selectedFiles.length > 1 ? ` (${i + 1})` : ''),
          fullStory,
          fileIsVideo
        );
        
        // Save promise to promises table
        if (photoId) {
          await savePromise(photoId, yourName, yourPromise);
        }
        
        successCount++;
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      } catch (error) {
        console.error('Upload error:', error);
        setMessage({ text: `Failed to upload ${file.name}: ${error.message}`, type: 'error' });
      }
    }

    // Save message if provided
    if (yourMessage.trim() && successCount > 0) {
      try {
        await saveMessage(yourName, yourMessage);
        setMessage({ text: `✨ Plus your message was saved! ✨`, type: 'success' });
      } catch (error) {
        console.error('Message save error:', error);
      }
    }

    setUploading(false);
    isUploadingRef.current = false;
    
    if (successCount > 0) {
      setMessage({ 
        text: `✅ Successfully uploaded ${successCount} ${successCount === 1 ? 'memory' : 'memories'}! Thank you ${yourName}! 🎉`, 
        type: 'success' 
      });
      
      // Clear form
      setSelectedFiles([]);
      setPreviewUrls([]);
      setYourName('');
      setCaption('');
      setStory('');
      setYourPromise('');
      setYourMessage('');
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await loadPhotos();
      if (onPhotosUpdated) onPhotosUpdated();
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
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

  return (
    <div className="photo-upload-container">
      <div className="upload-header">
        <button className="back-to-celebration" onClick={handleContinue}>
          ← Back to Celebration
        </button>
        <h1 className="upload-title">📸 Family Memory Upload 📸</h1>
        <p className="upload-subtitle">Share your photos, make a promise, and leave a message for our birthday queen!</p>
      </div>

      {message.text && (
        <div className={`upload-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="upload-grid">
        {/* Upload Form */}
        <div className="upload-form-card">
          <h3>✨ Share Your Memory ✨</h3>
          
          {/* File Drop Zone */}
          <div className="file-drop-zone" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
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

          {/* Form Fields */}
          <div className="upload-form-fields">
            <div className="form-row">
              <label className="form-label">👤 Your Name *</label>
              <input
                type="text"
                className="upload-input"
                placeholder="e.g., Your loving sister, Mom, Best Friend..."
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">📷 Caption *</label>
              <input
                type="text"
                className="upload-input"
                placeholder="e.g., 'Summer Cruise 2024'"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">💝 Your Promise *</label>
              <textarea
                className="upload-textarea"
                placeholder="I promise to always be there for you, to make you laugh, and to cherish every moment with you..."
                value={yourPromise}
                onChange={(e) => setYourPromise(e.target.value)}
                rows="3"
                required
              />
              <small className="field-hint">Write a heartfelt promise to our birthday queen (minimum 10 characters)</small>
            </div>

            <div className="form-row">
              <label className="form-label">📖 Memory Story (Optional)</label>
              <textarea
                className="upload-textarea"
                placeholder="Share the story behind this memory..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows="2"
              />
            </div>

            <div className="form-row">
              <label className="form-label">💌 Birthday Message (Optional)</label>
              <textarea
                className="upload-textarea"
                placeholder="Leave a special birthday message for our queen..."
                value={yourMessage}
                onChange={(e) => setYourMessage(e.target.value)}
                rows="2"
              />
            </div>
            
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <span>{Math.round(uploadProgress)}% - Uploading your memory...</span>
              </div>
            )}
            
            <button 
              className="upload-submit-btn"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? '📤 Uploading...' : '💖 Share Memory with Promise 💖'}
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
              <p>No memories yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>

      <div className="upload-footer">
        <button className="continue-celebration-btn" onClick={handleContinue}>
          🎂 Back to Celebration 🎂
        </button>
        <p className="footer-note">💝 Your name, promise, and message will appear as a special gift for the birthday queen! 💝</p>
      </div>
    </div>
  );
};

export default PhotoUpload;