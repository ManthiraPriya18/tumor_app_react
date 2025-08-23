import React from 'react';
import styles from './ToggleSwitch.module.scss';

const ToggleSwitch = ({ isChecked, onToggle }) => {
  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onToggle}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ToggleSwitch;
