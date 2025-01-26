import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <div>
      <div className="backdrop" onClick={onClose}></div>
      <dialog className="modal" open>
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
