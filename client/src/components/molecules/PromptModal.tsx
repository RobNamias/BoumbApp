import React, { useState } from "react";
import Modal from "./Modal";
import styles from "../../styles/modules/Modal.module.scss";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setValue(defaultValue || "");
    }
  }

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {message && (
          <p style={{ color: "#ccc", fontSize: "1rem", margin: 0 }}>
            {message}
          </p>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={styles.modalInput} // Use SCSS class if available, or style block below
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "100%",
            padding: "12px",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "white",
            fontSize: "1rem",
          }}
        />

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnCancel}>
            {cancelLabel}
          </button>
          <button onClick={handleConfirm} className={styles.btnConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PromptModal;
