import { useState, useContext } from "react";
import { Navbar, Container, Image, InputGroup, Button, Form, DropdownButton, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import ModalLogin from "./ModalLogin";
import ModalLoginDone from "./ModalLoginDone";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, authenticateUser } = useContext(AuthContext);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    try {
      await authenticateUser();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" id="navbar">
      <Container id="logo">
        <Link to="/">
          <Image src="logoair.png" width="100px" />
        </Link>
      </Container>

      <Container>
        <InputGroup className="mb-3">
          <Form.Control placeholder="Introducir destino" style={{ borderRadius: "20px" }} />
          <Button variant="outline-secondary" style={{ borderRadius: "20px" }}>
            <img src="lupa.png" width="20px" />
          </Button>
        </InputGroup>
      </Container>

      <Container style={{ display: "flex", justifyContent: "flex-end" }}>
        <h5>Hazte anfitrion</h5>
        <DropdownButton id="dropdown-basic-button" title="Config" variant="secondary">
          {isLoggedIn ? (
            <>
              <NavDropdown.Item as={Link} to="/own-ads">Mis Alojamientos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/favoriteshousing">Mis Favoritos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/user-profile">Perfil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
            </>
          ) : (
            <NavDropdown.Item onClick={() => setShowLoginModal(true)}>Entrar o Registrarme</NavDropdown.Item>
          )}
        </DropdownButton>
      </Container>
      <ModalLogin
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        onSignupSuccess={() => {
          setShowLoginModal(false);
          setShowSuccessModal(true);
        }}
      />
      <ModalLoginDone
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />
    </Navbar>
  );
}

export default NavBar;