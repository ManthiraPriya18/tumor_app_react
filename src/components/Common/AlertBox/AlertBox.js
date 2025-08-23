import React, { useEffect } from 'react';
import styles from './AlertBox.module.scss'; // Import the CSS Module

const AlertBox = ({ title, subtitle, timeInSec, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Dismiss after the specified time
    }, timeInSec * 1000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [timeInSec, onClose]);

  return (
    <div className={styles.alertBox}>
      <div className={styles.alertHeader}>
        <strong>{title}</strong>
      </div>
      <div className={styles.alertBody}>
        <p>{subtitle}</p>
      </div>
      <button className={styles.alertClose} onClick={onClose}>
        X
      </button>
    </div>
  );
};

export default AlertBox;
