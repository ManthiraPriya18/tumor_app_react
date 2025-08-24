import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ScanItem from '../ScanItem/ScanItem';
import styles from './HomePage.module.scss';
import { LogoutClicked } from '../../services/Auth/Auth';
import { GetPatientDropDownData, getScanData, getTumorResult, insertScanDataInSupabase, predictTumor, uploadFileToSupabase, uploadImageFromUrlToSupabase } from '../../services/Api/ApiCaller';
import AlertManager from '../Common/AlertBox/AlertManager';
import Loader from '../Common/Loader/Loader';
import { upload } from '@testing-library/user-event/dist/upload';
import { ScansTable } from '../../supabase/SupabaseConstants.ts';
import { GetUserDetails } from '../../services/Storage/LocalStorage.js';

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

// New modal for checking tumor
const CheckTumorModal = ({ isOpen, onClose, onSubmit, patients }) => {

    const [selectedPatient, setSelectedPatient] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <div className={styles.checkTumorHeader}>
                    <h3>Check for Tumor</h3>
                </div>
                <form
                    className={styles.checkTumorForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        const file = e.target.imageFile.files[0];
                        if (selectedPatient && file) {
                            onSubmit(selectedPatient, file);
                            onClose();
                        }
                    }}
                >
                    <div className={styles.formGroup}>
                        <label>Select Patient</label>
                        <div
                            ref={dropdownRef}
                            className={styles.customSelect}
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                        >
                            {selectedPatient ? patients.find(p => p.key === selectedPatient)?.value : 'Select a patient'}
                        </div>
                        {isDropdownOpen && (
                            <ul className={styles.optionsList}>
                                {patients.map((p) => (
                                    <li
                                        key={p.key}
                                        className={styles.listItem}
                                        onClick={() => {
                                            setSelectedPatient(p.key);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {p.value}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="imageFile">Upload Image</label>
                        <input type="file" id="imageFile" accept="image/*" className={styles.fileInput} />
                    </div>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
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
    const [isCheckTumorOpen, setIsCheckTumorOpen] = useState(false);

    const [patients, setPatients] = useState([]);
    const alertManagerRef = useRef();
    const [isPatient, setIsPatient] = useState(true);

    // Mock async function to simulate API call
    const fetchMedicalScans = async () => {
        try {
            setLoading(true);
            let scanDataResp = await getScanData();
            if (!scanDataResp.success) {
                alertManagerRef.current.showAlert('Error', 'Something wrong while getting reports', 5);
                return;
            }
            setScans(scanDataResp.data ?? [])
        }
        catch (error) {
            console.error('Error fetching medical scans:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchDropDownData = async () => {
        try {
            setLoading(true);
            let drpDwnResp = await GetPatientDropDownData();
            if (!drpDwnResp.success) {
                alertManagerRef.current.showAlert('Error', 'Couldnt get drop down data!', 5);
                return;
            }
            setPatients(drpDwnResp.data)
        }
        catch (error) {
            console.error('Error fetching medical scans:', error);
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        const loadScans = async () => {
            await fetchMedicalScans();
            await fetchDropDownData();
            let userDetails = GetUserDetails();
            if (userDetails.is_patient != null) {
                setIsPatient(userDetails.is_patient)
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

    const openCheckTumor = () => {
        setIsCheckTumorOpen(true);
    };

    const closeCheckTumor = () => {
        setIsCheckTumorOpen(false);
    };

    const handleTumorCheckSubmit = async (patientId, file) => {
        console.log('Submitted for patient:', patientId, 'with file:', file);
        try {
            setLoading(true)
            let uploadInputResp = await uploadFileToSupabase(file)
            if (!uploadInputResp.success) {
                alertManagerRef.current.showAlert('Error', 'Cannot upload input image to supabase', 5);
                return
            }
            let input_imgurl = uploadInputResp.data.url;
            let predictTumorResp = await predictTumor(input_imgurl);
            if (!predictTumorResp.success) {
                alertManagerRef.current.showAlert('Error', 'Something wrong with predict tumor endpoint', 5);
                return
            }
            let eventId = predictTumorResp.data.event_id ?? "";
            await new Promise(resolve => setTimeout(resolve, 1000));
            let tumorResultResp = await getTumorResult(eventId);
            if (!tumorResultResp.success) {
                alertManagerRef.current.showAlert('Error', 'Something wrong when getting tumor result', 5);
                return
            }
            let uploadOutputFileResp = await uploadImageFromUrlToSupabase(tumorResultResp.data.output_file_imgpath)
            if (!uploadOutputFileResp.success) {
                alertManagerRef.current.showAlert('Error', 'Something wrong when uploading tumor result file to supabase', 5);
                return
            }
            let output_imgurl = uploadOutputFileResp.data.url;
            let insertPayload = {
                [ScansTable.PatientId_ColName]: patientId,
                [ScansTable.ScanInputImgPath_ColName]: input_imgurl,
                [ScansTable.ScanOutputImgPath_ColName]: output_imgurl,
                [ScansTable.ScanOutputText_ColName]: tumorResultResp.data.output_text,
            }
            let insertScanResp = await insertScanDataInSupabase(insertPayload);
            if (!insertScanResp.success) {
                alertManagerRef.current.showAlert('Error', 'Cannot able to insert data into scans', 5);
                return
            }
            alertManagerRef.current.showAlert('Success', 'Scan uploaded successfully', 5);
        }
        finally {
            setLoading(false)
        }

        await fetchMedicalScans();

    };




    return (
        <div>
            <AlertManager ref={alertManagerRef} />
            <Loader isLoading={loading} />
            <div className={styles.homepage}>
                <div className={styles.header}>
                    <h1>Medical Scan Results</h1>
                    <p className={styles.subtitle}>AI-Powered Brain Tumor Detection Analysis</p>
                    <div className={styles.buttonContainer}>
                        {!isPatient && (
                            <button className={styles.actionButton} onClick={openCheckTumor}>
                                Check Tumor
                            </button>
                        )}
                        <button className={styles.actionButton} onClick={LogoutClicked}>Log Out</button>
                    </div>
                </div>

                <div className={styles.scansList}>
                    {scans?.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No scan results available.</p>
                        </div>
                    ) : (
                        scans?.map(scan => (
                            <ScanItem
                                key={scan.id}
                                scan={scan}
                                isCurrentUserPatient={isPatient}
                                onImageClick={handleImageClick}
                                onViewOriginal={handleViewOriginal}
                                refreshScan={fetchMedicalScans}
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

                <CheckTumorModal
                    isOpen={isCheckTumorOpen}
                    onClose={closeCheckTumor}
                    onSubmit={handleTumorCheckSubmit}
                    patients={patients}
                />
            </div>
        </div>

    );
};