
// Loader.js
import React from 'react';
import styles from './Loader.module.scss';

const Loader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className={styles.loaderOverlay}>
            <div className={styles.loaderSpinner}></div>
        </div>
    );
};

export default Loader;
