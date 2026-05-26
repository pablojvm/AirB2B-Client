import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function ModalHost({ show, handleClose }) {
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
        <div className="airb2b-modal__title">Conviértete en anfitrión</div>
      </div>
      <Modal.Body className="airb2b-modal__body text-center">
        <img
          src="/casa.png"
          alt="Crear anuncio"
          className="airb2b-modal__hero-img"
        />
        <p className="text-muted">
          Publica tu espacio en AirB2B. Te guiamos paso a paso para que tardes
          unos pocos minutos.
        </p>
        <Button
          as={Link}
          to="/newHouse"
          onClick={handleClose}
          className="airb2b-btn-primary w-100"
        >
          Empezar ahora
        </Button>
      </Modal.Body>
    </Modal>
  );
}

export default ModalHost;
