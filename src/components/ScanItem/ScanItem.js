import React, { useRef, useState } from 'react';
import { Eye, User, Calendar, Clock, Download, Trash2, Image } from 'lucide-react';
import styles from './ScanItem.module.scss';
import ConfirmationPopup from '../Common/ConfirmationPopup/ConfirmationPopup';
import { DeleteScanReport } from '../../services/Api/ApiCaller';
import AlertManager from '../Common/AlertBox/AlertManager';
import Loader from '../Common/Loader/Loader';

// Component for individual scan result item
const ScanItem = ({ scan, onImageClick, onViewOriginal, isCurrentUserPatient, refreshScan }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const alertManagerRef = useRef();

  // Handler functions for buttons (empty for now)
  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download clicked for scan:', scan.id);
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    console.log('Delete clicked for scan:', scan.id);
    setLoading(true)
    let delResp = await DeleteScanReport(scan.id)
    setLoading(false)
    if (!delResp.success) {
      alertManagerRef.current.showAlert('Error', 'Something wrong while deleting scan', 5);
      return;
    }
    setTimeout(() => {
      refreshScan();
    }, 200)
  };

  const handleViewOriginal = () => {
    onViewOriginal(scan.imagePath);
  };
  // Function to parse and format the analysis result
  const formatAnalysisResult = (result) => {
    return result.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;

      // Handle bold text with **
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: formattedLine }}
          className={styles.analysisLine}
        />
      );
    });
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(scan.dateTime);
  const handleConfirm = () => {
    handleDelete();
    setIsPopupOpen(false);
  };

  const handleCancel = () => {
    setIsPopupOpen(false);
  };
  return (
    <div>
      <Loader isLoading={loading} />
      <AlertManager ref={alertManagerRef} />

      <ConfirmationPopup
        isOpen={isPopupOpen}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This cannot be undone."
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText="Yes, Proceed"
        cancelText="Cancel"
        showCloseButton={true}
      />
      <div className={styles.scanItem}>
        <div className={styles.actionButtons}>
          <button
            className={styles.downloadBtn}
            onClick={handleDownload}
            aria-label="Download scan"
          >
            <Download size={16} />
          </button>
          {!isCurrentUserPatient && <button
            className={styles.deleteBtn}
            onClick={() => { setIsPopupOpen(true) }}
            aria-label="Delete scan"
          >
            <Trash2 size={16} />
          </button>}

        </div>

        <div className={styles.scanHeader}>
          <div className={styles.patientInfo}>
            <div className={styles.patientName}>
              <User size={16} />
              <span>{scan.patientName}</span>
            </div>
            <div className={styles.patientDetails}>
              <span className={styles.age}>Age: {scan.patientAge}</span>
              <div className={styles.datetime}>
                <Calendar size={14} />
                <span>{date}</span>
                <Clock size={14} />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.scanContent}>
          <div className={styles.imagesSection}>
            <div className={styles.imageContainer}>
              <picture>
                <source srcSet={scan.webpImagePath} type="image/webp" />
                <img
                  src={scan.webpImagePath}
                  alt={`Scan for ${scan.patientName}`}
                  className={styles.scanImage}
                />
              </picture>
              <button
                className={styles.imageOverlay}
                onClick={() => onImageClick(scan.imagePath, scan.webpImagePath)}
                aria-label="View larger image"
              >
                <Eye size={20} />
                <span>View Larger</span>
              </button>
            </div>

            <button
              className={styles.viewOriginalBtn}
              onClick={handleViewOriginal}
              aria-label="View original input image"
            >
              <Image size={16} />
              <span>View Original</span>
            </button>
          </div>

          <div className={styles.analysisSection}>
            <div className={styles.analysisContent}>
              {formatAnalysisResult(scan.analysisResult)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ScanItem;