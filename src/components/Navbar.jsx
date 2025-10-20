import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import { InputGroup, Button, Form, Container, NavDropdown, DropdownButton,} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { useContext } from "react";
import { useState } from "react";
import ModalLogin from "./ModalLogin";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    try {
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const [showSignupModal, setShowSignupModal] = useState(false);
  const toggleSignupModal = () => setShowSignupModal(!showSignupModal);
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary" id="navbar">
      <Container id="logo">
        <Image src="logoair.png" width="100px" />
      </Container>
      <Container>
        <></>
        <>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Introducir destino"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              style={{ borderRadius: "20px" }}
            />
            <Button
              variant="outline-secondary"
              id="button-addon2"
              style={{ borderRadius: "20px" }}
            >
              <img src="lupa.png" width={"20px"} />
            </Button>
          </InputGroup>
        </>
      </Container>
      <Container style={{ display: "flex", justifyContent: "flex-end" }}>
        <h4 as={Link} to="">
          Hazte anfitrion
        </h4>
        <DropdownButton
          id="dropdown-basic-button"
          title="Config"
          src="config.png"
          variant="secondary"
        >
          {isLoggedIn ? (
            <NavDropdown.Item as={Link} to="/user-profile" eventKey="4.1">
              Perfil
            </NavDropdown.Item>
          ) : (
            <NavDropdown.Item onClick={toggleSignupModal} eventKey="4.1">
              Entrar o Registrarme
            </NavDropdown.Item>
          )}

          <NavDropdown.Item as={Link} to="/own-ads" eventKey="4.2">
            Mis Anuncios
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to={`/own-reviews`} eventKey="4.3">
            Mis Comentarios
          </NavDropdown.Item>
          {isLoggedIn && (
            <>
              <NavDropdown.Divider />
              <NavDropdown.Item eventKey="4.4" onClick={handleLogout}>
                Cerrar Sesión
              </NavDropdown.Item>
            </>
          )}
        </DropdownButton>
      </Container>
      {/* Pass actual boolean and a close function that sets it false */}
      <ModalLogin show={showSignupModal} handleClose={() => setShowSignupModal(false)} />
    </Navbar>
  );
}

export default NavBar;
