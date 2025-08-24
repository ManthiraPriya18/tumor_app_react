import React, { useRef, useState } from 'react';
import { Eye, User, Calendar, Clock, Download, Trash2, Image } from 'lucide-react';
import styles from './ScanItem.module.scss';
import ConfirmationPopup from '../Common/ConfirmationPopup/ConfirmationPopup';
import { DeleteScanReport } from '../../services/Api/ApiCaller';
import AlertManager from '../Common/AlertBox/AlertManager';
import Loader from '../Common/Loader/Loader';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Component for individual scan result item
const ScanItem = ({ scan, onImageClick, onViewOriginal, isCurrentUserPatient, refreshScan }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const alertManagerRef = useRef();

  // Function to convert image to base64
  const getImageAsBase64 = async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  // Function to format analysis text for PDF
  const formatAnalysisForPDF = (result) => {
    return result
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold formatting
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '') // Remove emojis
      .replace(/[^\x00-\x7F]/g, '') // Remove any non-ASCII characters
      .replace(/###\s*/g, '') // Remove markdown headers
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim(); // Remove leading/trailing whitespace
  };

  // Handler function for download
  const handleDownload = async () => {
    try {
      setLoading(true);
      alertManagerRef.current?.showAlert('Info', 'Generating PDF report...', 3);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);

      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Medical Scan Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Add a line separator
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Patient Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Information:', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${scan.patientName}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Age: ${scan.patientAge}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Report ID: ${scan.id}`, margin + 5, yPosition);
      yPosition += 6;

      const { date, time } = formatDateTime(scan.dateTime);
      pdf.text(`Diagnosis Date: ${date}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text(`Diagnosis Time: ${time}`, margin + 5, yPosition);
      yPosition += 15;

      // Images Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Medical Images:', margin, yPosition);
      yPosition += 10;

      // Original Image
      try {
        const originalImageBase64 = await getImageAsBase64(scan.imagePath);
        if (originalImageBase64) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Original Image:', margin + 5, yPosition);
          yPosition += 8;

          const imgWidth = 80;
          const imgHeight = 60;
          pdf.addImage(originalImageBase64, 'JPEG', margin + 5, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      } catch (error) {
        console.error('Error adding original image:', error);
      }

      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      // Processed Image (WebP)
      try {
        const processedImageBase64 = await getImageAsBase64(scan.webpImagePath);
        if (processedImageBase64) {
          pdf.setFontSize(11);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Processed Image:', margin + 5, yPosition);
          yPosition += 8;

          const imgWidth = 80;
          const imgHeight = 60;
          pdf.addImage(processedImageBase64, 'WEBP', margin + 5, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
        }
      } catch (error) {
        console.error('Error adding processed image:', error);
      }

      // Check if we need a new page for analysis
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      // Analysis Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analysis Results:', margin, yPosition);
      yPosition += 10;

      // Format and add analysis text
      const analysisText = formatAnalysisForPDF(scan.analysisResult);
      const analysisLines = pdf.splitTextToSize(analysisText, contentWidth - 10);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      for (let i = 0; i < analysisLines.length; i++) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(analysisLines[i], margin + 5, yPosition);
        yPosition += 5;
      }

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
      }

      // Generate filename
      const sanitizedPatientName = scan.patientName.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `${sanitizedPatientName}_Report_${new Date().toISOString().replace(/[-:.TZ]/g, '_')}.pdf`;

      // Save the PDF
      pdf.save(filename);
      
      alertManagerRef.current?.showAlert('Success', 'PDF report downloaded successfully!', 3);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alertManagerRef.current?.showAlert('Error', 'Failed to generate PDF report', 5);
    } finally {
      setLoading(false);
    }
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
            aria-label="Download scan as PDF"
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