import { Modal, Button } from "react-bootstrap";

function ModalLoginDone({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>¡Registro completado con éxito!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Ya puedes iniciar sesión y empezar a explorar alojamientos, guardarlos como favoritos o publicar los tuyos.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalLoginDone;