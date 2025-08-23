import React, { useState, forwardRef, useImperativeHandle } from 'react';
import AlertBox from './AlertBox';
import styles from './AlertBox.module.scss'; // Import the CSS Module

// Forward ref to allow parent components to interact with AlertManager directly
const AlertManager = forwardRef((props, ref) => {
  const [alerts, setAlerts] = useState([]);

  // Allow parent component to call showAlert directly
  useImperativeHandle(ref, () => ({
    showAlert: (title, subtitle, timeInSec) => {
      // Add new alert to the state (queue), and only show the last one
      setAlerts((prevAlerts) => [
        ...prevAlerts,
        { id: Date.now(), title, subtitle, timeInSec },
      ]);
    },
  }));

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <div className={styles.alertManager}>
      {alerts.length > 0 &&
        alerts.slice(-1).map((alert) => (
          <AlertBox
            key={alert.id}
            title={alert.title}
            subtitle={alert.subtitle}
            timeInSec={alert.timeInSec}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
    </div>
  );
});

export default AlertManager;
