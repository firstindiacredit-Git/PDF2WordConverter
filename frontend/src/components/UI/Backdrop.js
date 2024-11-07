import React from "react";
import styles from "./Backdrop.module.css";
import ErrorModal from "./ErrorModal";
import LoadingModal from "./LoadingModal";
import SuccessModal from "./SuccessModal";

const Backdrop = (props) => {
    // return React.createPortal(
    //     <div className={styles.backdrop}></div>,
    //     document.getElementById("overlays")
    // );
    return (
        <>
            <div className={styles.backdrop}>
                {props.loading && <LoadingModal />}
                {props.success && (
                    <SuccessModal setShowSuccessModal={props.setShowSuccessModal} />
                )}
                {props.error && (
                    <ErrorModal setShowErrorModal={props.setShowErrorModal} />
                )}
            </div>
        </>
    );
};

export default Backdrop;
