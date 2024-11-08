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
    const [file, setFile] = useState({
        file: null,
        fileName: "",
    });

    const [uploadResponse, setUploadResponse] = useState({
        fileId: "",
        uploadSuccess: false,
    });

    const [convertResponse, setConvertResponse] = useState({
        taskId: "",
        convertSuccess: false,
    });

    const [checkStatusResponse, setCheckStatusResponse] = useState({
        fileId: "",
        statusSuccess: false,
    });

    const [downloadResponse, setDownloadResponse] = useState({
        fileName: "",
        downloadSuccess: false,
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLoadingModal, setShowLoadingModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [isFileReady, setIsFileReady] = useState(false);
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        // if upload was success then execute this
        // the below code is to convert the uploaded file
        if (uploadResponse.uploadSuccess) {
            const convertOptions = {
                method: "POST",
                url: `http://localhost:4000/api/file/convert?fileId=${uploadResponse.fileId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            axios
                .request(convertOptions)
                .then((response) => {
                    setConvertResponse({
                        taskId: response.data.task_id,
                        convertSuccess: true,
                    });
                })
                .catch((err) => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    }, [uploadResponse]);

    useEffect(() => {
        // below code is to check conversion status
        // if upload is success and convert is success then execute the below code
        if (convertResponse.convertSuccess) {
            const statusOptions = {
                method: "GET",
                url: `http://localhost:4000/api/file/status?taskId=${convertResponse.taskId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            };

            axios
                .request(statusOptions)
                .then((response) => {
                    setCheckStatusResponse({
                        fileId: response.data.file_id,
                        statusSuccess: true,
                    });
                })
                .catch((err) => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    }, [convertResponse]);

    useEffect(() => {
        // below code is to download the file on server
        // if check file status was success then

        if (checkStatusResponse.statusSuccess) {
            const downloadOptions = {
                method: "GET",
                url: `http://localhost:4000/api/file/download?fileId=${checkStatusResponse.fileId}`,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            axios
                .request(downloadOptions)
                .then((response) => {
                    setDownloadResponse({
                        fileName: response.data.fileName,
                        downloadSuccess: true,
                    });
                })
                .catch((err) => {
                    setShowErrorModal(true);
                });
        }
    }, [checkStatusResponse]);

    useEffect(() => {
        // below code is to upload on cloudinary
        setTimeout(() => {
            if (downloadResponse.downloadSuccess) {
                const cloudinaryUploadOptions = {
                    method: "get",
                    url:
                        "http://localhost:4000/api/file/cloud/upload?fileName=" +
                        downloadResponse.fileName,
                    headers: {
                        "Content-Type": "application/json",
                    },
                };

                axios
                    .request(cloudinaryUploadOptions)
                    .then((response) => {
                        setFileUrl(response.data.file_url);
                        setIsFileReady(true);

                        //check the behaviour afterwards
                        setShowLoadingModal(false);
                        setShowSuccessModal(true);
                    })
                    .catch((err) => {
                        setShowLoadingModal(false);
                        setShowErrorModal(true);
                    });
            }
        }, 1000);
    }, [downloadResponse]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        if (!uploadResponse.uploadSuccess) {
            const formData = new FormData();
            formData.append("file", file.body);

            const uploadOptions = {
                method: "POST",
                url: "http://localhost:4000/api/file/upload",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                data: formData,
            };

            // requesting to upload the file
            axios
                .request(uploadOptions)
                .then((response) => {
                    setUploadResponse({
                        fileId: response.data.file_id,
                        uploadSuccess: true,
                    });
                })
                .catch((err) => {
                    setShowLoadingModal(false);
                    setShowErrorModal(true);
                });
        }
    };

    const inputChangeHandler = (e) => {
        let fileName = e.target.files["0"].name;
        fileName = fileName.split(".")[0];
        if (fileName.length >= 23) {
            fileName = `${fileName.substr(0, 17)}..`;
        }
        setFile({ body: e.target.files[0], fileName: fileName });
    };

    return (
        <>
            <header>
                <div className={styles["header-text-container"]}>
                    <p className={styles["header-text"]}>Pdf-To-Word</p>
                </div>
            </header>
            {showSuccessModal && (
                <Backdrop success setShowSuccessModal={setShowSuccessModal} />
            )}
            {showLoadingModal && <Backdrop loading />}
            {showErrorModal && <Backdrop error setShowErrorModal={setShowErrorModal} />}
            <div className={styles.container}>
                <div className={styles["file-main-container"]}>
                    <form onSubmit={formSubmitHandler} encType="multipart/form-data">
                        <div className={styles["file-sub-container"]}>
                            {file.fileName === "" &&
                                !isFileReady && [
                                    <p key={0} className={styles["select-heading"]}>
                                        Select{" "}
                                        <DescriptionIcon
                                            className={styles["file-icon"]}
                                        />{" "}
                                        to convert
                                    </p>,
                                    <FileInput
                                        key={1}
                                        inputChangeHandler={inputChangeHandler}
                                    />,
                                    <p key={2} className={styles["file-name"]}>
                                        No file selected
                                    </p>,
                                ]}
                            {file.fileName !== "" &&
                                !isFileReady && [
                                    <p key={0} className={styles["select-heading"]}>
                                        To start the
                                        <AutoFixHighIcon
                                            className={styles["file-icon"]}
                                            style={{ marginLeft: 7, marginRight: 7 }}
                                        />
                                        Hit
                                    </p>,
                                    <ConvertButton
                                        key={1}
                                        setShowLoadingModal={setShowLoadingModal}
                                    />,
                                    <p
                                        key={2}
                                        className={styles["file-name"]}
                                    >{`${file.fileName}.pdf`}</p>,
                                ]}
                            {file.fileName !== "" &&
                                isFileReady && [
                                    <p
                                        key={0}
                                        className={styles["select-heading"]}
                                        style={{ marginLeft: -10 }}
                                    >
                                        Your
                                        <DescriptionIcon
                                            className={styles["file-icon"]}
                                        />
                                        is ready to{" "}
                                        <DownloadIcon style={{ marginLeft: 5.3 }} />
                                    </p>,
                                    <DownloadButton key={1} fileUrl={fileUrl} />,
                                ]}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
