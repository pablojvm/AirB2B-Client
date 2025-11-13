import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function ModalHost({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header style={{ justifyContent: "center" }} closeButton>
        <Modal.Title style={{ textAlign: "center", width: "100%" }}>
          ¿Quieres crear un anuncio?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Button
          variant="light"
          as={Link}
          to={"/newHouse"}
          onClick={handleClose}
        >
          <img src="/casa.png" width="300px" />
          <h6>Sube tu alojamiento!</h6>
        </Button>
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