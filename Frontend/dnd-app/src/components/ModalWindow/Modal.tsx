import React from "react";
import styles from "./Modal.module.css"; // CSS-стилі для модального вікна

interface ModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
                <h4>{message}</h4>
                <div className={styles["modal-buttons"]}>
                    <button onClick={onConfirm} className={styles["confirm-button"]}>
                        Підтвердити
                    </button>
                    <button onClick={onCancel} className={styles["cancel-button"]}>
                        Скасувати
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
