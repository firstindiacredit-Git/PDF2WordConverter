import React from "react";
import styles from "./FileInput.module.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const FileInput = (props) => {
    return (
        <div className={styles["file-input"]}>
            <input
                type="file"
                name="file"
                id="file"
                className={styles.file}
                onChange={props.inputChangeHandler}
                accept=".pdf"
            />
            <label htmlFor="file" className={styles.label}>
                <AttachFileIcon className={styles.icon} />
                <p>Choose file</p>
            </label>
        </div>
    );
};

export default FileInput;
