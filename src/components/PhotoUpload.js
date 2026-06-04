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
  
  const fileInputRef = useRef(null);

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
    if (selectedFiles.length === 0) {
      setMessage({ text: 'Please select files to upload', type: 'error' });
      return;
    }

    if (!caption.trim()) {
      setMessage({ text: 'Please add a caption', type: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileIsVideo = file.type.startsWith('video/');
      
      try {
        setUploadProgress(((i + 0.5) / selectedFiles.length) * 100);
        await uploadPhoto(
          file,
          caption + (selectedFiles.length > 1 ? ` (${i + 1})` : ''),
          story || `A beautiful memory captured just for you! 💖`,
          fileIsVideo
        );
        successCount++;
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      } catch (error) {
        console.error('Upload error:', error);
        errorCount++;
        setMessage({ text: `Failed to upload ${file.name}: ${error.message}`, type: 'error' });
      }
    }

    setUploading(false);
    
    if (successCount > 0) {
      setMessage({ 
        text: `✅ Successfully uploaded ${successCount} ${successCount === 1 ? 'memory' : 'memories'}! ${errorCount > 0 ? `(${errorCount} failed)` : ''}`, 
        type: 'success' 
      });
      
      setSelectedFiles([]);
      setPreviewUrls([]);
      setCaption('');
      setStory('');
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
    onComplete();
  };

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
        <div className="upload-form-card">
          <h3>✨ Add New Memory ✨</h3>
          
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
                <span>{Math.round(uploadProgress)}% uploaded...</span>
              </div>
            )}
            
            <button 
              className="upload-submit-btn"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? '📤 Uploading...' : '💖 Upload to Celebration 💖'}
            </button>
          </div>
        </div>

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
          🎂 Continue to Birthday Celebration 🎂
        </button>
        <p className="footer-note">💝 Every photo adds to the surprise! Share your love! 💝</p>
      </div>
    </div>
  );
};

export default PhotoUpload;