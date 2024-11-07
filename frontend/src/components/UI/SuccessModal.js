import React from "react";
import styles from "./Success.module.css";
import { Player } from "@lottiefiles/react-lottie-player";
import SuccessPlane from "../../lotties/success-plane.json";

const SuccessModal = (props) => {
    return (
        <div
            className={styles["success-container"]}
            onClick={() => props.setShowSuccessModal(false)}
        >
            <Player
                src={SuccessPlane}
                className="player"
                loop
                autoplay
                style={{
                    width: "43%",
                    marginTop: 20,
                }}
            />
            <p className={styles.message}>Your file is successfully converted !!!</p>
        </div>
    );
};

export default SuccessModal;
