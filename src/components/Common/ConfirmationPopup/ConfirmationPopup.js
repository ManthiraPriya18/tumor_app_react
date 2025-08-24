import React, { useEffect } from 'react';
import styles from './ConfirmationPopup.module.scss';

const ConfirmationPopup = ({ 
  isOpen, 
  title, 
  description, 
  onConfirm, 
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  showCloseButton = true 
}) => {
  
  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} role="dialog" aria-modal="true">
        {showCloseButton && (
          <button 
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Close popup"
          >
            ×
          </button>
        )}
        
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        
        <div className={styles.content}>
          <p className={styles.description}>{description}</p>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;