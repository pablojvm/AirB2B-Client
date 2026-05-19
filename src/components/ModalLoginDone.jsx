import { Modal, Button } from "react-bootstrap";

function ModalLoginDone({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="airb2b-modal">
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
        <img
          src="/gif.GIF"
          width="220"
          alt=""
          style={{ borderRadius: 12, marginBottom: 16 }}
        />
        <p className="text-muted">
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
