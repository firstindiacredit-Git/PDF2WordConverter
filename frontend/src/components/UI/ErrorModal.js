import React from "react";
import styles from "./ErrorModal.module.css";
import { Player } from "@lottiefiles/react-lottie-player";
import ErrorAnimation from "../../lotties/error.json";

const ErrorModal = (props) => {
    return (
        <div
            className={styles["error-container"]}
            onClick={() => props.setShowErrorModal(false)}
        >
            <Player
                src={ErrorAnimation}
                className="player"
                duration={5000}
                loop
                autoplay
                style={{
                    width: "46%",
                    marginTop: 20,
                }}
            />
            <p className={styles.message}>Oops!!! Something went wrong...</p>
        </div>
    );
};

export default ErrorModal;
