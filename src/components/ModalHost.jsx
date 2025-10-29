import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function ModalHost({ show, handleClose }) {


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header
        style={{ display: "flex", justifyContent: "center" }}
        closeButton
      >
        <Modal.Title>¿Quieres ser anfitrión?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="light" as={Link} to={"/newHouse"} onClick={handleClose}>Sube tu alojamiento!</Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalHost;
