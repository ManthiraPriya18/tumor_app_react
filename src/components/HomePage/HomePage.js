import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ScanItem from '../ScanItem/ScanItem';
import styles from './HomePage.module.scss';

// Modal component for viewing larger images
const ImageModal = ({ isOpen, imagePath, webpPath, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <picture>
                    <source srcSet={webpPath} type="image/webp" />
                    <img src={webpPath} alt="Medical scan - enlarged view" className={styles.modalImage} />
                </picture>
            </div>
        </div>
    );
};

// Modal component for viewing original input images
const OriginalImageModal = ({ isOpen, imagePath, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <div className={styles.originalImageHeader}>
                    <h3>Original Input Image</h3>
                </div>
                <img src={imagePath} alt="Original medical scan input" className={styles.modalImage} />
            </div>
        </div>
    );
};

// Main HomePage component
export const HomePage = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalImage, setModalImage] = useState(null);
    const [originalModalImage, setOriginalModalImage] = useState(null);

    // Mock async function to simulate API call
    const fetchMedicalScans = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with your actual API call
        return [
            {
                id: '1',
                patientName: 'John Smith',
                patientAge: 45,
                dateTime: '2025-08-24T10:30:00Z',
                imagePath: 'https://manthraaa-brain-tumor-detector.hf.space/gradio_api/file=/tmp/gradio/f90dccb171baeff8158e918bdb633d91902d28d2e1aaba00ab320d27669b1ba9/tumor_positive.jpg',
                webpImagePath: 'https://manthraaa-brain-tumor-detector.hf.space/gradio_api/file=/tmp/gradio/58b0ab429195cdf30e681b584e8604c5e17551072f6c6d3cc0ccf2d348262937/image.webp',
                analysisResult: '🔴 **TUMOR DETECTED**\n**Confidence**: 99.5%\n\n### 📊 Detailed Classification:\n🧠 **Meningioma**: 82.8%\n🧠 **Glioma**: 16.8%\n✅ **Notumor**: 0.5%\n🧠 **Pituitary**: 0.0%'
            },
            {
                id: '2',
                patientName: 'Sarah Johnson',
                patientAge: 38,
                dateTime: '2025-08-24T14:15:00Z',
                imagePath: 'https://via.placeholder.com/300x300/50C878/white?text=Brain+Scan+2',
                webpImagePath: 'https://via.placeholder.com/300x300/50C878/white?text=Brain+Scan+2+WebP',
                analysisResult: '✅ **NO TUMOR DETECTED**\n**Confidence**: 98.2%\n\n### 📊 Detailed Classification:\n✅ **Notumor**: 98.2%\n🧠 **Meningioma**: 1.2%\n🧠 **Glioma**: 0.4%\n🧠 **Pituitary**: 0.2%'
            },
            {
                id: '3',
                patientName: 'Michael Chen',
                patientAge: 52,
                dateTime: '2025-08-24T16:45:00Z',
                imagePath: 'https://via.placeholder.com/300x300/FF6B6B/white?text=Brain+Scan+3',
                webpImagePath: 'https://via.placeholder.com/300x300/FF6B6B/white?text=Brain+Scan+3+WebP',
                analysisResult: '🟡 **SUSPICIOUS AREA DETECTED**\n**Confidence**: 87.3%\n\n### 📊 Detailed Classification:\n🧠 **Pituitary**: 45.2%\n🧠 **Meningioma**: 32.1%\n✅ **Notumor**: 15.4%\n🧠 **Glioma**: 7.3%'
            }
        ];
    };

    useEffect(() => {
        const loadScans = async () => {
            try {
                setLoading(true);
                const scanResults = await fetchMedicalScans();
                setScans(scanResults);
            } catch (error) {
                console.error('Error fetching medical scans:', error);
            } finally {
                setLoading(false);
            }
        };

        loadScans();
    }, []);

    const handleImageClick = (imagePath, webpPath) => {
        setModalImage({ imagePath, webpPath });
    };

    const handleViewOriginal = (imagePath) => {
        setOriginalModalImage({ imagePath });
    };

    const closeModal = () => {
        setModalImage(null);
    };

    const closeOriginalModal = () => {
        setOriginalModalImage(null);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading medical scan results...</p>
            </div>
        );
    }

    return (
        <div className={styles.homepage}>
            <div className={styles.header}>
                <h1>Medical Scan Results</h1>
                <p className={styles.subtitle}>AI-Powered Brain Tumor Detection Analysis</p>
            </div>

            <div className={styles.scansList}>
                {scans.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No scan results available.</p>
                    </div>
                ) : (
                    scans.map(scan => (
                        <ScanItem
                            key={scan.id}
                            scan={scan}
                            onImageClick={handleImageClick}
                            onViewOriginal={handleViewOriginal}
                        />
                    ))
                )}
            </div>

            <ImageModal
                isOpen={!!modalImage}
                imagePath={modalImage?.imagePath || ''}
                webpPath={modalImage?.webpPath || ''}
                onClose={closeModal}
            />

            <OriginalImageModal
                isOpen={!!originalModalImage}
                imagePath={originalModalImage?.imagePath || ''}
                onClose={closeOriginalModal}
            />
        </div>
    );
};