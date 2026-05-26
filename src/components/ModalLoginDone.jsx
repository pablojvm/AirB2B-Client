import { Modal, Button } from "react-bootstrap";

function ModalLoginDone({ show, handleClose }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="airb2b-modal"
    >
      <div className="airb2b-modal__header">
        <button
          type="button"
          className="airb2b-modal__close"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="airb2b-modal__title">¡Bienvenido a AirB2B!</div>
      </div>
      <Modal.Body className="airb2b-modal__body text-center">
        {/* Animación CSS de check verde que se dibuja */}
        <div className="success-check" aria-hidden>
          <svg viewBox="0 0 80 80" width="96" height="96">
            <circle
              className="success-check__circle"
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="#008a05"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              className="success-check__tick"
              d="M22 42 L36 56 L60 28"
              fill="none"
              stroke="#008a05"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-muted mt-3">
          Tu cuenta ya está lista. Explora alojamientos, guarda favoritos y
          comparte los tuyos.
        </p>
        <Button className="airb2b-btn-primary w-100 mt-2" onClick={handleClose}>
          Empezar
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ModalLoginDone;
