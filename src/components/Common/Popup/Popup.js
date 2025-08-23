// Popup.js
import React, { useEffect, useRef } from 'react';
import styles from './Popup.module.scss'
function Popup({ isOpen, onClose, canHidePopupWhenClickOutside, children }) {
    const popupRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scroll
        } else {
            document.body.style.overflow = ''; // Enable scroll when popup is closed
        }

        // Clean up on component unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (canHidePopupWhenClickOutside && popupRef.current && !popupRef.current.contains(event.target)) {
                if (onClose) { onClose() }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [canHidePopupWhenClickOutside, onClose]);

    if (!isOpen) return null; // Don't render anything if the popup is closed

    return (
        <div>
            {isOpen ? <div className={styles.popupOverlay}>
                <div className={styles.popupContent} ref={popupRef}>
                    {children}
                </div>
            </div> : null}
        </div>
    );
}



export default Popup;
