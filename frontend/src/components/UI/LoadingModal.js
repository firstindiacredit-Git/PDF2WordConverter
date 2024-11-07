import React from "react";
import styles from "./LoadingModal.module.css";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../lotties/paper-plane-animation.json";

const LoadingModal = () => {
    return (
        <div className={styles["loading-container"]}>
            <Player
                src={animationData}
                className="player"
                loop
                autoplay
                style={{
                    width: "60%",
                    marginTop: 20,
                }}
            />
            <p className={styles.message}>
                Just sit back and relax until we finish the conversion
            </p>
        </div>
    );
};

export default LoadingModal;
