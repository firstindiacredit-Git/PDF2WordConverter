import React from "react";
import styles from "./DownloadButton.module.css";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";

const DownloadButton = (props) => {
    const onButtonClick = () => {
        let fileName = props.fileUrl.split("/");
        fileName = fileName[fileName.length - 1];
        saveAs(props.fileUrl, fileName);
    };
    return (
        <button className={styles["button"]} onClick={onButtonClick}>
            <DownloadIcon style={{ marginRight: 5 }} />
            Download
        </button>
    );
};

export default DownloadButton;
