import { FaExclamationTriangle } from "react-icons/fa";
import styles from "./cssFolder/ConfirmModal.module.css";

function ConfirmModal({
  isOpen,
  title = "Confirm",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>
          <FaExclamationTriangle
            style={{ color: "#f59e0b", marginRight: "8px" }}
          />
          {title}
        </h2>

        <p>{message}</p>

        <div className={styles.buttonContainer}>
          <button
            className={styles.cancelButton}
            onClick={(event) => {
              event.preventDefault();
              onCancel();
            }}
          >
            {cancelText}
          </button>

          <button
            className={styles.confirmButton}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
