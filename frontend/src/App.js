import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import FileInput from "./components/processFile/FileInput";
import DescriptionIcon from "@mui/icons-material/Description";
import ConvertButton from "./components/processFile/ConvertButton";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import axios from "axios";
import DownloadButton from "./components/processFile/DownloadButton";
import DownloadIcon from "@mui/icons-material/Download";
import Backdrop from "./components/UI/Backdrop";

function App() {
    const [file, setFile] = useState({ file: null, fileName: "" });
    const [uploadResponse, setUploadResponse] = useState({ fileId: "", uploadSuccess: false });
    const [convertResponse, setConvertResponse] = useState({ taskId: "", convertSuccess: false });
    const [checkStatusResponse, setCheckStatusResponse] = useState({ fileId: "", statusSuccess: false });
    const [downloadResponse, setDownloadResponse] = useState({ fileName: "", downloadSuccess: false });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [isFileReady, setIsFileReady] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        if (uploadResponse.uploadSuccess) {
            const convertOptions = {
                method: "POST",
                url: `https://pdf-2-word-backend.vercel.app/api/file/convert?fileId=${uploadResponse.fileId}`,
                headers: { "Content-Type": "application/json" },
            };
            axios
                .request(convertOptions)
                .then((response) => {
                    setConvertResponse({ taskId: response.data.task_id, convertSuccess: true });
                })
                .catch(() => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    }, [uploadResponse]);

    useEffect(() => {
        if (convertResponse.convertSuccess) {
            const statusOptions = {
                method: "GET",
                url: `https://pdf-2-word-backend.vercel.app/api/file/status?taskId=${convertResponse.taskId}`,
                headers: { "Content-Type": "application/json" },
            };
            axios
                .request(statusOptions)
                .then((response) => {
                    setCheckStatusResponse({ fileId: response.data.file_id, statusSuccess: true });
                })
                .catch(() => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    }, [convertResponse]);

    useEffect(() => {
        if (checkStatusResponse.statusSuccess) {
            const downloadOptions = {
                method: "GET",
                url: `https://pdf-2-word-backend.vercel.app/api/file/download?fileId=${checkStatusResponse.fileId}`,
                headers: { "Content-Type": "application/json" },
            };
            axios
                .request(downloadOptions)
                .then((response) => {
                    setDownloadResponse({ fileName: response.data.fileName, downloadSuccess: true });
                })
                .catch(() => {
                    setShowErrorModal(true);
                });
        }
    }, [checkStatusResponse]);

    useEffect(() => {
        if (downloadResponse.downloadSuccess) {
            setTimeout(() => {
                const cloudinaryUploadOptions = {
                    method: "get",
                    url: `https://pdf-2-word-backend.vercel.app/api/file/cloud/upload?fileName=${downloadResponse.fileName}`,
                    headers: { "Content-Type": "application/json" },
                };
                axios
                    .request(cloudinaryUploadOptions)
                    .then((response) => {
                        setFileUrl(response.data.file_url);
                        setIsFileReady(true);
                        setShowLoadingModal(false);
                        setShowSuccessModal(true);
                    })
                    .catch(() => {
                        setShowLoadingModal(false);
                        setShowErrorModal(true);
                    });
            }, 4000);
        }
    }, [downloadResponse]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (!uploadResponse.uploadSuccess) {
            const formData = new FormData();
            formData.append("file", file.body);

            const uploadOptions = {
                method: "POST",
                url: "https://pdf-2-word-backend.vercel.app/api/file/upload",
                headers: { "Content-Type": "multipart/form-data" },
                data: formData,
            };

            axios
                .request(uploadOptions)
                .then((response) => {
                    setUploadResponse({ fileId: response.data.file_id, uploadSuccess: true });
                })
                .catch(() => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    };

    const inputChangeHandler = (e) => {
        let fileName = e.target.files[0].name;
        fileName = fileName.split(".")[0];
        if (fileName.length >= 23) fileName = `${fileName.substr(0, 17)}..`;
        setFile({ body: e.target.files[0], fileName });
    };

    return (
        <>
            <header>
                <div className={styles["header-text-container"]}>
                    <p className={styles["header-text"]}>Pdf-To-Word</p>
                </div>
            </header>
            {showSuccessModal && <Backdrop success setShowSuccessModal={setShowSuccessModal} />}
            {showLoadingModal && <Backdrop loading />}
            {showErrorModal && <Backdrop error setShowErrorModal={setShowErrorModal} />}
            <div className={styles.container}>
                <div className={styles["file-main-container"]}>
                    <form onSubmit={formSubmitHandler} encType="multipart/form-data">
                        <div className={styles["file-sub-container"]}>
                            {!file.fileName && !isFileReady && (
                                <>
                                    <p className={styles["select-heading"]}>
                                        Select <DescriptionIcon className={styles["file-icon"]} /> to convert
                                    </p>
                                    <FileInput inputChangeHandler={inputChangeHandler} />
                                    <p className={styles["file-name"]}>No file selected</p>
                                </>
                            )}
                            {file.fileName && !isFileReady && (
                                <>
                                    <p className={styles["select-heading"]}>
                                        To start the <AutoFixHighIcon className={styles["file-icon"]} /> Hit
                                    </p>
                                    <ConvertButton setShowLoadingModal={setShowLoadingModal} />
                                    <p className={styles["file-name"]}>{`${file.fileName}.pdf`}</p>
                                </>
                            )}
                            {file.fileName && isFileReady && (
                                <>
                                    <p className={styles["select-heading"]} style={{ marginLeft: -10 }}>
                                        Your <DescriptionIcon className={styles["file-icon"]} /> is ready to{" "}
                                        <DownloadIcon style={{ marginLeft: 5.3 }} />
                                    </p>
                                    <DownloadButton fileUrl={fileUrl} />
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
